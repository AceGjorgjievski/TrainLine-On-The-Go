package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainRouteStopDTO {
    private Long id;
    private TrainStopDTO trainStop;
    private Integer stationSequenceNumber;

    public TrainRouteStopDTO(Long id, TrainStopDTO trainStop, Integer stationSequenceNumber) {
        this.id = id;
        this.trainStop = trainStop;
        this.stationSequenceNumber = stationSequenceNumber;
    }
}
