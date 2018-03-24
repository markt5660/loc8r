(function () {

angular
  .module('loc8rApp')
  .controller('locationDetailCtrl', locationDetailCtrl);

locationDetailCtrl.$inject = ['$routeParams', '$location', '$uibModal', 'loc8rData', 'authentication'];
function locationDetailCtrl ($routeParams, $location, $uibModal, loc8rData, authentication) {
  var vm = this;

  vm.locationid = $routeParams.locationid;

  vm.isLoggedIn = authentication.isLoggedIn();

  vm.currentPath = $location.path();

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

  // Open a new "review" dialog
  vm.popupReviewForm = function () {
    var modalInstance = $uibModal.open({
      templateUrl: 'reviewModal/reviewModal.view.html',
	  controller: 'reviewModalCtrl',
	  controllerAs: 'vm',
      resolve: {
        locationData: function () {
          return {
            locationid: vm.locationid,
			locationName: vm.data.location.name
		  };
        }
	  }
    });
	// When the review has been successfully added (and the dialog closed),
	// push the new review onto the display list
    modalInstance.result.then(function (data) {
      vm.data.location.reviews.push(data.data);
    });
  };
}

})();