package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.repository.TrainRouteRepository;
import mk.ukim.finki.trainbackend.repository.TrainRouteStopRepository;
import mk.ukim.finki.trainbackend.repository.TrainStopRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteStopService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TrainRouteStopServiceImpl implements TrainRouteStopService {

    private final TrainRouteStopRepository trainRouteStopRepository;
    private final TrainRouteRepository trainRouteRepository;
    private final TrainStopRepository trainStopRepository;

    @Override
    public List<TrainRouteStop> findStopsByRouteName(String routeName) {
        return this.trainRouteStopRepository.findStopsByRouteName(routeName);
    }

    @Override
    public void add(String routeName, String trainStopName, Integer sequenceNumber) {

        TrainRoute trainRoute = this.trainRouteRepository.findByNameAndIsWorking(routeName, true);
        final TrainStop trainStop = this.trainStopRepository.findByName(trainStopName);

        TrainRouteStop trainRouteStop = new TrainRouteStop(trainRoute, trainStop, sequenceNumber);

        this.trainRouteStopRepository.save(trainRouteStop);
    }

    @Override
    public void delete(Long id) {
        this.trainRouteStopRepository.deleteById(id);
    }
}
