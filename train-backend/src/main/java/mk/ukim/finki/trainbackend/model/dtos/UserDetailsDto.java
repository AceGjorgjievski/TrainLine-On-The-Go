package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Data;
import mk.ukim.finki.trainbackend.model.User;

@Data
public class UserDetailsDto {
    private String username;

    public static UserDetailsDto of(User user) {
        UserDetailsDto dto = new UserDetailsDto();
        dto.setUsername(user.getUsername());

        return dto;
    }
}
