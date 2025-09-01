package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
public class TimetableDto {
    private Long id;
    private String trainName;
    private LocalTime trainStopTime;
    private String stationName;
    private String routeName;

    public TimetableDto(Long id, String trainName, LocalTime trainStopTime, String stationName, String routeName) {
        this.id = id;
        this.trainName = trainName;
        this.trainStopTime = trainStopTime;
        this.stationName = stationName;
        this.routeName = routeName;
    }
}
