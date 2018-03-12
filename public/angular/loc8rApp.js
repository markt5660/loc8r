angular.module('loc8rApp', []);

/** Controller for Homepage list of locations 
 ** (GeoLocation version)
 */
var locationListCtrl = function ($scope, loc8rData, geolocation) {
  $scope.message = "Checking your location";

  $scope.getData = function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    $scope.message = "Searching for nearby places";
    loc8rData.locationByCoords(lat, lng).then(
      function (data) {
        // success
        $scope.message = data.data.length > 0 ? "" : "No locations found";
        $scope.data = { locations: data.data };
      },
      function (e) {
        // error
        $scope.message = "Sorry, something's gone wrong";
        console.log(e);
      }
    );
  };

  $scope.showError = function (error) {
    $scope.$apply(function () {
      $scope.message = error.message;
    });
  };

  $scope.noGeo = function () {
    $scope.$apply(function () {
      $scope.message = "Geolocation not supported by this browser";
    });
  };

  geolocation.getPosition($scope.getData, $scope.showError, $scope.NoGeo);
};

/** (Private) Helper function to verify a value is a number */
var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/** Filter to reformat distance to convenient, human-readable form. 
 ** NOTE: This is different than the book due to changes in Node to
 ** use a newer geoJSON library (distance in meters instead of rads).
 */
var formatDistance = function () {
  return function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
      if (distance >= 1000) {
        // Longer distance, convert to fractional Km (nearest tenth)
        numDistance = parseFloat(distance / 1000).toFixed(1);
        unit = " km";
      } else {
        // Shorter distance, convert to whole Meters
        numDistance = parseInt(distance, 10);
        unit = " m";
      }
      return numDistance + unit;
    } else {
      return "?";
    }
  };
};

/** Directive to generate "star rating" iconography from a numeric value */
var ratingStars = function () {
  return {
    scope : {
      thisRating : '=rating'
    },
    templateUrl : "/angular/rating-stars.html"
  };
};

/** Service to retrieve data from loc8r REST API */
var loc8rData = function ($http) {
  return {
    locationByCoords: function (lat, lng) {
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
    }
  };
};

/** Service to retrieve the browser's current location */
var geolocation = function () {
  return {
    getPosition: function (cbSuccess, cbError, cbNoGeo) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
      } else {
        cbNoGeo();
      }
    }
  };
};


angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars)
  .service('loc8rData', loc8rData)
  .service('geolocation', geolocation);