package mk.ukim.finki.trainbackend.service.impl;

import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteStopDTO;
import mk.ukim.finki.trainbackend.model.dtos.TrainStopDTO;
import mk.ukim.finki.trainbackend.model.exceptions.TrainRouteNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainRouteRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public TrainRoute findByName(String name) {
        return this.trainRouteRepository.findByNameAndIsWorking(name, true);
    }

    @Override
    public TrainRouteDTO convertToDTO(TrainRoute trainRoute) {
        List<TrainRouteStopDTO> trainRouteStopDTOList = trainRoute.getStationStops()
                .stream()
                .sorted(Comparator.comparing(TrainRouteStop::getStationSequenceNumber))
                .map(stop -> new TrainRouteStopDTO(
                        stop.getId(),
                        new TrainStopDTO(
                                stop.getTrainStop().getId(),
                                stop.getTrainStop().getName(),
                                stop.getTrainStop().getLatitude(),
                                stop.getTrainStop().getLongitude()
                        ),
                        stop.getStationSequenceNumber()
                )).collect(Collectors.toList());

        return new TrainRouteDTO(
                trainRoute.getId(),
                trainRoute.getName(),
                trainRouteStopDTOList,
                trainRoute.getCenterLatitude(),
                trainRoute.getCenterLongitude(),
                trainRoute.getZoomLevel()
        );
    }

    @Override
    public List<TrainRouteDTO> findAllByNameStartingWith(String routeNamePrefix) {
        List<TrainRoute> trainRoutes = this.trainRouteRepository.findAllByNameStartingWith(routeNamePrefix);

        return trainRoutes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TrainRouteDTO> findAllByNameEndingWith(String routeNameSuffix) {
        List<TrainRoute> trainRoutes = this.trainRouteRepository.findAllByNameEndingWith(routeNameSuffix);

        return trainRoutes.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
