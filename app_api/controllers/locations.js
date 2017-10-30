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
  Loc.create({
    name: req.body.name,
    address: req.body.address,
    facilities: req.body.facilities.split(","),
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
    hours: [{
      fromDay: req.body.fromDay1,
      toDay: req.body.toDay1,
      open: req.body.open1,
      close: req.body.close1
    }, {
      fromDay: req.body.fromDay2,
      toDay: req.body.toDay2,
      open: req.body.open2,
      close: req.body.close2
    }],
  }, function (err, location) {
    if (err) {
      sendJsonResponse(res, 400, err);
    } else {
      sendJsonResponse(res, 201, location);
    }
  });
};

/* GET list */
module.exports.locationsListByDistance = function (req, res) {
  var lng = parseFloat(req.query.lng);
  var lat = parseFloat(req.query.lat);
  var maxKm = (req.query.maxKm) ? parseFloat(req.query.maxKm) : 20.0;

   if ((!lng && lng !== 0) || (!lat && lat !== 0)) {
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
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "Not found, locationid is required"});
    return;
  }
  // Execute query and delete the result
  Loc
  .findById(req.params.locationid)
  .exec(function (err, location) {
    if (!location) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    console.log("Deleting", location._id);    
    location.remove(function (err, location) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 200, location);
      }
    });
  });
};

/* GET */
module.exports.locationsReadOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "Not found, locationid is required"});
    return;
  }
  // Execute query and return query results
  Loc.findById(req.params.locationid)
  .exec(function (err, location) {
    if (!location) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    sendJsonResponse(res, 200, location);
  });  
};

/* PUT */
module.exports.locationsUpdateOne = function (req, res) {
  // Validate inputs
  if (!req.params || !req.params.locationid) {
    sendJsonResponse(res, 404, {"message": "Not found, locationid is required"});
    return;
  }
  // Execute the query, apply the changes to the result and save
  Loc
  .findById(req.params.locationid)
  .select('-reviews -rating')
  .exec(function (err, location) {
    if (!location) {
      sendJsonResponse(res, 404, {"message": "location not found"});
      return;
    } else if (err) {
      sendJsonResponse(res, 400, err);
      return;
    }
    location.name = req.body.name;
    location.address = req.body.address;
    location.facilities = req.body.facilities.split(",");
    location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
    location.hours = [{
      fromDay: req.body.fromDay1,
      toDay: req.body.toDay1,
      open: req.body.open1,
      close: req.body.close1
    }, {
      fromDay: req.body.fromDay2,
      toDay: req.body.toDay2,
      open: req.body.open2,
      close: req.body.close2
    }];
    location.save(function (err, location) {
      if (err) {
        sendJsonResponse(res, 404, err);
      } else {
        sendJsonResponse(res, 200, location);
      }
    });
  });
};
