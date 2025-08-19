package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainStopTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainStopTimeRepository extends JpaRepository<TrainStopTime, Long> {

    @Query("select ts from TrainStopTime ts where ts.train.id = :trainId order by ts.trainStopTime asc")
    List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(@Param("trainId") Long trainId);
}
