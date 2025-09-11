package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TrainDto {
    private Long id;
    private String name;
    private Double speed;
    private String trainRouteName;
    private boolean active;
}
