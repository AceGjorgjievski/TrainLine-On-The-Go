package mk.ukim.finki.trainbackend.model.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class StationDto {
    private String stationName;
    private List<String> times;
}
