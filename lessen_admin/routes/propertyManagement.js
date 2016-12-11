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
                productColl.find({is_admin_approved: false}).toArray(function(err, products) {
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

        /*categoryColl.find({}).toArray(function(err, categories){
            if (err)
                throw err;
            if (categories) {*/
                //console.log("Categories loaded: ", categories);
                //Load all products:
                //productColl.find({_id: propertyId, is_admin_approved: true}).toArray(function(err, products) {
        console.log("Updating property");
        productColl.update({_id: product_id_object}, {$set: {is_admin_approved: true}}, function(err, product) {
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

        productColl.update({_id: product_id_object}, {$set: {product_price: productPrice, product_type: saleType} }, function(err, product) {
            //if (err)
            if (err)
                throw err;
            console.log("Update successful!!!!! ");
            res.send(true);

        });

    });

};