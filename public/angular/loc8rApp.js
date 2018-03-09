angular.module('loc8rApp', []);

var locationListCtrl = function ($scope) {
  $scope.data = {
    locations: [{
      name: 'Burger Queen',
      address: '125 High Street, Reading, RG6 IPS',
      rating: 4,
      facilities: ['Hot drinks', 'Food', 'Premium wifi'],
      distance: '0.296456',
      _id: '12354'
    },{
      name: 'Costy',
      address: '130 High Street, Reading, RG6 IPS',
      rating: 3,
      facilities: ['Cold drinks', 'Food', 'wifi'],
      distance: '0.7865456',
      _id: '12355'
    }]
  };
};

/** (Private) Helper function to verify a value is a number */
var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/** Filter to reformat distance to convenient, human-readable form */
var formatDistance = function () {
  return function (distance) {
	console.log("formatDistance " + distance);
    var numDistance, unit;
	if (distance && _isNumeric(distance)) {
      if (distance > 1) {
        // Longer distance, convert to fractional Km (nearest tenth)
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
      } else {
        // Shorter distance, convert to whole Meters
        numDistance = parseInt(distance * 1000, 10);
        unit = 'm';
      }
      return numDistance + unit;
	} else {
	  return "?";
	}
  };
};

var ratingStars = function () {
  return {
    scope : {
		thisRating : '=rating'
	},
    templateUrl : "/angular/rating-stars.html"
  };
};


angular
  .module('loc8rApp')
  .controller('locationListCtrl', locationListCtrl)
  .filter('formatDistance', formatDistance)
  .directive('ratingStars', ratingStars);