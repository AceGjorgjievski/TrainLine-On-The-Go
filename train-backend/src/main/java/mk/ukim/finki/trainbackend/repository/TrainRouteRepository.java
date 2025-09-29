package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRouteRepository extends JpaRepository<TrainRoute, Long> {
    TrainRoute findByNameAndIsWorking(String name, boolean isWorking);

    List<TrainRoute> findAllByNameStartingWith(String routeNamePrefix);
    List<TrainRoute> findAllByNameEndingWith(String routeNameSuffix);

    void deleteAllById(Long id);
}
