package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainRouteStop;

import java.util.List;

public interface TrainRouteStopService {
    List<TrainRouteStop> findStopsByRouteName(String routeName);
    void add(String routeName, String trainStop, Integer sequenceNumber);
    void delete(Long id);
}
