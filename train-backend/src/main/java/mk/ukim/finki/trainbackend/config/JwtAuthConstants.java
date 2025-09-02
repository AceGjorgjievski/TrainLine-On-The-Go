package mk.ukim.finki.trainbackend.config;

public class JwtAuthConstants {
    public static final String SECRET = System.getenv("jwt_secret");
    public static final long EXPIRATION_TIME = 3_600_000;
//    public static final long EXPIRATION_TIME = 10_000;
    public static final long REFRESH_EXPIRATION_TIME = 864_000_000;
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
}
