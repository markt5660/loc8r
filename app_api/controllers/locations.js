var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

/**
* Helper function for sending simple response
*/
var sendJsonResponse = function (res, status, content) {
  res.status(status);
  res.json(content);
};

/**
* Helper function for "Earth" geographic calculations
*/
var theEarth = (function () {
  var earthRadiusKm = 6371; // kilometers, miles is 3959
  
  var getDistanceFromRads = function (rads) {
    return parseFloat(rads * earthRadiusKm);
  };
  
  var getRadsFromDistance = function (distanceKm) {
    return parseFloat(distanceKm / earthRadiusKm);
  };
  
  return {
    getDistanceFromRads : getDistanceFromRads,
    getRadsFromDistance : getRadsFromDistance
  };
})();


/* POST */
module.exports.locationsCreate = function (req, res) {
  // placeholder
  sendJsonResponse(res, 200, {"status": "success"});
};

/* GET list */
module.exports.locationsListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxKm = (req.query.maxKm) ? parseFloat(req.query.maxKm) : 20.0;

   if (!lng || !lat) {
    sendJsonResponse(res, 404, {"message": "Either Lat or Lng missing from query"});
    return;
  }

  /* geoJSON solution. Coordinate of near point is geoJSON, distances in meters */
  var geoOptions = {
    spherical: true,
    maxDistance: maxKm * 1000, // km * m/km
    num: 10
  };
  var point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  Loc.geoNear(point, geoOptions, function (error, results, stats) {
    var locations = [];
    console.log("locationsListByDistance: stats: ", stats);
    if (error) {
      sendJsonResponse(res, 404, error);
      return;
    }
    if (!results) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    }
    results.forEach(function (result) {
      locations.push({
        distance: result.dis,
        name: result.obj.name,
        address: result.obj.address,
        rating: result.obj.rating,
        facilities: result.obj.facilities,
        _id: result.obj._id
      });
    });
    sendJsonResponse(res, 200, locations);
  });

  /* Legacy solution. Coordinate of near point is Legacy [lng, lat], distances in rads */
  /*
  var geoOptions = {
    spherical: true,
    maxDistance: theEarth.getRadsFromDistance(maxKm),
    num: 10
  };
  Loc.geoNear([lng, lat], geoOptions, function (error, results, stats) {
    var locations = [];
    console.log("locationsListByDistance: stats: ", stats);
    if (error) {
      sendJsonResponse(res, 404, error);
      return;
    }
    if (!results) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    }
    results.forEach(function (result) {
      locations.push({
        distance: theEarth.getDistanceFromRads(result.dis),
        name: result.obj.name,
        address: result.obj.address,
        rating: result.obj.rating,
        facilities: result.obj.facilities,
        _id: result.obj._id
      });
    });
    sendJsonResponse(res, 200, locations);
  });
  */
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
