package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TrainRouteDTO {
    private Long id;
    private String name;
    private List<TrainRouteStopDTO> stationStops;

    public TrainRouteDTO(Long id, String name, List<TrainRouteStopDTO> stationStops) {
        this.id = id;
        this.name = name;
        this.stationStops = stationStops;
    }
}
