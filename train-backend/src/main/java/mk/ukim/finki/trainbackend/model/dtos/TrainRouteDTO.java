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
    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;

    public TrainRouteDTO(Long id, String name, List<TrainRouteStopDTO> stationStops, Double centerLatitude, Double centerLongitude, Integer zoomLevel) {
        this.id = id;
        this.name = name;
        this.stationStops = stationStops;
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.zoomLevel = zoomLevel;
    }
}
