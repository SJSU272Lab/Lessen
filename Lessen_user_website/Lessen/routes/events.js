/*var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var lessenlogger = require('./lessenlogger');

exports.events = function(req, res) {
	console.log("in events!");

  if (req.session.user.user_id == req.params.id) {
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his account') ;
    lessenlogger.clicklogger.info(req.session.user.user_email + ' has requested for account check', {'user':req.session.user.user_email, 'url_clicked':'/homepage'});
    res.redirect('/events');
  } else {
	  
    res.redirect('/login');
  }

};*/
var lessenlogger = require('./lessenlogger');
var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";

/*{
    "_id" : ObjectId("584f00841963847579054bed"),
    "eventName" : "First Event",
    "eventMsg" : "Donation drive for home goods",
    "eventDate" : "2016-12-31",
    "location" : "Downtown SJSU"
}
*/
//Get Event details
exports.events = function (req, res) {
	/*if (!req.session.user) {
        res.redirect('/login');
       res.redirect('/');
   }
   */

	if (req.session.user) {
        var user_id = req.session.user.user_id;
        var user = req.session.user;
        // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking the items in his cart');
        lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking the events', {
            'user': req.session.user.user_email,
            'url_clicked': '/events'
        });
    }

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var eventColl = mongo.collection('events');
        var event_id_object = require('mongodb').ObjectId("584f00841963847579054bed");
        eventColl.find({}).toArray(function(err, events) {
            if (err)
                throw err;
            console.log("Rendering Events!!!!! ");
            res.render('events', {
                title: 'Donation Events',
                events: events,
                user:req.session.user
            });
        });

    });

};