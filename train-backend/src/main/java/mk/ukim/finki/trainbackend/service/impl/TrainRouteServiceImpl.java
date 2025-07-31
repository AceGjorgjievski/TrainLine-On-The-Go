package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.exceptions.TrainRouteNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainRouteRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainRouteServiceImpl implements TrainRouteService {

    private final TrainRouteRepository trainRouteRepository;

    public TrainRouteServiceImpl(TrainRouteRepository trainRouteRepository) {
        this.trainRouteRepository = trainRouteRepository;
    }

    @Override
    public List<TrainRoute> findAll() {
        return this.trainRouteRepository.findAll();
    }

    @Override
    public TrainRoute findById(Long routeId) {
        return this.trainRouteRepository.findById(routeId)
                .orElseThrow(() -> new TrainRouteNotFoundException(routeId));
    }
}
