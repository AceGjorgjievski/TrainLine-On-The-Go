package mk.ukim.finki.trainbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
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

//    private String arrivalTime;
//
//    private String departureTime;
}
