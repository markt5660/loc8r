(function () {

angular
  .module('loc8rApp')
  .controller('locationDetailCtrl', locationDetailCtrl);

locationDetailCtrl.$inject = ['$routeParams', 'loc8rData'];
function locationDetailCtrl ($routeParams, loc8rData) {
  var vm = this;

  vm.locationid = $routeParams.locationid;
  
  // Retrieve the location details by ID using the data API
  loc8rData.locationById(vm.locationid).then(
    function (data) {
      // success
      vm.data = { location: data.data };
      vm.pageHeader = { title: vm.data.location.name };
    },
    function (e) {
      // error
      console.log(e);
    }
  );
}

})();