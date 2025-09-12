package mk.ukim.finki.trainbackend.service.impl;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.Train;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.StationDto;
import mk.ukim.finki.trainbackend.model.dtos.TimetableDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.model.exceptions.TrainStopTimeNotFoundException;
import mk.ukim.finki.trainbackend.repository.TrainStopTimeRepository;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteStopService;
import mk.ukim.finki.trainbackend.service.inter.TrainService;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TrainStopTimeServiceImpl implements TrainStopTimeService {

    private final TrainStopTimeRepository trainStopTimeRepository;
    private final TrainRouteService trainRouteService;
    private final TrainService trainService;
    private final TrainRouteStopService trainRouteStopService;

    @Override
    public List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(Long trainId) {
        return this.trainStopTimeRepository.findAllByTrainOrderByTrainStopTimeAsc(trainId);
    }


    @Override
    public List<TimetableDto> getTimetableByMode(String mode) {
        List<String> routeNameList;

        if (mode.equalsIgnoreCase("departure")) {
            routeNameList = this.trainRouteService.findAllByNameStartingWith("Skopje")
                    .stream()
                    .map(TrainRouteDTO::getName)
                    .collect(Collectors.toList());
        } else { //arrival
            routeNameList = this.trainRouteService.findAllByNameEndingWith("Skopje")
                    .stream()
                    .map(TrainRouteDTO::getName)
                    .collect(Collectors.toList());
        }

        List<TimetableDto> result = new ArrayList<>();

        for (String routeName : routeNameList) {
            List<Train> trains = this.trainService.findAllByRouteName(routeName);
            List<TrainRouteStop> stops = this.trainRouteStopService.findStopsByRouteName(routeName);

            TrainRouteStop firstStop = stops.get(0);

            trains.sort(Comparator.comparing(train -> {
                Optional<TrainStopTime> stopTimeOpt = findByTrainIdAndTrainRouteStopId(train.getId(), firstStop.getId());
                return stopTimeOpt
                        .map(TrainStopTime::getTrainStopTime)
                        .orElse(LocalTime.MAX);
            }));

            List<StationDto> stationDtos = new ArrayList<>();
            for (TrainRouteStop trainRouteStop : stops) {
                String stationName = trainRouteStop.getTrainStop().getName();

                List<String> times = new ArrayList<>();
                for (Train train : trains) {
                    Optional<TrainStopTime> trainStopTime =
                            this.findByTrainIdAndTrainRouteStopId(
                                    train.getId(), trainRouteStop.getId()
                            );

                    times.add(
                            trainStopTime.map(
                                    t -> t.getTrainStopTime().toString().substring(0, 5)
                            ).orElse("-")
                    );
                }
                stationDtos.add(new StationDto(stationName, times));
            }
            result.add(new TimetableDto(
                    routeName,
                    trains.stream().map(Train::getName).collect(Collectors.toList()),
                    stationDtos
            ));
        }

        return result;
    }

    @Override
    public Optional<TrainStopTime> findById(Long id) {
        return this.trainStopTimeRepository.findById(id);
    }

    @Override
    public Optional<TrainStopTime> edit(Long id, LocalTime localTime) {
        TrainStopTime trainStopTime = this.findById(id)
                .orElseThrow(() -> new TrainStopTimeNotFoundException(id));

        trainStopTime.setTrainStopTime(localTime);

        this.trainStopTimeRepository.save(trainStopTime);

        return Optional.of(trainStopTime);
    }

    @Override
    public Optional<TrainStopTime> findByTrainIdAndTrainRouteStopId(Long trainId, Long trainRouteStopId) {
        return this.trainStopTimeRepository.findByTrain_IdAndTrainRouteStop_Id(trainId, trainRouteStopId);
    }
}
