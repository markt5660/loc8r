var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/**
* Helper function for sending simple response
*/
var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

/* POST */
module.exports.reviewsCreate = function (req, res) {
  getAuthor(req, res, function (req, res, username) {
    if (req.params.locationid) {
      Loc
        .findById(req.params.locationid)
        .select('reviews')
        .exec(function (err, location) {
          if (err) {
            sendJsonResponse(res, 400, err);
          } else {
            doAddReview(req, res, location, username);
          }
        });
    } else {
      sendJsonResponse(res, 404, {"message": "Not found, locationId required"});
    }
  });
};

/** Helper function to retrieve the name of the authenticated user */
var User = mongoose.model('User');
var getAuthor = function (req, res, callback) {
  if (!req.payload || !req.payload.email) {
    sendJsonResponse(res, 404, {"message": "User not found"});
	return;
  }

  User
    .findOne({ email : req.payload.email })
    .exec(function (err, user){
      if (!user) {
        sendJsonResponse(res, 404, {"message": "User not found"});
		return;
      }
      if (err) {
        console.log(err);
        sendJsonResponse(res, 404, err);
		return;
	  }
	  callback(req, res, user.name);
	});
};

/** Helper function for adding a review */
var doAddReview = function (req, res, location, author) {
  if (!location) {
    sendJsonResponse(res, 404, {"message": "locationId not found"});
  } else {
    location.reviews.push({
      author: author,
      rating: req.body.rating,
      text: req.body.reviewText
    });
    location.save(function (err, location) {
      var thisReview;
      if (err) {
        console.log(err);
        sendJsonResponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];
        sendJsonResponse(res, 201, thisReview);
      }
    });
  }
};

/** Helper function to update the average rating for the location with the given ID */
var updateAverageRating = function (locationId) {
  Loc
  .findById(locationId)
  .select('rating reviews')
  .exec(function (err, location) {
    if (!err) {
      doSetAverageRating(location);
    }
  });
};

/** Helper function to update the average rating for the given location */
var doSetAverageRating = function (location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};

/* DELETE */
module.exports.reviewsDeleteOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "No locationid in request"});
    return;
  }
  if (!req.params || !req.params.reviewid) {
    sendJsonResponse(res, 404, {"message": "No reviewid in request"});
    return;
  }
  // Execute location query and process query results to delete review
  Loc
  .findById(req.params.locationid)
  .select('reviews')
  .exec(function (err, location) {
    var thisReview;
    if (!location) {
      sendJsonResponse(res, 404, {"message": "locationid not found"});
      return;
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    if (location.reviews && location.reviews.length > 0) {
      // Locate review by ID and remove it from the location document
      thisReview = location.reviews.id(req.params.reviewid);
      if (!thisReview) {
        sendJsonResponse(res, 404, {"message": "reviewid not found"});
      } else {
        thisReview.remove();
        location.save(function (err) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            updateAverageRating(location._id);
            sendJsonResponse(res, 200, null);
          }
        });
      }
    } else {
      sendJsonResponse(res, 404, {"message": "No review to update"});
    }
  });
};

/* GET */
module.exports.reviewsReadOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "No locationid in request"});
    return;
  }
  if (!req.params || !req.params.reviewid) {
    sendJsonResponse(res, 404, {"message": "No reviewid in request"});
    return;
  }
  // Execute location query and process query results
  Loc
  .findById(req.params.locationid)
  .select('name reviews')
  .exec(function (error, location) {
    if (!location) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    }
    if (!location.reviews || location.reviews.length <= 0) {
      sendJsonResponse(res, 404, {"message": "no reviews found for location"});
      return;
    }
    if (error) {
      sendJsonResponse(res, 404, error);
      return;
    }
    // Query for matching review sub-document and return results
    var review = location.reviews.id(req.params.reviewid);
    if (!review) {
      sendJsonResponse(res, 404, {"message": "review not found for " + req.params.reviewid});
      return;
    }
    sendJsonResponse(res, 200, {
      location: {
        name: location.name,
        id: req.params.locationid
      },
      review: review
    });
  });  
};

/* PUT */
module.exports.reviewsUpdateOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "No locationid in request"});
    return;
  }
  if (!req.params || !req.params.reviewid) {
    sendJsonResponse(res, 404, {"message": "No reviewid in request"});
    return;
  }
  // Execute location query and extract review document
  Loc
  .findById(req.params.locationid)
  .select('reviews')
  .exec(function (err, location) {
    var thisReview;
    if (!location) {
      sendJsonResponse(res, 404, {"message": "locationid not found"});
      return;
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    if (location.reviews && location.reviews.length > 0) {
      // find subdocument by review id
      thisReview = location.reviews.id(req.params.reviewid);
      if (!thisReview) {
        sendJsonResponse(res, 404, {"message": "reviewid not found"});
      } else {
        thisReview.author = req.body.author;
        thisReview.rating = req.body.rating;
        thisReview.text = req.body.reviewText;
        location.save(function (err, location) {
          if (err) {
            sendJsonResponse(res, 404, err);
          } else {
            updateAverageRating(location._id);
            sendJsonResponse(res, 200, thisReview);
          }
        });
      }
    } else {
      sendJsonResponse(res, 404, {"message": "No review to update"});
    }
  });
};
