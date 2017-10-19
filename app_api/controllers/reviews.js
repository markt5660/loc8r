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
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* PUT */
module.exports.reviewsUpdateOne = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};
