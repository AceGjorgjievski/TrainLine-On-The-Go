package mk.ukim.finki.trainbackend.model.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrainStopDTO {
    private Long id;
    private String name;
    private Double latitude;
    private Double longitude;

    public TrainStopDTO(Long id, String name, Double latitude, Double longitude) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}