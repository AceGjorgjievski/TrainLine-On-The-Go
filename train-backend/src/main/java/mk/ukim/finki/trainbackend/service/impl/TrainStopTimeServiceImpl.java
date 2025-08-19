package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.repository.TrainStopTimeRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.stereotype.Service;

import java.util.List;

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
}
