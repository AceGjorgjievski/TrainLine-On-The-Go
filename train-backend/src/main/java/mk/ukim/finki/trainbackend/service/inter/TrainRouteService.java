package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainRoute;

import java.util.List;

public interface TrainRouteService {

    List<TrainRoute> findAll();
    TrainRoute findById(Long routeId);
}
