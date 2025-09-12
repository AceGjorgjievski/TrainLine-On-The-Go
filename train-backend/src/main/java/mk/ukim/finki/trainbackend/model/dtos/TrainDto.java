package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import mk.ukim.finki.trainbackend.model.enums.TrainStatus;

@Getter
@Setter
@AllArgsConstructor
public class TrainDto {
    private Long id;
    private String name;
    private Double speed;
    private String trainRouteName;
    private TrainStatus trainStatus;
}
