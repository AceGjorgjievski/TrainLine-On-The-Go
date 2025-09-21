package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.model.dtos.CreateTrainRouteDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteStopDTO;
import mk.ukim.finki.trainbackend.model.dtos.TrainStopDTO;
import mk.ukim.finki.trainbackend.model.exceptions.TrainRouteNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainRouteRepository;
import mk.ukim.finki.trainbackend.repository.TrainStopRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrainRouteServiceImpl implements TrainRouteService {

    private final TrainRouteRepository trainRouteRepository;
    private final TrainStopRepository trainStopRepository;

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

    @Override
    public TrainRoute edit(Long id) {
        TrainRoute trainRoute = this.findById(id);


        return null;
    }

    @Override
    public void add(CreateTrainRouteDto dto) {
        List<TrainStop> trainStopList = dto.getStationStops().stream()
                .map(id -> this.trainStopRepository.findById(id.longValue()))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());

        TrainRoute newRoute = new TrainRoute();
        newRoute.setName(dto.getName());
        newRoute.setCenterLatitude(dto.getCenterLatitude());
        newRoute.setCenterLongitude(dto.getCenterLongitude());
        newRoute.setZoomLevel(dto.getZoomLevel());
        newRoute.setStartStation(trainStopList.get(0));
        newRoute.setEndStation(trainStopList.get(trainStopList.size() - 1));
        newRoute.setTotalRouteTime(dto.getTotalRouteTime());
        newRoute.setRouteDistance(dto.getRouteDistance());
        newRoute.setWorking(dto.isWorking());


        trainRouteRepository.save(newRoute);

    }
}
