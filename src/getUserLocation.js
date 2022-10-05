const successCallback = (position) => {
  console.log(position);
};

const errorCallback = (error) => {
  console.log(error);
};

// navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

const id = navigator.watchPosition(successCallback, errorCallback);

const options = {
  enableHighAccuracy: true,
  timeout: 10000,
};

navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback,
  options
);

// navigator.geolocation.clearWatch(id);

/**
const LOCATION = navigator.geolocation;

let currentLocation = LOCATION.getCurrentPosition();

let watchLocation = LOCATION.watchPosition();
*/
