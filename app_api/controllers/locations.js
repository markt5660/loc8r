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
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* PUT */
module.exports.locationsUpdateOne = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};
