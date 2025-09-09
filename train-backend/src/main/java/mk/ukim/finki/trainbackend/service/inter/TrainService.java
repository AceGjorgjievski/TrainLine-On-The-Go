package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.Train;
import mk.ukim.finki.trainbackend.model.dtos.ActiveTrainDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainDto;

import java.util.List;

public interface TrainService {

    List<Train> findAllByRouteName(String routeName);
    List<TrainDto> convertToDto(List<Train> trainList);
    List<ActiveTrainDto> getActiveTrainsForRoute(String routeName);

    List<Train> findAllByRouteNameStartingWith(String routeNamePrefix);
    List<Train> findAllByRouteNameEndingWith(String routeNameSuffix);

    List<ActiveTrainDto> findAllActiveTrains();
}
