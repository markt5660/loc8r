/* GET 'home' page */
module.exports.homelist = function (req, res) {
  res.render('locations-list', {
    title: 'Loc8r - Find places to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapLine: 'Find places to work with wifi near you!!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for.",
    locations: [
      {
        name: 'Starcups',
        address: '125 High Street, Reading, RG6 1PS',
        rating: 3,
        facilities: ['Hot drinks', 'Food', 'Premium wifi'],
        distance: '100m'
      },
      {
        name: 'Cafe Hero',
        address: '127 High Street, Reading, RG6 1PS',
        rating: 2,
        facilities: ['Hot drinks', 'Food', 'Average wifi'],
        distance: '200m'
      },
      {
        name: 'The Dive',
        address: '129 High Street, Reading, RG6 1PS',
        rating: 1,
        facilities: ['Hot drinks', 'Poor wifi'],
        distance: '250m'
      }
    ]
  });
};

/* GET 'location info' page */
module.exports.locationInfo = function (req, res) {
  res.render('location-info', {title: 'Location Info'});
};

/* GET 'add review' page */
module.exports.addReview = function (req, res) {
  res.render('location-review-form', {title: 'Add Review'});
};
