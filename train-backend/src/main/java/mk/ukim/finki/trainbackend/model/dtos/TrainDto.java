package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainDto {
    private Long id;
    private String name;
    private Double speed;
    private String trainRouteName;

    public TrainDto(Long id, String name, Double speed, String trainRouteName) {
        this.id = id;
        this.name = name;
        this.speed = speed;
        this.trainRouteName = trainRouteName;
    }
}
