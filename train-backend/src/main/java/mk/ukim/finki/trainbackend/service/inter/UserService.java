package mk.ukim.finki.trainbackend.service.inter;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    ResponseEntity<?> refreshAccessToken(String refreshToken);
}
