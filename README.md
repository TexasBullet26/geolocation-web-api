# API (Geolocation) usage

---

**Minimal web page using the Geolocation Web API.**

### Purpose

---

Demonstrating how to implement the Geolocation Web API that will prompt the user for their location; if accepted, the users location will be logged in the console.

### Implementation

---

First we made a simple `html` file with our `script` inside the `body`. Then we styled our page by linking our `styles` directory with our `styles.css` file.

Then we use the `navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);` method:

- `getCurrentPosition()` method has three arguments (last two are optional):
  - `successCallback` - callback (`PositionCallback`) that logs the lat & long (`position`) in the console if the user accepts the prompt for location access.
  - `errorCallback` - callback (`PositionErrorCallback`) that logs an error (`error`) to the console.
  - `options` - object (`PositionOptions`) that will give us higher accuracy of the users location.

We are executing the script using `<script></script>` tags inside the `body` of our `html`. (We have a `src` directory with a `getUserLocation.js` file as a resource). We are not using this file, but this would be a better way of organizing our code if this were a larger project.

***GIII Technologies*** | (Github)[https://github.com/TexasBullet26] | (Twitter)[https://twitter.com/LanzerGIII]
