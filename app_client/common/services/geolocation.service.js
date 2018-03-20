(function () {

angular
  .module('loc8rApp')
  .service('geolocation', geolocation);

/** Service to retrieve the browser's current location */
function geolocation () {
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

})();
