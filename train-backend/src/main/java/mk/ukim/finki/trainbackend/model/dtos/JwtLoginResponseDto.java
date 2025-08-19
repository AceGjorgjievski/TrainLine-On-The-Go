package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtLoginResponseDto {
    private String accessToken;
    private String refreshToken;
    private UserDetailsDto userDetailsDto;
}
