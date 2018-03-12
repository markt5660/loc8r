angular
  .module('loc8rApp')
  .controller('homeCtrl', homeCtrl);

function homeCtrl ($scope, loc8rData, geolocation) {
  var vm = this;
  
  // Static data

  vm.pageHeader = {
    title: 'Loc8r',
    strapline: 'Find places to work with wifi near you!!'
  };
  vm.sidebar = {
    content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for."
  };
  vm.message = "Checking your location";

  // Callback functions for the geolocation service

  vm.getData = function (position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    vm.message = "Searching for nearby places";
    loc8rData.locationByCoords(lat, lng).then(
      function (data) {
        // success
        vm.message = data.data.length > 0 ? "" : "No locations found";
        vm.data = { locations: data.data };
      },
      function (e) {
        // error
        vm.message = "Sorry, something's gone wrong";
        console.log(e);
      }
    );
  };

  vm.showError = function (error) {
    $scope.$apply(function () {
      vm.message = error.message;
    });
  };

  vm.noGeo = function () {
    $scope.$apply(function () {
      vm.message = "Geolocation not supported by this browser";
    });
  };

  // Retrieve the browser's geolocation
  geolocation.getPosition(vm.getData, vm.error, vm.noGeo);
}
