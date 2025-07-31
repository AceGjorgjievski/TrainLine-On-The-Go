package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.repository.TrainStopRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import mk.ukim.finki.trainbackend.service.inter.TrainStopService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrainStopServiceImpl implements TrainStopService {

    private final TrainStopRepository trainStopRepository;
    private final TrainRouteService trainRouteService;


    @Override
    public List<TrainStop> findAll() {
        return this.trainStopRepository.findAll();
    }

    @Override
    public List<TrainStop> getTrainStopsForRoute(Long routeId) {

        TrainRoute trainRoute = this.trainRouteService.findById(routeId);

        return trainRoute.getStationStops().stream()
                .map(TrainRouteStop::getTrainStop)
                .collect(Collectors.toList());
    }
}
