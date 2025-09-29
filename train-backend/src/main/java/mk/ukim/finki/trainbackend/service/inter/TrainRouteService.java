package mk.ukim.finki.trainbackend.service.inter;

import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.dtos.CreateTrainRouteDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;

import java.util.List;

public interface TrainRouteService {

    List<TrainRoute> findAll();
    TrainRoute findById(Long routeId);

    TrainRoute findByName(String name);
    TrainRouteDTO convertToDTO(TrainRoute trainRoute);

    List<TrainRouteDTO> findAllByNameStartingWith(String routeNamePrefix);
    List<TrainRouteDTO> findAllByNameEndingWith(String routeNameSuffix);

    List<TrainRouteDTO> findAllDepartureTrainRoutes();
    List<TrainRouteDTO> findAllArrivalTrainRoutes();

    TrainRoute edit(Long id, TrainRouteDTO dto);

    void add(CreateTrainRouteDto dto);
    void delete(Long routeId);
}
