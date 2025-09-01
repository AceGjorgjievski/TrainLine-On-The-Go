package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.TimetableDto;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TrainStopTimeService {
    List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(Long trainId);
    List<TimetableDto> getTimetableByRouteName(String routeName);

    Optional<TrainStopTime> findById(Long id);

    Optional<TrainStopTime> edit(Long id, LocalTime localTime);
}
