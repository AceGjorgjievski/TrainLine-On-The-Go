package mk.ukim.finki.trainbackend.repository;

import mk.ukim.finki.trainbackend.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    @Query("select t from Train t where t.route.name = :routeName")
    List<Train> findAllByRouteName(@Param("routeName") String routeName);
}
