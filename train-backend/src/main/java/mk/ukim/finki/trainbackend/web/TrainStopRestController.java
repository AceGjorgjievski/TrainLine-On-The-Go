package mk.ukim.finki.trainbackend.web;


import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.service.inter.TrainStopService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/train-stop")
@AllArgsConstructor
public class TrainStopRestController {

    private final TrainStopService trainStopService;

    @GetMapping
    public ResponseEntity<List<TrainStop>> getAll() {
        List<TrainStop> trainStops = this.trainStopService.findAll();
        return ResponseEntity.ok(trainStops);
    }

    @GetMapping("/{routeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainStop>> getTrainStopsById(@PathVariable String routeId) {
        List<TrainStop> trainStopsForRoute = this.trainStopService.getTrainStopsForRoute(routeId);
        return ResponseEntity.ok(trainStopsForRoute);
    }
}
