var request = require('request');
// Set default URL base for API requests
var apiOptions = {
  server: "http://localhost:3000"
};
// Reset URL base for production environment
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
};

/** Helper method for rendering the homepage */
var renderHomepage = function (req, res, responseBody) {
  var message;
  if (!(responseBody instanceof Array)) {
    console.log(responseBody);
    message = "API lookup error";
    responseBody = [];
  } else if (responseBody.length <= 0) {
    message = "No places found nearby";
  }
  res.render('locations-list', {
    title: 'Loc8r - Find places to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapLine: 'Find places to work with wifi near you!!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for.",
    locations: responseBody,
    message: message
  });
};

/** (Private) Helper function to reformat distance to whole meters */
var _formatDistance = function (distance) {
  var numDistance, unit;
  if (distance >= 1000) {
    // Longer distance, convert to fractional Km (nearest tenth)
    numDistance = parseFloat(distance / 1000).toFixed(1);
    unit = " km";
  } else {
    // Shorter distance, convert to whole Meters
    numDistance = parseInt(distance, 10);
    unit = " m";
  }
  return numDistance + unit;
};

/* GET 'home' page */
module.exports.homelist = function (req, res) {
  var path = '/api/locations';
  var requestOptions = {
    url : apiOptions.server + path,
    method: "GET",
    json: {},
    qs: {
      lng: -121.2856105,
      lat: 38.7499155,
      // lng: 0,
      // lat: 0,
      maxDistance: 20
    }
  };
  request(requestOptions, function (err, response, body) {
    if (err) {
      console.log(err);
      return;
    } 
    var data = body;
    if (response.statusCode === 200 && data.length > 0) {
      // Clean up distances before rendering
      for (var i = 0; i < data.length; i++) {
        data[i].distance = _formatDistance(data[i].distance);
      }
    } else {
      console.log(response.statusCode);
    }
    renderHomepage(req, res, data);
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
