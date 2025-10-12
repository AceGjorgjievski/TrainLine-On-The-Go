package mk.ukim.finki.trainbackend.model.exceptions;

public class TrainRouteStopNotFoundException extends RuntimeException{
    public TrainRouteStopNotFoundException(Long id) {
        super(String.format("Train Route Stop was not found with id: %d", id));
    }
}
