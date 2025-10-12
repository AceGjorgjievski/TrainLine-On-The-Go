package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainRouteStop;

import java.util.List;
import java.util.Optional;

public interface TrainRouteStopService {
    List<TrainRouteStop> findStopsByRouteName(String routeName);
    void add(String routeName, String trainStop, Integer sequenceNumber);
    void delete(Long id);
    Optional<TrainRouteStop> findById(Long id);
    List<TrainRouteStop> findAllByTrainRoute_IdOrderByStationSequenceNumberAsc(Long trainRouteId);
}
