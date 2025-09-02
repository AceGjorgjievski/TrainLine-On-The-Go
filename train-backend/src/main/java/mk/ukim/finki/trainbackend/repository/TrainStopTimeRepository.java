package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainStopTime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrainStopTimeRepository extends JpaRepository<TrainStopTime, Long> {

    @Query("select ts from TrainStopTime ts " +
            "where ts.train.id = :trainId " +
            "order by ts.trainStopTime asc")
    List<TrainStopTime> findByTrainOrderByTrainStopTimeAsc(@Param("trainId") Long trainId);

    @Query("select ts from TrainStopTime ts " +
            "where ts.trainRouteStop.trainRoute.name = :routeName " +
            "order by ts.trainStopTime")
    List<TrainStopTime> findByRouteName(@Param("routeName") String routeName);

    @Query("select ts from TrainStopTime ts where ts.trainRouteStop.trainRoute.name = :routeName ")
    List<TrainStopTime> findByRouteNameAndMode(@Param("routeName") String routeName, @Param("mode") String mode);

    Optional<TrainStopTime> findByTrain_IdAndTrainRouteStop_Id(Long trainId, Long trainRouteStopId);
}
