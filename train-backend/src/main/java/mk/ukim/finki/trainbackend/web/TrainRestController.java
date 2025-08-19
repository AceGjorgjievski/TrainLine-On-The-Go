package mk.ukim.finki.trainbackend.web;

import mk.ukim.finki.trainbackend.model.dtos.ActiveTrainDto;
import mk.ukim.finki.trainbackend.service.inter.TrainService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/train")
public class TrainRestController {

    private final TrainService trainService;

    public TrainRestController(TrainService trainService) {
        this.trainService = trainService;
    }

    @GetMapping("/{routeName}")
    public ResponseEntity<List<ActiveTrainDto>> getActiveTrainsByTrainRoute(
            @PathVariable("routeName") String routeName
    ) {
        List<ActiveTrainDto> activeTrainDtoList = this.trainService.getActiveTrainsForRoute(routeName);

        return ResponseEntity.ok(activeTrainDtoList);
    }
}
