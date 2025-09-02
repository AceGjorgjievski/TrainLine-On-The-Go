package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.repository.TrainRouteStopRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteStopService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainRouteStopServiceImpl implements TrainRouteStopService {

    private final TrainRouteStopRepository trainRouteStopRepository;

    @Override
    public List<TrainRouteStop> findStopsByRouteName(String routeName) {
        return this.trainRouteStopRepository.findStopsByRouteName(routeName);
    }
}
