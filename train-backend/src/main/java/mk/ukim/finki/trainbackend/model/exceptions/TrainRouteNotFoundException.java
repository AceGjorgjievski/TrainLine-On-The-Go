package mk.ukim.finki.trainbackend.model.exceptions;

public class TrainRouteNotFoundException extends RuntimeException {
    public TrainRouteNotFoundException(Long routeId) {
        super(String.format("The train route with id: %d was not found", routeId));
    }
}
