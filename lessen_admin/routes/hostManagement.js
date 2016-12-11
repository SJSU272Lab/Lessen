var User = require('../model/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var mongo = require("./mongo");

exports.getAllHosts = function (req, res, next) {

    User.find({isHost: true, isApproved: true, isDeleted: false}, function (err, results) {
        if (err) {
            throw err;
        }
        else {
            console.log(results);
            res.send(results);
        }
    });

};


exports.unapprovedHost = function (req, res) {
   /* User.find({isHost: true, isApproved: false, isDeleted: false}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log(results);
            res.send(results);
        }
    })*/

    mongo.connect(mongoURL, function () {
        var pickupColl = mongo.collection('pickup');
        pickupColl.find({
            is_pickup_completed: false
        }).toArray(function (err, products) {
            if (err) {
                throw err;
            }
            console.log("Products are: ", products);
            res.send(products);
        });
    });

};


exports.approveHost = function (req, res) {
   /* var response = {};
    var hostId = req.param("_id");
    var conditions = {_id: new ObjectId(hostId)};
    var update = {
        'isApproved': true
    };
    User.update(conditions, update, function (err, results) {
        if (err) {
            throw err;
        } else {
            response.code = 200;
            response.message = "updated";
            res.render('admin_pendingLogisticsManagement');
        }
    });*/
    var response = {};
    var id = req.param("_id");
    console.log("Getting one pending product: ", id);
    var id_object = require('mongodb').ObjectID(id);

    mongo.connect(mongoURL, function () {
        var pickupColl = mongo.collection('pickup');
        pickupColl.update({_id: id_object}, {
        $set: {
            is_pickup_completed: true,
        }
    }, function (err, seller2) {
        if (err) {
            throw err;
        }
        else {
            response.code = 200;
            response.message = "updated";
            res.render('admin_pendingLogisticsManagement');
        }

    });
    });



};


exports.getHost = function (req, res) {
    var hostId = req.param("_id");
    var conditions = {_id: new ObjectId(hostId)};
    User.find({_id: conditions}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log("here is the host " + results);
            res.send(results);
        }
    })
};


exports.getPendingHost = function (req, res) {

    var id = req.param("_id");
    console.log("Getting one pending product: ", id);
   /* var conditions = {_id: new ObjectId(hostId)};
    User.find({_id: conditions}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log("here is the pending host " + results);
            res.send(results);
        }
    })
    */
    var id_object = require('mongodb').ObjectID(id);

    mongo.connect(mongoURL, function () {
        var pickupColl = mongo.collection('pickup');
        pickupColl.findOne({
            _id: id_object
        } , function (err, product) {
            if (err) {
                throw err;
            }
            console.log("Product is: ", product);
            res.send(product);
        });
    });

};


exports.admin_activeLogisticsManagement = function (req, res) {
    res.render('admin_activeLogisticsManagement');

};


exports.admin_pendingLogisticsManagement = function (req, res) {
    res.render('admin_pendingLogisticsManagement');
};

