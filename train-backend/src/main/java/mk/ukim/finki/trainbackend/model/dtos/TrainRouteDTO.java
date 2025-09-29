package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class TrainRouteDTO {
    private Long id;
    private String name;
    private List<TrainRouteStopDTO> stationStops;
    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;
    private Double totalRouteTime;
    private Double routeDistance;
    private boolean isWorking;
}
