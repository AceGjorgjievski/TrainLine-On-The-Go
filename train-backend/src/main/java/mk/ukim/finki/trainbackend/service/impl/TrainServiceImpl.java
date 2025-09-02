package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.Train;
import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.ActiveTrainDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainDto;
import mk.ukim.finki.trainbackend.repository.TrainRepository;
import mk.ukim.finki.trainbackend.repository.TrainStopTimeRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainService;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;
    private final TrainStopTimeRepository trainStopTimeRepository;

    @Override
    public List<Train> findAllByRouteName(String routeName) {
        List<Train> allTrainList = this.trainRepository.findAllByRouteName(routeName);

        return allTrainList;
    }

    @Override
    public List<TrainDto> convertToDto(List<Train> trainList) {
        List<TrainDto> trainDtoList = new ArrayList<>();

        for(Train t : trainList) {
            trainDtoList.add(new TrainDto(
                    t.getId(),
                    t.getName(),
                    t.getSpeed(),
                    t.getRoute().getName()
                    )
            );
        }
        return trainDtoList;
    }

    @Override
    public List<ActiveTrainDto> getActiveTrainsForRoute(String routeName) {

        List<Train> trainsList = this.findAllByRouteName(routeName);
        LocalTime now = LocalTime.now();

        List<ActiveTrainDto> activeTrainDtoList = new ArrayList<>();

        for (Train t : trainsList) {
            List<TrainStopTime> trainOrderByTrainStopTimeAsc =
                    this.trainStopTimeRepository.findByTrainOrderByTrainStopTimeAsc(t.getId());

            LocalTime startTime = trainOrderByTrainStopTimeAsc.get(0).getTrainStopTime();
            LocalTime endTime = trainOrderByTrainStopTimeAsc.get(trainOrderByTrainStopTimeAsc.size() - 1).getTrainStopTime();

            if (now.isAfter(startTime) && now.isBefore(endTime)) {
                activeTrainDtoList.add(
                        new ActiveTrainDto(
                                t.getId(),
                                t.getName(),
                                t.getSpeed(),
                                now
                        )
                );
            }
        }

        return activeTrainDtoList;
    }

    @Override
    public List<Train> findAllByRouteNameStartingWith(String routeNamePrefix) {
        return this.trainRepository.findAllByRouteNameStartingWith(routeNamePrefix);
    }

    @Override
    public List<Train> findAllByRouteNameEndinggWith(String routeNameSuffix) {
        return this.trainRepository.findAllByRouteNameEndingWith(routeNameSuffix);
    }
}
