(function () {

angular
  .module('loc8rApp')
  .filter('formatDistance', formatDistance);

/** (Private) Helper function to verify a value is a number */
var _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

/** Filter to reformat distance to convenient, human-readable form. 
 ** NOTE: This is different than the book due to changes in Node to
 ** use a newer geoJSON library (distance in meters instead of rads).
 */
function formatDistance () {
  return function (distance) {
    var numDistance, unit;
    if (distance && _isNumeric(distance)) {
      if (distance >= 1000) {
        // Longer distance, convert to fractional Km (nearest tenth)
        numDistance = parseFloat(distance / 1000).toFixed(1);
        unit = ' km';
      } else {
        // Shorter distance, convert to whole Meters
        numDistance = parseInt(distance, 10);
        unit = ' m';
      }
      return numDistance + unit;
    } else {
      return '?';
    }
  };
};

})();
