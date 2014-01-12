var mongoose = require('mongoose');
var sets = require('simplesets');

//Schemas
var strokeSequenceSchema
	= new mongoose.Schema(
	{
	    name: String,
	    database: String,
	    signature: String,
	    strokes: [
	    			{
	    				"points":
		    				[
		    					{
		    						x:Number,
		    					 	y:Number,
		    					 	id:Number
		    					}
		    				]
	    			}
	    		]
	});

strokeSequenceSchema.statics.findByName = function(db, name, cb) {
  this.find({'$and':[{database:db}, {name: new RegExp(name, 'i') }]}, cb);
}

strokeSequenceSchema.statics.findBySignature = function(db, sign, cb) {
  this.find({'$and':[{database:db}, {signature:sign}]}, cb);
}

strokeSequenceSchema.statics.allDatabaseIdentifiers = function (cb) {
	this.find({}, {database:true}, function(err, identifiers) {
  	if (err)
  		return cb(err, null);

		var distinctDBs = (new sets.Set(identifiers.map(function (o) {return o.database; }))).array();
  		return cb(err, distinctDBs);
  });
}

strokeSequenceSchema.statics.allStrokeSequenceNames = function (db, cb) {
  this.find({database:db}, {name:true}, cb);
}

//Models
var strokeSequenceModel = mongoose.model( 'StrokeSequence', strokeSequenceSchema );

module.exports = {};
module.exports.StrokeSequence = strokeSequenceModel;