package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Data;
import mk.ukim.finki.trainbackend.model.User;
import mk.ukim.finki.trainbackend.model.enums.Role;

@Data
public class UserDetailsDto {
    private String username;
    private Role role;

    public static UserDetailsDto of(User user) {
        UserDetailsDto dto = new UserDetailsDto();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getUserRole());

        return dto;
    }
}
