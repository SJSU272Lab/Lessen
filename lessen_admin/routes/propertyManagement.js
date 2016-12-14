var Property = require('../model/property');
var User = require('../model/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var mongo = require("./mongo");

exports.getAllProperties = function (req, res, next) {
    /*"use strict";
    var response = [];
    Property
        .find({isApproved: true, isAvailable: true})
        .populate('hostId')
        .exec(function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                for (var i = 0; i < results.length; i++) {
                    if (results[i].hostId.isApproved) {
                        response.push(results[i]);
                    }
                }
            }
            res.send(response);

        });
*/
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var prodColl = mongo.collection('product');

        prodColl.find({}).toArray(function (err, products) {
            if (err)
                throw err;
            //console.log(products);
            res.send(products);
        });
    });
};


exports.getProperty = function (req, res) {
    //var propertyId = req.param("_id");
   /* var conditions = {_id: new ObjectId(propertyId)};
    Property.find({_id: conditions}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log("here is the property " + results);
            res.send(results);
        }
    })*/

    var product_id = req.param("_id");
    var product_id_object = require('mongodb').ObjectID(product_id);

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        var productColl = mongo.collection('product');

        productColl.findOne({_id: product_id_object}, function(err, product) {
            if (err) {
                throw err;
            }
            console.log("Sending product info: ", product);
            res.send(product);
        });
    });
};


exports.getPendingProperty = function (req, res) {
    /*var propertyId = req.param("_id");
    var conditions = {_id: new ObjectId(propertyId)};
    Property.find({_id: conditions}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log("here is the propegetPendingPropertyrty " + results);
            res.send(results);
        }
    })*/

    var product_id = req.param("_id");
    var product_id_object = require('mongodb').ObjectID(product_id);

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);


        var productColl = mongo.collection('product');

        productColl.findOne({_id: product_id_object}, function(err, product) {
            if (err) {
                throw err;
            }

            console.log("Updating product info- came from mobile app: ", product);
            if (product && !product.nameValuePairs.product_seller) {
                var product_seller = {
                    "_id": "584e1fddcb34c5635f91464f",
                    "user_firstName": "Sandeep Kumar",
                    "user_lastName": "Chawan",
                    "user_email": "sand@sand.sand",
                    "user_password": "sand",
                    "user_address": "65 Rio Robles East, Apt 2402",
                    "user_city": "San Jose",
                    "user_state": "CA",
                    "user_zip": "95134",
                    "user_phone": "6692655217",
                    "user_dob": "2016-12-31",
                    "user_handle": "sand",
                    "user_balance": 1000,
                    "user_loginTime": "2016-12-12 04:02:19",
                    "user_spent": 0,
                    "user_earned": 0
                };
                var end = new Date();
                var endtime = new Date(end.valueOf() + 4 * 24 * 60 * 60 * 1000); //4 day end for bidding
                var starttime = new Date();
                var product_price = product.nameValuePairs.product_price * 0.2;
                console.log("Product price resetting: ", product_price);

                productColl.update({_id: product_id_object}, {
                        $set: {
                            "nameValuePairs.product_seller": product_seller, "nameValuePairs.product_bid_end_time": endtime,
                            "nameValuePairs.Product_bid_start_time": starttime, "nameValuePairs.product_category_name": "Electronics",
                            "nameValuePairs.product_category_id": 3
                        }
                    },
                    function (err, product) {
                        if (err) {
                            console.log("Product seller could not be updated");
                            throw err;
                        }
                        console.log("Product seller updated");
                    });
            }
        });
        //Load all products:
        productColl.findOne({_id: product_id_object}, function(err, product) {
            if (err) {
                throw err;
            }
            console.log("Sending product info: ", product);
            res.send(product);
            return;
        });
    });

 //   res.send(false);

};

exports.unapprovedProperty = function (req, res) {
    /*console.log("Call came here in unapprovedProperty");
    Property.find({isApproved: false, isAvailable: true}, function (err, results) {
        if (err) {
            throw err;
        } else {
            console.log(results);
            res.send(results);
        }
    })*/
    console.log("inside pending products");
    var result = false;

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);


        var productColl = mongo.collection('product');

                //Load all products:
                productColl.find({"nameValuePairs.is_admin_approved": false}).toArray(function(err, products) {
                    if (err) {
                        throw err;
                    }
                    console.log("Sending pending products: ", products);
                    res.send(products);
                    return;
                });
    });
  //  res.send(result);
    console.log("Ffailed sending pending products");
};


exports.approveProperty = function (req, res, next) {
    var response = {};
    var product_id = req.param("_id");
    var product_id_object = require('mongodb').ObjectID(product_id);
    //var conditions = {_id: new ObjectId(propertyId)};
    /*var update = {
        'isApproved': true
    };
    *//*Property.update(conditions, update, function (err, results) {

        if (err) {
            throw err;
        } else {
            response.code = 200;
            response.message = "updated";
            res.render('admin_pendingProduct');
        }
    });*/

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        //var categoryColl = mongo.collection('category');
        var productColl = mongo.collection('product');

        productColl.findOne({_id: product_id_object}, function(err, product) {
            if (err) {
                throw err;
            }

            console.log("Updating product info- came from mobile app: ", product);
            if (product && !product.nameValuePairs.product_seller) {
                var product_seller = {
                    "_id": "584e1fddcb34c5635f91464f",
                    "user_firstName": "Sandeep Kumar",
                    "user_lastName": "Chawan",
                    "user_email": "sand@sand.sand",
                    "user_password": "sand",
                    "user_address": "65 Rio Robles East, Apt 2402",
                    "user_city": "San Jose",
                    "user_state": "CA",
                    "user_zip": "95134",
                    "user_phone": "6692655217",
                    "user_dob": "2016-12-31",
                    "user_handle": "sand",
                    "user_balance": 1000,
                    "user_loginTime": "2016-12-12 04:02:19",
                    "user_spent": 0,
                    "user_earned": 0
                };
                var end = new Date();
                var endtime = new Date(end.valueOf() + 4 * 24 * 60 * 60 * 1000); //4 day end for bidding
                var starttime = new Date();
                var product_price = product.nameValuePairs.product_price * 0.2;
                console.log("Product price resetting: ", product_price);

                productColl.update({_id: product_id_object}, {$set: {"nameValuePairs.product_seller": product_seller, "nameValuePairs.product_bid_end_time": endtime,
                "nameValuePairs.Product_bid_start_time": starttime, "nameValuePairs.product_category_name": "Electronics","nameValuePairs.product_price": product_price,
                        "nameValuePairs.product_category_id": 3}},
                function (err, product) {
                        if (err) {
                            console.log("Product seller could not be updated");
                            throw err;
                        }
                        console.log("Product seller updated");
                });
            }

        });

        /*categoryColl.find({}).toArray(function(err, categories){
            if (err)
                throw err;
            if (categories) {*/
                //console.log("Categories loaded: ", categories);
                //Load all products:
                //productColl.find({_id: propertyId, is_admin_approved: true}).toArray(function(err, products) {
        console.log("Updating property");
        productColl.update({_id: product_id_object}, {$set: {"nameValuePairs.is_admin_approved": true}}, function(err, product) {
            //if (err)
                    if (err)
                        throw err;
                    console.log("Update successful!!!!! ");
            response.code = 200;
            response.message = "updated";
            res.render('admin_pendingProduct');
                    /*res.render('homepage', {
                        title: 'HOMEPAGE',
                        user: req.session.user,
                        categories: categories,
                        products: products
                    });*/
                });
            /*} else {
                res.redirect('/login');
            }*/
        //});
    });
};


exports.admin_pendingProduct = function (req, res) {
    res.render('admin_pendingProduct');
};

exports.admin_activeProductManagement = function (req, res) {
    res.render('admin_activeProductManagement');
};

//update product
exports.updateProperty = function (req, res) {

    var product_id = req.param("_id");
    var productPrice = req.param("productPrice");
    var saleType = req.param("saleType");
    var product_id_object = require('mongodb').ObjectID(product_id);

    console.log("Product id: ", product_id);
    console.log("Product price: ", productPrice);
    console.log("Product saletype: ", saleType);

    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        var productColl = mongo.collection('product');

        productColl.update({_id: product_id_object}, {$set: {"nameValuePairs.product_price": productPrice, "nameValuePairs.product_type": saleType} }, function(err, product) {
            //if (err)
            if (err)
                throw err;
            console.log("Update successful!!!!! ");
            res.send(true);

        });

    });

};