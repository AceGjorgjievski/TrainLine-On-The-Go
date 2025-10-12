package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRouteStopRepository extends JpaRepository<TrainRouteStop, Long> {

    @Query("select trs from TrainRouteStop trs " +
            "where trs.trainRoute.name = :routeName " +
            "order by trs.stationSequenceNumber")
    List<TrainRouteStop> findStopsByRouteName(@Param("routeName") String routeName);

    List<TrainRouteStop> findAllByTrainRoute_IdOrderByStationSequenceNumberAsc(Long trainRouteId);
}
