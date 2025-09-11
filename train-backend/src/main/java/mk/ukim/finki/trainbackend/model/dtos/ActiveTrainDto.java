package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ActiveTrainDto {
    private Long id;
    private String name;
    private Double speed;
    private LocalTime currentStopTime;
    private List<TrainStopTimeDto> trainStopTimeList;
    private String currentPassedStationName;
    private Integer currentPassedStationNumber;
    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;
}
