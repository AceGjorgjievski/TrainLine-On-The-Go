package mk.ukim.finki.trainbackend.model;


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
public class TrainStopTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Train train;

    @ManyToOne
    private TrainRouteStop trainRouteStop;

    private String arrivalTime;

    private String departureTime;
}
