package mk.ukim.finki.trainbackend.web;

import lombok.AllArgsConstructor;
import mk.ukim.finki.trainbackend.model.TrainStopTime;
import mk.ukim.finki.trainbackend.model.dtos.TimetableDto;
import mk.ukim.finki.trainbackend.service.inter.TrainStopTimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/train-stop-time")
@AllArgsConstructor
public class TrainStopTimeRestController {

    private final TrainStopTimeService trainStopTimeService;

    @GetMapping("/{mode}/timetable")
    public ResponseEntity<List<TimetableDto>> getTimetableForRoute(@PathVariable String mode) {
        List<TimetableDto> timetableDtoList = this.trainStopTimeService.getTimetableByMode(mode);
        return ResponseEntity.ok(timetableDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainStopTime> findById(@PathVariable Long id) {
        return this.trainStopTimeService.findById(id)
                .map(tst -> ResponseEntity.ok().body(tst))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<TrainStopTime> edit(@PathVariable Long id, @RequestBody LocalTime localTime) {
        return this.trainStopTimeService.edit(id, localTime)
                .map(tst -> ResponseEntity.ok().body(tst))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }
}
