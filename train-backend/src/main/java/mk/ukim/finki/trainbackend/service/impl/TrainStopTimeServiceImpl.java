package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.TimetableDto;
import mk.ukim.finki.trainbackend.model.exceptions.TrainStopTimeNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainStopTimeRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TrainStopTimeServiceImpl implements TrainStopTimeService {

    private final TrainStopTimeRepository trainStopTimeRepository;

    public TrainStopTimeServiceImpl(TrainStopTimeRepository trainStopTimeRepository) {
        this.trainStopTimeRepository = trainStopTimeRepository;
    }

    @Override
    public List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(Long trainId) {
        return this.trainStopTimeRepository.findByTrainOrderByTrainStopTimeAsc(trainId);
    }

    @Override
    public List<TimetableDto> getTimetableByRouteName(String routeName) {
        List<TrainStopTime> trainStopTimeList =
                this.trainStopTimeRepository.findByRouteName(routeName);

        List<TimetableDto> timetableDtoList = new ArrayList<>();

        for(TrainStopTime tst : trainStopTimeList) {
            timetableDtoList.add(new TimetableDto(
                    tst.getId(),
                    tst.getTrain().getName(),
                    tst.getTrainStopTime(),
                    tst.getTrainRouteStop().getTrainStop().getName(),
                    routeName
            ));
        }

        return timetableDtoList;
    }

    @Override
    public Optional<TrainStopTime> findById(Long id) {
        return this.trainStopTimeRepository.findById(id);
    }

    @Override
    public Optional<TrainStopTime> edit(Long id, LocalTime localTime) {
        TrainStopTime trainStopTime = this.findById(id)
                .orElseThrow(() -> new TrainStopTimeNotFoundException(id));

        trainStopTime.setTrainStopTime(localTime);

        this.trainStopTimeRepository.save(trainStopTime);

        return Optional.of(trainStopTime);
    }
}
