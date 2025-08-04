package mk.ukim.finki.trainbackend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@Entity
public class TrainRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne
    private TrainStop startStation;

    @ManyToOne
    private TrainStop endStation;

    @ToString.Exclude
    @JsonManagedReference
    @OneToMany(mappedBy = "trainRoute", cascade = CascadeType.ALL)
    private List<TrainRouteStop> stationStops;

    private Double totalRouteTime;
    private Double routeDistance;
    private boolean isWorking;

    private Double centerLatitude;
    private Double centerLongitude;
    private Integer zoomLevel;
}
