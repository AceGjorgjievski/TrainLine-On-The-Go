package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class TrainStopTimeDto {
    private String trainName;
    private LocalTime trainStopTime;
    private TrainRouteStopDTO trainRouteStopDTOList;
}
