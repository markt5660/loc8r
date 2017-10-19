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
module.exports.locationsCreate = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* GET list */
module.exports.locationsListByDistance = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* DELETE */
module.exports.locationsDeleteOne = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* GET */
module.exports.locationsReadOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "No locationid in request"});
    return;
  }
  // Execute query and return query results
  Loc.findById(req.params.locationid).exec(function (error, location) {
    if (!location) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    }
    if (error) {
      sendJsonResponse(res, 404, error);
      return;
    }
    sendJsonResponse(res, 200, location);
  });  
};

/* PUT */
module.exports.locationsUpdateOne = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};
