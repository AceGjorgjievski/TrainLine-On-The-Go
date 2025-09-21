package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CreateTrainRouteDto {
    private String name;
    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;
    private List<Integer> stationStops;
    private Double totalRouteTime;
    private Double routeDistance;
    private boolean isWorking;
}
