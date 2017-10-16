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
  res.render('location-info', {
    title: 'Location Info for Starcups',
    sidebar: {
      context: " is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help others."
    },
    location: {
      name: 'Starcups',
      address: '125 High Street, Reading, RG6 1PS',
      rating: 3,
      facilities: [
        'Hot drinks', 
        'Food', 
        'Premium wifi'
      ],
      distance: '100m',
      coordinates:
      {
        lat: "51.4388913",
        lon: "-1.0712056"
      },
      hours: [
        {
          fromDay: "Monday",
          toDay: "",
          open: "",
          close: ""
        },
        {
          fromDay: "Tuesday",
          toDay: "Friday",
          open: "7:00am",
          close: "7:00pm"
        },
        {
          fromDay: "Saturday",
          toDay: "",
          open: "8:00am",
          close: "3:00pm"
        },
        {
          fromDay: "Sunday",
          toDay: "",
          open: "",
          close: ""
        }
      ],
      reviews: [
        {
          author: "Simon Holmes",
          rating: 3,
          date: "16 October 2014",
          text: "What a great place. I can't say enough good tings about it."
        },
        {
          author: "Barney Rubble",
          rating: 2,
          date: "15 July 2015",
          text: "It was okay. Coffee was luke warm, but the wifi was fast."
        }
      ]
    }
  });
};

/* GET 'add review' page */
module.exports.addReview = function (req, res) {
  res.render('location-review-form', {
    title: 'Review Starcups on Loc8r',
    location: {
      name: "Starcups"
    }
  });
};
