
var request = require('request');
// Set default URL base for API requests
var apiOptions = {
  server: "http://localhost:3000"
};
// Reset URL base for production environment
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
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


/** Helper method for rendering the homepage */
/*
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
*/
var renderHomepage = function (req, res) {
  res.render('locations-list', {
    title: 'Loc8r - Find places to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapLine: 'Find places to work with wifi near you!!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for."
  });
};

/* GET 'home' page */
/*
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
*/
module.exports.homelist = function (req, res) {
	renderHomepage(req, res);
};

/** Helper method for retrieving location info */
var getLocationInfo = function (req, res, callback) {
  var path = "/api/locations/" + req.params.locationid;
  var requestOptions = {
    url : apiOptions.server + path,
    method : "GET",
    json : {}
  };
  request(requestOptions, function (err, response, body) {
    var data = body;
	if (response.statusCode === 200) {
      data.coordinates = {
        lng : body.coords[0],
        lat : body.coords[1]
      };
      callback(req, res, data);
	} else {
	  _showError(req, res, response.statusCode);
	}
  });
};

/** Helper method for rendering the details page */
var renderDetails = function (req, res, locDetail) {
  console.log("Detail LAT:", locDetail.coordinates.lat);
  console.log("Detail LON:", locDetail.coordinates.lng);
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

/* GET 'location info' page */
module.exports.locationInfo = function (req, res) {
  getLocationInfo(req, res, function(req, res, responseData) {
	  renderDetails(req, res, responseData);
  });
};

/** Helper method for rendering the review form */
var renderReviewForm = function (req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name + ' on Loc8r',
    pageHeader: { title: 'Review ' + locDetail.name },
    location: locDetail,
	error: req.query.err,
	url: req.originalUrl
  });
};

/* GET 'add review' page */
module.exports.addReview = function (req, res) {
  getLocationInfo(req, res, function (req, res, responseData) {
    renderReviewForm(req, res, responseData);
  });
};

/* POST 'add review' page */
module.exports.doAddReview = function (req, res) {
  var locationid = req.params.locationid;
  var path = '/api/locations/' + locationid + '/reviews';
  var postdata = {
    author: req.body.name,
	rating: parseInt(req.body.rating, 10),
	reviewText: req.body.review
  };
  var requestOptions = {
    url: apiOptions.server + path,
	method: "POST",
	json: postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect('/location/' + locationid + '/review/new?err=val');
  } else {
    request(requestOptions, function (err, response, body) {
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationid);
      } else if (response.statusCode === 400 
             && body.name 
             && body.name === "ValidationError") {
        res.redirect('/location/' + locationid + '/review/new?err=val');
      } else {
        _showError(req, res, response.statusCode);
      }
    });
  }
};