package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class EditTrainRouteDto {
    private String name;
    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;
    private List<Long> stationStops;
    private Double totalRouteTime;
    private Double routeDistance;
    private boolean isWorking;
}