package mk.ukim.finki.trainbackend.service.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import mk.ukim.finki.trainbackend.config.JwtAuthConstants;
import mk.ukim.finki.trainbackend.model.User;
import mk.ukim.finki.trainbackend.model.dtos.UserDetailsDto;
import mk.ukim.finki.trainbackend.repository.UserRepository;
import mk.ukim.finki.trainbackend.service.inter.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return this.userRepository.findUserByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username));
    }

    @Override
    public ResponseEntity<?> refreshAccessToken(String refreshToken) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(JwtAuthConstants.SECRET.getBytes());
            DecodedJWT decodedJWT = JWT.require(algorithm).build().verify(refreshToken);

            String username = decodedJWT.getSubject();

            User user = this.userRepository.findUserByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException(username));

            String newAccessToken = JWT.create()
                    .withSubject(new ObjectMapper().writeValueAsString(UserDetailsDto.of(user)))
                    .withExpiresAt(new Date(System.currentTimeMillis() + JwtAuthConstants.EXPIRATION_TIME))
                    .sign(algorithm);

            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
        }
    }
}
