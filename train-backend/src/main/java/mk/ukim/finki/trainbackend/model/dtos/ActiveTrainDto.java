package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class ActiveTrainDto {
    private Long id;
    private String name;
    private Double speed;
    private LocalTime currentStopTime;
}
