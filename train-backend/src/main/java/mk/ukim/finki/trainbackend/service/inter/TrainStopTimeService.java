package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainStopTime;

import java.util.List;

public interface TrainStopTimeService {
    List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(Long trainId);
}
