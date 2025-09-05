package mk.ukim.finki.trainbackend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRouteStop;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteStopService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/train-route-stop")
@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class TrainRouteStopRestController {

    private final TrainRouteStopService trainRouteStopService;

    @GetMapping("/{routeName}")
    public ResponseEntity<List<TrainRouteStop>> getTrainRouteStopsByRouteName(@PathVariable String routeName) {
        List<TrainRouteStop> stopsByRouteName = this.trainRouteStopService.findStopsByRouteName(routeName);

        return ResponseEntity.ok(stopsByRouteName);
    }
}
