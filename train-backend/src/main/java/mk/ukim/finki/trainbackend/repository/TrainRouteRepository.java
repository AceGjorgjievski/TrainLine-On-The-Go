package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainRouteRepository extends JpaRepository<TrainRoute, Long> {
}
