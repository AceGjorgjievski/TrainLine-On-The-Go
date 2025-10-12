package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.model.dtos.*;
import mk.ukim.finki.trainbackend.model.exceptions.TrainRouteNotFoundException;
import mk.ukim.finki.trainbackend.model.exceptions.TrainRouteStopNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainRouteRepository;
import mk.ukim.finki.trainbackend.repository.TrainStopRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteStopService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@AllArgsConstructor
public class TrainRouteServiceImpl implements TrainRouteService {

    private final TrainRouteRepository trainRouteRepository;
    private final TrainStopRepository trainStopRepository;
    private final TrainRouteStopService trainRouteStopService;

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
                trainRoute.getZoomLevel(),
                trainRoute.getTotalRouteTime(),
                trainRoute.getRouteDistance(),
                trainRoute.isWorking()
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
    public List<TrainRouteDTO> findAllDepartureTrainRoutes() {
        return this.findAllByNameStartingWith("Skopje");
    }

    @Override
    public List<TrainRouteDTO> findAllArrivalTrainRoutes() {
        return this.findAllByNameEndingWith("Skopje");
    }

    public Optional<TrainRoute> edit(Long id, EditTrainRouteDto dto) {
        Optional<TrainRoute> optionalRoute = this.trainRouteRepository.findById(id);
        if (optionalRoute.isEmpty()) {
            return Optional.empty();
        }

        TrainRoute trainRoute = optionalRoute.get();

        trainRoute.setName(dto.getName());
        trainRoute.setCenterLatitude(dto.getCenterLatitude());
        trainRoute.setCenterLongitude(dto.getCenterLongitude());
        trainRoute.setZoomLevel(dto.getZoomLevel());
        trainRoute.setTotalRouteTime(dto.getTotalRouteTime());
        trainRoute.setRouteDistance(dto.getRouteDistance());
        trainRoute.setWorking(dto.isWorking());

        List<TrainStop> newTrainStopList = new ArrayList<>();

        for(Long trainRouteStopId : dto.getStationStops()) {
            TrainRouteStop trainRouteStop = trainRouteStopService
                    .findById(trainRouteStopId)
                    .orElseThrow(() -> new TrainRouteStopNotFoundException(id));

            TrainStop trainStop = trainRouteStop.getTrainStop();
            newTrainStopList.add(trainStop);
        }

        if (newTrainStopList.isEmpty()) {
            return Optional.empty();
        }

        List<TrainRouteStop> existingStops = trainRouteStopService
                .findAllByTrainRoute_IdOrderByStationSequenceNumberAsc(trainRoute.getId());

        boolean isDifferent = existingStops.size() != newTrainStopList.size()
                || IntStream.range(0, newTrainStopList.size())
                .anyMatch(i -> !existingStops.get(i).getTrainStop().getId().equals(newTrainStopList.get(i).getId()));

        if (isDifferent) {
            trainRoute.getStationStops().clear();
            existingStops.stream().forEach(i -> {
                this.trainRouteStopService.delete(i.getId());
            });
            for (int i = 0; i < newTrainStopList.size(); i++) {
                TrainRouteStop routeStop = new TrainRouteStop(trainRoute, newTrainStopList.get(i), i + 1);
                trainRoute.getStationStops().add(routeStop);
            }
        }

        trainRoute.setStartStation(newTrainStopList.get(0));
        trainRoute.setEndStation(newTrainStopList.get(newTrainStopList.size() - 1));


        TrainRoute updated = trainRouteRepository.save(trainRoute);
        return Optional.of(updated);
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
        newRoute.setStationStops(new ArrayList<>());

        for (int i = 0; i < trainStopList.size(); i++) {
            TrainStop stop = trainStopList.get(i);
            TrainRouteStop trainRouteStop = new TrainRouteStop(
                    newRoute,
                    stop,
                    i + 1
            );

            newRoute.getStationStops().add(trainRouteStop);
        }
        trainRouteRepository.save(newRoute);
    }

    @Override
    public void delete(Long routeId) {
        TrainRoute trainRoute = this.findById(routeId);
        List<TrainRouteStop> stationStops = trainRoute.getStationStops();
        for(TrainRouteStop trainRouteStop : stationStops) {
            this.trainRouteStopService.delete(trainRouteStop.getId());
        }
        this.trainRouteRepository.delete(trainRoute);
    }
}
