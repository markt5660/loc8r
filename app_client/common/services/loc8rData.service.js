(function () {

angular
  .module('loc8rApp')
  .service('loc8rData', loc8rData)

/** Service to retrieve data from loc8r REST API */
loc8rData.$inject = ['$http'];
function loc8rData ($http) {
  return {
    locationByCoords: function (lat, lng) {
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20');
    }
  };
};

})();
