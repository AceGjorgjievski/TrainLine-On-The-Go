package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainStopRepository extends JpaRepository<TrainStop, Long> {
}
