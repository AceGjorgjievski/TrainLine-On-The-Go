package mk.ukim.finki.trainbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@Entity
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double speed;

    private LocalDateTime startingTime;

    private LocalDateTime lastUpdate;

    @ManyToOne
    private TrainStop nextTrainStop;

    @ManyToOne
    private TrainRoute route;

    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL)
    private List<TrainStopTime> stopTimes;

    private String timeStatus;
}
