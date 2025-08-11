package mk.ukim.finki.trainbackend.web;

import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import mk.ukim.finki.trainbackend.config.filters.JwtAuthenticationFilter;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/login")
@CrossOrigin("http://localhost:3000")
public class LoginRestController {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public LoginRestController(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @PostMapping
    public String doLogin(HttpServletRequest request,
                          HttpServletResponse response) throws JsonProcessingException {
        Authentication auth = this.jwtAuthenticationFilter.attemptAuthentication(request, response);
        return this.jwtAuthenticationFilter.generateJwt(response, auth);
    }
}
