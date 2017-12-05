import mongoose from './config/mongoose';
import express from './config/express';
import passport from './config/passport';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3001;

var db = mongoose();
var app = express();
var psp = passport();


app.get('/getDatabase', function (req, res) {
	db.Department.find(function(err, docs) {
		res.json(docs);
	});
});

app.listen(process.env.PORT, () => {
     console.log('Starting node.js on port ' + process.env.PORT);
});

module.exports = app;