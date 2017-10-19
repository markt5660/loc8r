var mongoose = require('mongoose');

// Opening times subdocument schema
var openingTimeSchema = new mongoose.Schema({
  fromDay: {type:String, required:true},
  toDay: {type:String},
  open: {type:String},
  close: {type:String}
});

// Reviews subdocument schema
var reviewSchema = new mongoose.Schema({
  author: {type:String, required:true},
  rating: {type:Number, required:true, min:0, max:5},
  text: {type:String},
  createdOn: {type:Date, "default":Date.now}
});

// General location schema
var locationSchema = new mongoose.Schema({
  name: {type:String, required:true},
  address: {type:String},
  rating: {type:Number, "default":0, min:0, max:5},
  facilities: [{type:String}],
  coordinates: {type:[Number], index:'2dsphere'},
  hours: [{type:openingTimeSchema}],
  reviews: [{type:reviewSchema}]
});

// Create the model
mongoose.model('Location', locationSchema);