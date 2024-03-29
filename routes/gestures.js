var conn = require('../lib/db-connection');
var model = require('../lib/db-model');

var StrokeSequence = model.StrokeSequence;

exports.allDatabaseIdentifiers = function(req, res) {
	StrokeSequence.allDatabaseIdentifiers(function(err, identifiers) {
		if (err)
			return res.send(400, err);

		return res.send(200, identifiers);
	});
}

exports.allStrokeSequenceNames = function(req, res) {
	StrokeSequence.allStrokeSequenceNames(req.params.db, function(err, seqNames) {
		if (err)
			return res.send(400, err);

		return res.send(200, seqNames);
	});
}

function strokeSequenceMap(seqs) {
	var seqMap = {};

	seqs.forEach(function(seq) {
		if (!seqMap[seq.name])
			seqMap[seq.name] = [];

		seqMap[seq.name].push(seq);
	});

	return seqMap;
}

exports.allGesturesInDatabase = function(req, res) {
	StrokeSequence.find({}, function(err, seqs) {
		if (err)
			return res.send(400, err);


		return res.send(200, {identifier:req.params.db, strokeSequenceMap:strokeSequenceMap(seqs)});
	});
}

exports.gesturesWithName = function(req, res) {
	StrokeSequence.findByName(req.params.gestureName, function(err, seqs) {
		if (err)
			return res.send(400, err);

		return res.send(200, seqs);
	});
}

exports.addGesture = function(req, res) {

	req.body.database = req.params.db;

	// FIXME: check req.params.gestureName against req.body.name

	StrokeSequence.findBySignature(req.params.db, req.body.signature, function(err, foundItems) {

		if (err) {
			return res.send(400, err);
		}

		if (foundItems.length > 0) {
			return res.send(200,
				{
					status:"matching-object-found",
					signature:req.body.signature,
					description:"Object with matching signature already found. Will not add a new one."
				});
		}

		var seq = new StrokeSequence(req.body);
	    var e = null;

	    seq.save(function(err) {
	        if (!err) {
	        	return res.send(200, seq);
	        }
	        else {
	    		return res.send(400, err);
	        }
	    });
	});
}

exports.gesturesWithSignature = function(req, res) {
	StrokeSequence.findBySignature(req.params.db, req.params.signature, function(err, foundItems) {
		if (err)
			return res.send(400, err);

		return res.send(foundItems);
	});
}

exports.removeGestureWithSignature = function(req, res) {
	StrokeSequence.remove({"$and":[{database:req.params.db}, {signature:req.body.signature}]},
		function(err, count) {
		if (err) {
			return res.send(400, err);
		}

		return res.send(200, {status:"ok",signature:req.body.signature,count:count});
	});
}

exports.allGestures = function(req, res) {
	StrokeSequence.find({}, function(err, seqs) {
		if (err)
			return res.send(400, err);

		return res.send(200, {"identifier":"<union>", "strokeSequenceMap":strokeSequenceMap(seqs)});
	});
}