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

/** Helper method for rendering the details page */
var renderDetails = function (req, res, locDetail) {
  console.log("Detail LAT:", locDetail.coordinates.lat);
  console.log("Detail LON:", locDetail.coordinates.lon);
  res.render('location-info', {
    title: locDetail.name,
    pageHeader: {title: locDetail.name},
    sidebar: {
      context: " is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.",
      callToAction: "If you've been and you like it - or if you don't - please leave a review to help others."
    },
    location: locDetail
  });
};

/** (Private) helper function to display an error */
var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear, it looks like we can't find this page. Sorry.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere has gone a bit wrong. Sorry.";
  }
  res.status(status);
  res.render('generic-text', {
    title: title,
    content: content
  });
};

/* GET 'location info' page */
module.exports.locationInfo = function (req, res) {
  var path = "/api/locations/" + req.params.locationid;
  var requestOptions = {
    url: apiOptions.server + path,
    method: "GET",
    json: {}
  };
  console.log("Details request:", requestOptions);
  request(requestOptions, function (err, response, body) {
    if (err) {
      console.log("Detail error:", err);
      return;
    } 
    if (response.statusCode !== 200) {
      //console.log("Detail status code:", response.statusCode);
      //return;
      _showError(req, res, response.statusCode);
    }
    // remap coordinates from array of numbers to {lng,lat}
    var data = body;
    data.coordinates = {
      lon: body.coords[0],
      lat: body.coords[1]
    };
    console.log("Detail data:",data);
    renderDetails(req, res, data);
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
