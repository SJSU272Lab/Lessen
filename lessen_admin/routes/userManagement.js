var User = require('../model/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var mongo = require("./mongo");

exports.getAllUsers = function (req, res, next) {
    /* User.find({isHost: false, isActivated: true}, function (err, results) {
     if (err) {
     throw err;
     }
     else {
     console.log(results);
     res.send(results);
     }
     });*/
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');

        userColl.find({}).toArray(function (err, users) {
            if (err)
                throw err;
            console.log(users);
            res.send(users);
        });
    });

};


exports.getUser = function (req, res) {
    var userId = req.param("_id");
    /*var conditions = {_id: new ObjectId(userId)};
    console.log("Here " + conditions._id);
    User.find({_id: conditions}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log("The results are :" + results);
            res.send(results);
        }
    })*/

    var userid_object = require('mongodb').ObjectID(userId);

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');

        userColl.findOne({_id: userid_object }, function (err, user) {
            if (err)
                throw err;
            console.log(user);
            res.send(user);
        });
    });
};


exports.admin_activeUserManagement = function (req, res) {
    res.render('admin_activeUserManagement');
};