package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.model.dtos.TrainStopDTO;

import java.util.List;

public interface TrainStopService {

    List<TrainStop> findAll();
    TrainStop findById(Long id);
    List<TrainStop> getTrainStopsForRoute(String routeName);

    TrainStop add(TrainStopDTO dto);
    TrainStopDTO edit(Long id, TrainStopDTO dto);
    void delete(Long id);
}
