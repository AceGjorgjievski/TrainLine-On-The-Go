package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.model.Train;
import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.ActiveTrainDto;
import mk.ukim.finki.trainbackend.repository.TrainRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainService;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;
    private final TrainStopTimeService trainStopTimeService;

    public TrainServiceImpl(TrainRepository trainRepository, TrainStopTimeService trainStopTimeService) {
        this.trainRepository = trainRepository;
        this.trainStopTimeService = trainStopTimeService;
    }

    @Override
    public List<Train> findAllByRouteName(String routeName) {
        return this.trainRepository.findAllByRouteName(routeName);
    }

    @Override
    public List<ActiveTrainDto> getActiveTrainsForRoute(String routeName) {

        List<Train> trainsList = this.findAllByRouteName(routeName);
        LocalTime now = LocalTime.now();

        List<ActiveTrainDto> activeTrainDtoList = new ArrayList<>();

        for (Train t : trainsList) {
            List<TrainStopTime> trainOrderByTrainStopTimeAsc =
                    this.trainStopTimeService.findByTrainOrderByTrainStopTimeAsc(t.getId());

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
}
