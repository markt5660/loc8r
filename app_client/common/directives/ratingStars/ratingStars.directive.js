(function () {

angular
  .module('loc8rApp')
  .directive('ratingStars', ratingStars);

/** Directive to generate "star rating" iconography from a numeric value */
function ratingStars () {
  return {
    restrict: 'EA',
    scope : {
      thisRating : '=rating'
    },
    templateUrl : "/common/directives/ratingStars/ratingStars.template.html"
  };
};

})();
