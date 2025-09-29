package mk.ukim.finki.trainbackend.web;


import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.dtos.CreateTrainRouteDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@AllArgsConstructor
@RequestMapping("/api/train-route")
public class TrainRouteRestController {

    private final TrainRouteService trainRouteService;

    @GetMapping("/{name}")
    public ResponseEntity<TrainRouteDTO> findByName(@PathVariable String name) {
        TrainRoute trainRoute = this.trainRouteService.findByName(name);
        if(trainRoute == null) {
            return ResponseEntity.notFound().build();
        }

        TrainRouteDTO trainRouteDTO = this.trainRouteService.convertToDTO(trainRoute);
        return ResponseEntity.ok(trainRouteDTO);
    }

    @GetMapping("/departure")
    public ResponseEntity<List<TrainRouteDTO>> findAllDepartureTrainRoutes() {
        List<TrainRouteDTO> departureTrainRoutes = this.trainRouteService.findAllDepartureTrainRoutes();
        return ResponseEntity.ok(departureTrainRoutes);
    }

    @GetMapping("/arrival")
    public ResponseEntity<List<TrainRouteDTO>> findAllArrivalTrainRoutes() {
        List<TrainRouteDTO> arrivalTrainRoutes = this.trainRouteService.findAllArrivalTrainRoutes();
        return ResponseEntity.ok(arrivalTrainRoutes);
    }

    @PostMapping("/add")
    public ResponseEntity<CreateTrainRouteDto> add(@RequestBody CreateTrainRouteDto dto) {
        this.trainRouteService.add(dto);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<String> edit(@PathVariable Long id, @RequestBody TrainRouteDTO dto) {
        this.trainRouteService.edit(id, dto);
        return ResponseEntity.ok("");
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        this.trainRouteService.delete(id);
        return ResponseEntity.ok(String.format("Train Route: %d delete", id));
    }
}
