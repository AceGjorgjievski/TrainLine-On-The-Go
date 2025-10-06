package mk.ukim.finki.trainbackend.web;


import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainStop;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.model.dtos.TrainStopDTO;
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

    @GetMapping("/{id}")
    public ResponseEntity<TrainStop> get(@PathVariable Long id) {
        TrainStop found = this.trainStopService.findById(id);
        return ResponseEntity.ok(found);
    }

    @GetMapping("/{routeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TrainStop>> getTrainStopsById(@PathVariable String routeId) {
        List<TrainStop> trainStopsForRoute = this.trainStopService.getTrainStopsForRoute(routeId);
        return ResponseEntity.ok(trainStopsForRoute);
    }

    @PostMapping("/add")
    public ResponseEntity<TrainStop> add(@RequestBody TrainStopDTO dto) {
        TrainStop trainStop = this.trainStopService.add(dto);
        return ResponseEntity.ok(trainStop);
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<TrainStopDTO> edit(@PathVariable Long id, @RequestBody TrainStopDTO dto) {
        TrainStopDTO edited = this.trainStopService.edit(id, dto);
        return ResponseEntity.ok(edited);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        this.trainStopService.delete(id);
        return ResponseEntity.ok(String.format("Deleted successfully: %d", id));
    }
}
