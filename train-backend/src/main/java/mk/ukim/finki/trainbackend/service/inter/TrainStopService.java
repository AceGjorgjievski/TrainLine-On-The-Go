package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainStop;

import java.util.List;

public interface TrainStopService {

    List<TrainStop> findAll();
    List<TrainStop> getTrainStopsForRoute(String routeName);
}
