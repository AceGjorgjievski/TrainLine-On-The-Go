package mk.ukim.finki.trainbackend.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mk.ukim.finki.trainbackend.config.filters.JwtAuthenticationFilter;
import mk.ukim.finki.trainbackend.model.dtos.JwtLoginResponseDto;
import mk.ukim.finki.trainbackend.service.inter.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginRestController {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserService userService;

    public LoginRestController(JwtAuthenticationFilter jwtAuthenticationFilter, UserService userService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<JwtLoginResponseDto> doLogin(HttpServletRequest request, HttpServletResponse response) throws JsonProcessingException {
        Authentication auth = this.jwtAuthenticationFilter.attemptAuthentication(request, response);
        JwtLoginResponseDto dto = this.jwtAuthenticationFilter.generateTokens(auth, response);
        //tried to get refresh token, but does not work

        Cookie anotherCookie = new Cookie("jwtCookie", "token123");
        anotherCookie.setHttpOnly(true);
        anotherCookie.setSecure(true);
        anotherCookie.setPath("/");
        anotherCookie.setMaxAge(60 * 60 * 24);

        response.addCookie(anotherCookie);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/cookie")
    public ResponseEntity<?> cookieMethod(HttpServletRequest request) {
        //tried to get refresh token, but does not work

        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return ResponseEntity.badRequest().body("No cookies found");
        }

        for (Cookie cookie : cookies) {
            System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
        }

        // Now get the specific cookie
        Optional<Cookie> refreshCookie = Arrays.stream(cookies)
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst();

        if (refreshCookie.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token cookie missing");
        }

        String token = refreshCookie.get().getValue();
        // Validate token, etc.

        return ResponseEntity.ok("New token issued");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        //tried to get refresh token, but does not work
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return ResponseEntity.badRequest().body("No cookies found");
        }

        for (Cookie cookie : cookies) {
            System.out.println("Cookie: " + cookie.getName() + " = " + cookie.getValue());
        }

        // Now get the specific cookie
        Optional<Cookie> refreshCookie = Arrays.stream(cookies)
                .filter(c -> "refreshToken".equals(c.getName()))
                .findFirst();

        if (refreshCookie.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token cookie missing");
        }

        String token = refreshCookie.get().getValue();
        // Validate token, etc.

        return ResponseEntity.ok("New token issued");
    }
}
