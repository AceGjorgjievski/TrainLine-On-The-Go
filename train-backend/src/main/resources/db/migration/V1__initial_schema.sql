CREATE TABLE train_stop
(
    id        BIGSERIAL PRIMARY KEY,
    name      VARCHAR(255),
    latitude  DOUBLE PRECISION,
    longitude DOUBLE PRECISION
);

CREATE TABLE train_route
(
    id               BIGSERIAL PRIMARY KEY,
    name             VARCHAR(255),
    start_station_id BIGINT,
    end_station_id   BIGINT,
    total_route_time DOUBLE PRECISION,
    route_distance   DOUBLE PRECISION,
    is_working       BOOLEAN,
    center_latitude  DOUBLE PRECISION,
    center_longitude DOUBLE PRECISION,
    zoom_level       INTEGER,
    CONSTRAINT fk_train_route_start FOREIGN KEY (start_station_id)
        REFERENCES train_stop (id),
    CONSTRAINT fk_train_route_end FOREIGN KEY (end_station_id)
        REFERENCES train_stop (id)
);

CREATE TABLE train_route_stop
(
    id                      BIGSERIAL PRIMARY KEY,
    train_route_id          BIGINT,
    train_stop_id           BIGINT,
    station_sequence_number INTEGER,
    CONSTRAINT fk_train_route_stop_route FOREIGN KEY (train_route_id)
        REFERENCES train_route (id),
    CONSTRAINT fk_train_route_stop_stop FOREIGN KEY (train_stop_id)
        REFERENCES train_stop (id)
);

CREATE TABLE train
(
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(255),
    speed    DOUBLE PRECISION,
    route_id BIGINT,
    CONSTRAINT fk_train_route FOREIGN KEY (route_id)
        REFERENCES train_route (id)
);

CREATE TABLE train_stop_time
(
    id                  BIGSERIAL PRIMARY KEY,
    train_id            BIGINT,
    train_route_stop_id BIGINT,
    train_stop_time     TIME,
    CONSTRAINT fk_train_stop_time_train FOREIGN KEY (train_id)
        REFERENCES train (id),
    CONSTRAINT fk_train_stop_time_route_stop FOREIGN KEY (train_route_stop_id)
        REFERENCES train_route_stop (id)
);

CREATE TABLE train_user
(
    id                         BIGSERIAL PRIMARY KEY,
    username                   VARCHAR(255) UNIQUE NOT NULL,
    password                   VARCHAR(255)        NOT NULL,
    is_account_non_expired     BOOLEAN DEFAULT TRUE,
    is_account_non_locked      BOOLEAN DEFAULT TRUE,
    is_credentials_non_expired BOOLEAN DEFAULT TRUE,
    is_enabled                 BOOLEAN DEFAULT TRUE,
    user_role                  VARCHAR(50)
);
