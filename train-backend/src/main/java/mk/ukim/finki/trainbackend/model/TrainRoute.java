package mk.ukim.finki.trainbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @OneToMany(mappedBy = "trainRoute", cascade = CascadeType.ALL)
    private List<TrainRouteStop> stationStops;

    private Double totalRouteTime;

    private Double routeDistance;

    private boolean isWorking;


}
