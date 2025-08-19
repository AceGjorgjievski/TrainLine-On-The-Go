package mk.ukim.finki.trainbackend.config.filters;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mk.ukim.finki.trainbackend.config.JwtAuthConstants;
import mk.ukim.finki.trainbackend.model.User;
import mk.ukim.finki.trainbackend.model.dtos.JwtLoginResponseDto;
import mk.ukim.finki.trainbackend.model.dtos.UserDetailsDto;
import mk.ukim.finki.trainbackend.model.exceptions.PasswordsDoNotMatchException;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Date;

public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
        this.setAuthenticationManager(authenticationManager);
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        User creds = null;
        try {
            String text = new String(request.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            System.out.println(text);
            creds = new ObjectMapper().readValue(text, User.class);
        } catch (IOException e) {
            e.printStackTrace();
        }

        if(creds == null) {
            return super.attemptAuthentication(request, response);
        }

        UserDetails userDetails = this.userDetailsService.loadUserByUsername(creds.getUsername());
        if(!this.passwordEncoder.matches(creds.getPassword(), userDetails.getPassword())) {
            throw new PasswordsDoNotMatchException();
        }

        return this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        userDetails.getUsername(), creds.getPassword(), userDetails.getAuthorities()
                )
        );
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authResult
    ) throws IOException, ServletException {
        this.generateJwt(response, authResult);
        super.successfulAuthentication(request, response, chain, authResult);
    }

    public JwtLoginResponseDto generateTokens(Authentication auth, HttpServletResponse response) throws JsonProcessingException {
        String accessToken = this.generateJwt(response, auth);

        User user = (User) auth.getPrincipal();
        String refreshToken = this.generateRefreshToken(user);

        /*
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) JwtAuthConstants.REFRESH_EXPIRATION_TIME / 1000);
//        cookie.setDomain("localhost");
//        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);
        */

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofDays(10))
                .build();

        response.addHeader("Set-Cookie", refreshCookie.toString());


        UserDetailsDto userDetailsDto = UserDetailsDto.of(user);

        return new JwtLoginResponseDto(accessToken, null, userDetailsDto);
    }

    private String generateJwt(HttpServletResponse response, Authentication authResult) throws JsonProcessingException {
        User userDetails = (User) authResult.getPrincipal();
        String token = JWT.create()
                .withSubject(new ObjectMapper().writeValueAsString(UserDetailsDto.of(userDetails)))
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtAuthConstants.EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(JwtAuthConstants.SECRET.getBytes()));

        response.addHeader(JwtAuthConstants.HEADER_STRING, JwtAuthConstants.TOKEN_PREFIX + token);
        return token;
    }

    private String generateRefreshToken(User user) {
        return JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + JwtAuthConstants.REFRESH_EXPIRATION_TIME))
                .sign(Algorithm.HMAC256(JwtAuthConstants.SECRET.getBytes()));
    }
}
