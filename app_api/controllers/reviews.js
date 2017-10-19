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
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* DELETE */
module.exports.reviewsDeleteOne = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
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
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};
