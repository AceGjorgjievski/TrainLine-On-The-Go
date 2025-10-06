package mk.ukim.finki.trainbackend.model.exceptions;

public class TrainStopNotFoundException extends RuntimeException{
    public TrainStopNotFoundException(Long id) {
        super(String.format("Train stop with id: %d was not found.", id));
    }
}
