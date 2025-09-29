package mk.ukim.finki.trainbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class TrainRouteStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    private TrainRoute trainRoute;

    @ManyToOne
    private TrainStop trainStop;

    private Integer stationSequenceNumber;

    public TrainRouteStop(TrainRoute route, TrainStop trainStop, Integer sequenceNumber) {
        this.trainRoute = route;
        this.trainStop = trainStop;
        this.stationSequenceNumber = sequenceNumber;
    }
}
