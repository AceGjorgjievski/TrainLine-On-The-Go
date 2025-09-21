package mk.ukim.finki.trainbackend.web;


import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainRoute;
import mk.ukim.finki.trainbackend.model.dtos.CreateTrainRouteDto;
import mk.ukim.finki.trainbackend.model.dtos.TrainRouteDTO;
import mk.ukim.finki.trainbackend.service.inter.TrainRouteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/add")
    public ResponseEntity<CreateTrainRouteDto> add(@RequestBody CreateTrainRouteDto dto) {
        System.out.println(dto.getName());
        System.out.println(dto.getCenterLatitude());
        System.out.println(dto.getCenterLongitude());
        dto.getStationStops().stream().forEach(System.out::println);

        this.trainRouteService.add(dto);

        return ResponseEntity.ok(dto);
    }
}
