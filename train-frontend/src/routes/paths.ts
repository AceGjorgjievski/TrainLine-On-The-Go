export const paths = {
  login: () => `/login`,
  home: () => `/`,
  timetable: () => `/timetable`,
  live: () => `/live`,
  admin: {
    root: () => `/admin`,
    trainStops: () => `/admin/train-stops`,
    trains: () => `/admin/trains`,
  }
};
