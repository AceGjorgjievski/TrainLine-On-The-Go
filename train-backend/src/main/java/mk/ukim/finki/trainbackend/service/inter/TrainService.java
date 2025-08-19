package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.Train;
import mk.ukim.finki.trainbackend.model.dtos.ActiveTrainDto;

import java.util.List;

public interface TrainService {

    List<Train> findAllByRouteName(String routeName);
    List<ActiveTrainDto> getActiveTrainsForRoute(String routeName);
}
