(function () {

angular
  .module('loc8rApp')
  .service('loc8rData', loc8rData)

/** Service to retrieve data from loc8r REST API */
loc8rData.$inject = ['$http'];
function loc8rData ($http) {
  return {
    // Retrieve locations by latitude, longitude, and radius
    locationByCoords: function (lat, lng) {
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
    },
    // Retrieve location by unique ID
    locationById: function (locationid) {
      return $http.get('/api/locations/' + locationid);
    },
    // Add a review to a location
    addReviewById: function (locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data);
    }
  };
};

})();
