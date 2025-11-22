package mk.ukim.finki.trainbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication(
        scanBasePackages = "mk.ukim.finki.trainbackend"
)
@EntityScan(basePackages = "mk.ukim.finki.trainbackend.model")
@EnableJpaRepositories(basePackages = "mk.ukim.finki.trainbackend.repository")
public class TrainBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrainBackendApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
