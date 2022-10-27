var bb = {
  success: 0,
  error: 0,
  blackberryTimeoutId: -1,
};
function handleBlackBerryLocationTimeout() {
  if (bb.blackberryTimeoutId != -1) {
    bb.error({
      message: "Timeout error",
      code: 3,
    });
  }
}
function handleBlackBerryLocation() {
  clearTimeout(bb.blackberryTimeoutId);
  bb.blackberryTimeoutId = -1;
  if (bb.success && bb.error) {
    if (
      blackberry.location.latitude == 0 &&
      blackberry.location.longitude == 0
    ) {
      bb.error({
        message: "Position unavailable",
        code: 2,
      });
    } else {
      var a = null;
      if (blackberry.location.timestamp) {
        a = new Date(blackberry.location.timestamp);
      }
      bb.success({
        timestamp: a,
        coords: {
          latitude: blackberry.location.latitude,
          longitude: blackberry.location.longitude,
        },
      });
    }
    bb.success = null;
    bb.error = null;
  }
}
var geoPosition = (function () {
  var b = {};
  var d = null;
  var a = "undefined";
  var c = "http://freegeoip.net/json/?callback=JSONPCallback";
  b.getCurrentPosition = function (g, e, f) {
    d.getCurrentPosition(g, e, f);
  };
  b.jsonp = {
    callbackCounter: 0,
    fetch: function (e, h) {
      var f = "JSONPCallback_" + this.callbackCounter++;
      window[f] = this.evalJSONP(h);
      e = e.replace("=JSONPCallback", "=" + f);
      var g = document.createElement("SCRIPT");
      g.src = e;
      document.getElementsByTagName("HEAD")[0].appendChild(g);
    },
    evalJSONP: function (e) {
      return function (f) {
        e(f);
      };
    },
  };
  b.confirmation = function () {
    return confirm(
      "This Webpage wants to track your physical location.\nDo you allow it?"
    );
  };
  b.init = function () {
    try {
      var f = typeof navigator.geolocation != a;
      if (!f) {
        if (!b.confirmation()) {
          return false;
        }
      }
      if (typeof geoPositionSimulator != a && geoPositionSimulator.length > 0) {
        d = geoPositionSimulator;
      } else {
        if (typeof bondi != a && typeof bondi.geolocation != a) {
          d = bondi.geolocation;
        } else {
          if (f) {
            d = navigator.geolocation;
            b.getCurrentPosition = function (j, e, i) {
              function h(k) {
                var l;
                if (typeof k.latitude != a) {
                  l = {
                    timestamp: k.timestamp,
                    coords: {
                      latitude: k.latitude,
                      longitude: k.longitude,
                    },
                  };
                } else {
                  l = k;
                }
                j(l);
              }
              d.getCurrentPosition(h, e, i);
            };
          } else {
            if (
              typeof window.blackberry != a &&
              blackberry.location.GPSSupported
            ) {
              if (typeof blackberry.location.setAidMode == a) {
                return false;
              }
              blackberry.location.setAidMode(2);
              b.getCurrentPosition = function (i, e, h) {
                bb.success = i;
                bb.error = e;
                if (h.timeout) {
                  bb.blackberryTimeoutId = setTimeout(
                    "handleBlackBerryLocationTimeout()",
                    h.timeout
                  );
                } else {
                  bb.blackberryTimeoutId = setTimeout(
                    "handleBlackBerryLocationTimeout()",
                    60000
                  );
                }
                blackberry.location.onLocationUpdate(
                  "handleBlackBerryLocation()"
                );
                blackberry.location.refreshLocation();
              };
              d = blackberry.location;
            } else {
              if (
                typeof Mojo != a &&
                typeof Mojo.Service.Request != "Mojo.Service.Request"
              ) {
                d = true;
                b.getCurrentPosition = function (i, e, h) {
                  parameters = {};
                  if (h) {
                    if (h.enableHighAccuracy && h.enableHighAccuracy == true) {
                      parameters.accuracy = 1;
                    }
                    if (h.maximumAge) {
                      parameters.maximumAge = h.maximumAge;
                    }
                    if (h.responseTime) {
                      if (h.responseTime < 5) {
                        parameters.responseTime = 1;
                      } else {
                        if (h.responseTime < 20) {
                          parameters.responseTime = 2;
                        } else {
                          parameters.timeout = 3;
                        }
                      }
                    }
                  }
                  r = new Mojo.Service.Request("palm://com.palm.location", {
                    method: "getCurrentPosition",
                    parameters: parameters,
                    onSuccess: function (j) {
                      i({
                        timestamp: j.timestamp,
                        coords: {
                          latitude: j.latitude,
                          longitude: j.longitude,
                          heading: j.heading,
                        },
                      });
                    },
                    onFailure: function (j) {
                      if (j.errorCode == 1) {
                        e({
                          code: 3,
                          message: "Timeout",
                        });
                      } else {
                        if (j.errorCode == 2) {
                          e({
                            code: 2,
                            message: "Position unavailable",
                          });
                        } else {
                          e({
                            code: 0,
                            message: "Unknown Error: webOS-code" + errorCode,
                          });
                        }
                      }
                    },
                  });
                };
              } else {
                if (typeof device != a && typeof device.getServiceObject != a) {
                  d = device.getServiceObject("Service.Location", "ILocation");
                  b.getCurrentPosition = function (i, e, h) {
                    function k(n, m, l) {
                      if (m == 4) {
                        e({
                          message: "Position unavailable",
                          code: 2,
                        });
                      } else {
                        i({
                          timestamp: null,
                          coords: {
                            latitude: l.ReturnValue.Latitude,
                            longitude: l.ReturnValue.Longitude,
                            altitude: l.ReturnValue.Altitude,
                            heading: l.ReturnValue.Heading,
                          },
                        });
                      }
                    }
                    var j = new Object();
                    j.LocationInformationClass = "BasicLocationInformation";
                    d.ILocation.GetLocation(j, k);
                  };
                } else {
                  b.getCurrentPosition = function (i, e, h) {
                    b.jsonp.fetch(c, function (j) {
                      i({
                        timestamp: j.timestamp,
                        coords: {
                          latitude: j.latitude,
                          longitude: j.longitude,
                          heading: j.heading,
                        },
                      });
                    });
                  };
                  d = true;
                }
              }
            }
          }
        }
      }
    } catch (g) {
      if (typeof console != a) {
        console.log(g);
      }
      return false;
    }
    return d != null;
  };
  return b;
})();
