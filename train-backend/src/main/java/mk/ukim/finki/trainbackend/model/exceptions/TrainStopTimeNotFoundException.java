package mk.ukim.finki.trainbackend.model.exceptions;

public class TrainStopTimeNotFoundException extends RuntimeException{
    public TrainStopTimeNotFoundException(Long id) {
        super(String.format("TrainStopTime was not found with id: ", id));
    }
}
