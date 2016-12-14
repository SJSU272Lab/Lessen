var lessenlogger = require('./lessenlogger');
var mongo = require("./mongo");
var crypto = require('crypto');
//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var imgStorageLoc = "C:\Users\mitesh\Desktop\272-proj-images";
//var imgStorageLoc = "https://drive.google.com/drive/folders/0B8PtUw3ryOIqWTVZbHN5aUZ2SGc?usp=sharing/";
//var imgStorageLoc = "https://drive.google.com/open?id=0B8PtUw3ryOIqWTVZbHN5aUZ2SGc/";
var cloudinary = require('cloudinary');

exports.listproducts = function (req, res) {

    /*console.log("in list products");
    var cid = req.params.cid;
    lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is listing products in category ' + cid);
    var sqlquery = "select * from product where product_category_id = " + cid;
    console.log("Query is: " + sqlquery);
    mysql.fetchData(function (err, result) {
        if (err) {
            console.log("Query failed:", sqlquery);
            throw err;
        }
        else {
            console.log(result);
            res.send(result);
        }
    }, sqlquery);*/
};

exports.showProduct = function (req, res) {
   //product info should be viewable to Guest users as well
	/*if (!req.session.user) {
        res.redirect('/login');
    }*/
    var product_id = req.params.pid;
    console.log("Show product for product_id= ", product_id);
    //if user is registered, log his details
    if (req.session.user) {
    	lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is viewing product ' + product_id);
    	lessenlogger.clicklogger.info(req.session.user.user_email + ' has clicked on show product URL', {'user':req.session.user.user_email, 'url_clicked':'/showProduct'});
    }
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var productColl = mongo.collection('product');
        var catColl = mongo.collection('category');

        var product_id_object = require('mongodb').ObjectID(product_id);
        productColl.findOne({_id: product_id_object}, function (err, product) {
            if (err) {
                throw err;
            } else {
                catColl.find({}).toArray(function (err, categories) {
                    console.log("Product returned from DB find is: ", product);
                    if (err)
                        throw err;
                    else {
                        req.session.product = product;

                        if (req.session.user && product && product.nameValuePairs && product.nameValuePairs.product_category_name) {
                            lessenlogger.clicklogger.info(req.session.user.user_email + ' is viewing product logged in', {
                                'user': req.session.user.user_email,
                                'product_clicked': product_id,
                                'product_category' : product.nameValuePairs.product_category_name
                            });
                        } else {

                        	if(req.session.user)
                        	{
                        		lessenlogger.clicklogger.info(req.session.user.user_email + ' is viewing product logged in', {
                                'user': req.session.user.user_email,
                                'product_clicked': product_id,
                                'product_category' : 'Other'
                        		});
                        	}
                        }
                        res.render('productInfo1', {
                            title: product.nameValuePairs.product_name,
                            user: req.session.user,
                            product: product,
                            // bresult: bidresult,
                            categories: categories
                        });
                    }
                });
            }
        });
    });
};

function getCategory(callback) {
    var show = "select * from category";
    console.log("Query is: " + show);
    mysql.fetchData(function (err, result) {
        if (err)
            throw err;
        else {
            callback(result);
        }
    }, show);
}

exports.sell = function (req, res) {


	if (!req.session.user) {
        res.redirect('/login');
       res.redirect('/');
   }
    lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to sell a product');

   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to sell a product');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' has clicked on donate URL', {'user':req.session.user.user_email, 'url_clicked':'/sell'});


    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('category');

        coll.find({}).toArray(function (err, categories) {
            if (err) {
                throw err;
            } else {
                res.render('sellProduct', {
                    title: 'Sell Product',
                    show: categories,
                    user: req.session.user
                });
            }
        });
    });
};

exports.directSell = function (req, res) {

    var imageFile;
    var product_image_url;
    var randomNumber = crypto.randomBytes(16).toString('hex');

    if (!req.session.user) {
         res.redirect('/login');
//        res.redirect('/');
    }
    else {

        lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to sell a product directly');
        console.log("DONATE !!!!");

     //   lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to sell a product directly');
        lessenlogger.clicklogger.info(req.session.user.user_email + ' has clicked on donate URL', {'user':req.session.user.user_email, 'url_clicked':'/sell'});
        console.log("DIRECT SELL !!!!");

        var name = req.body.productName;
        var quantity = req.body.productQty;
        var desc = req.body.productDesc;
        var cat_id = req.body.productCategory;
        var condition = req.body.productCondition;
        var type = 1;
        var price = req.body.productPrice;
        var category_name = "";
        var end = new Date();
        var endtime = new Date(end.valueOf() + 4 * 24 * 60 * 60 * 1000); //4 day end for bidding
        var starttime = new Date();
        console.log("bid start time is", starttime);
        var startprice = req.body.productStartPrice;

        //set category name
        if (cat_id == 1) {
            category_name = "Motors";
        } else if (cat_id == 2) {
            category_name = "Fashion";
        } else if (cat_id == 3) {
            category_name = "Electronics";
        } else if (cat_id == 4) {
            category_name = "Collectibles&Arts";
        } else if (cat_id == 5) {
            category_name = "Home&Garden";
        } else if (cat_id == 6) {
            category_name = "SportingGoods";
        } else if (cat_id == 7) {
            category_name = "Toys&Hobbies";
        } else if (cat_id == 8) {
            category_name = "Business&Industrial";
        } else if (cat_id == 9) {
            category_name = "Music";
        } else if (cat_id == 10) {
            category_name = "Other";
        }

        if (!req.files) {
            console.log('No files were uploaded.');
        }

       // console.log('FIRST TEST: ' + JSON.stringify(req.files));
       // console.log('second TEST: ' +req.files.imageFile.path);

        imageFile = req.files.imageFile;

        console.log("Random number is: ", randomNumber);
        product_image_url = imgStorageLoc+randomNumber+req.files.imageFile.name;
        console.log("Product Local image URL is: ", product_image_url);

        imageFile.mv(product_image_url, function(err) {
            if (err) {
                console.log('File movement failed.');
                throw err;
            }
            else {
                console.log('File uploaded successfully!');
            }
        });

        var new_price = price*0.20;

        mongo.connect(mongoURL, function () {
            console.log('Connected to mongo at: ' + mongoURL);
            var productColl = mongo.collection('product');
            //var catColl = mongo.collection('category');

            // catColl.findOne({"category_id": cat_id}, function(err, cat){
            // catColl.find({"category_id": cat_id}).limit(1).next(function(err, cat){
            //find(query).limit(1).next(function(err, doc){

            cloudinary.uploader.upload(product_image_url, function(result) {
                //     console.log(result);
                product_image_url = result.url;
                console.log("Product CLOUDINARY 1 image URL is: ", product_image_url);

                var nameValuePairs = {product_name: name,
                    product_category_id: cat_id,
                    product_category_name: category_name,
                    product_price: new_price,
                    product_condition: condition,
                    product_type: type,
                    // product_seller_id: seller_id,
                    product_seller: req.session.user,
                    product_desc: desc,
                    product_stock: quantity,
                    product_bid_start_price: new_price,
                    product_bid_end_time: endtime,
                    Product_bid_start_time: starttime,
                    product_bid_end: 0,
                    product_max_bid_price: new_price,
                    product_image_url : result.url,
                    is_admin_approved: false,
                    is_pickup_pending : true,
                    is_pickup_completed: false};

                productColl.insertOne({
                    nameValuePairs: nameValuePairs
                }, function (err, result) {

                    if (err) {
                        console.log("Error while inserting: ", err);
                        throw err;
                    } else {
                        console.log("Ad posted succesfully");
                        res.redirect('/homepage');
                    }
                });

           /* productColl.insertOne({
                product_name: name,
                product_category_id: cat_id,
                product_category_name: category_name,
                product_price: new_price,
                product_condition: condition,
                product_type: type,
                // product_seller_id: seller_id,
                product_seller: req.session.user,
                product_desc: desc,
                product_stock: quantity,
                product_bid_start_price: 0,
                product_bid_end_time: 0,
                Product_bid_start_time: 0,
                product_bid_end: 0,
                product_max_bid_price: 0,
                product_image_url : result.url,
                is_admin_approved: false,
                is_pickup_pending : true
            }, function (err, result) {

                if (err) {
                    console.log("Error while inserting: ", err);
                    throw err;
                } else {
                    console.log("Ad posted succesfully");
                    res.redirect('/homepage');
                }
            });*/
            });
        });

    }
};

exports.auctionSell = function (req, res) {
    if (!req.session.user) {
        // res.redirect('/login');
        res.redirect('/');
    }
    else {
        lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to sell a product via auction');
        var name = req.body.productName;
        var quantity = 1;
        var desc = req.body.productDesc;
        var cat_id = req.body.productCategory;
        var condition = req.body.productCondition;
        var type = 1; //Auction sell, type == 0 for Direct sell
        var end = new Date();
        var endtime = new Date(end.valueOf() + 4 * 24 * 60 * 60 * 1000); //4 day end for bidding
        var starttime = new Date();
        console.log("bid start time is", starttime);
        var startprice = req.body.productStartPrice;

        var category_name = "";
        //set category name
        if (cat_id == 1) {
            category_name = "Motors";
        } else if (cat_id == 2) {
            category_name = "Fashion";
        } else if (cat_id == 3) {
            category_name = "Electronics";
        } else if (cat_id == 4) {
            category_name = "Collectibles&Arts";
        } else if (cat_id == 5) {
            category_name = "Home&Garden";
        } else if (cat_id == 6) {
            category_name = "SportingGoods";
        } else if (cat_id == 7) {
            category_name = "Toys&Hobbies";
        } else if (cat_id == 8) {
            category_name = "Business&Industrial";
        } else if (cat_id == 9) {
            category_name = "Music";
        } else if (cat_id == 10) {
            category_name = "Other";
        }

        mongo.connect(mongoURL, function () {
            console.log('Connected to mongo at: ' + mongoURL);
            var productColl = mongo.collection('product');

            productColl.insertOne({
                product_name: name,
                product_category_id: cat_id,
                product_category_name: category_name,
                product_price: startprice,
                product_condition: condition,
                product_type: type,
                // product_seller_id: seller_id,
                product_seller: req.session.user,
                product_desc: desc,
                product_stock: quantity,
                product_bid_start_price: startprice,
                product_bid_end_time: endtime,
                Product_bid_start_time: starttime,
                product_bid_end: 0,
                product_max_bid_price: startprice
            }, function (err, result) {

                if (err) {
                    console.log("Error while inserting: ", err);
                    throw err;
                } else {
                    console.log("Ad posted succesfully");
                    res.redirect('/homepage');
                }
            });

        });
    }
};

//Search Product
exports.search = function (req, res) {
    var text = req.param("productName");
    var cat = req.body.cat;

    console.log("Product being searched for is: ", text);
    console.log("Category of product being searched is: ", cat);

    //  var categoryQuery = "SELECT * FROM category";
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is searching for a product in category' + cat);
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is trying to search for products', {'user':req.session.user.user_email, 'url_clicked':'/search'});

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('category');
        var productColl = mongo.collection('product');

        coll.find({}).toArray(function (err, categories) {
            if (err) {
                throw err;
            } else {
                if (text.length > 0) {
                    productColl.findOne({product_name: text, product_category_id: cat}, function (err, product) {
                        if (err)
                            throw err;
                        if (!product) {
                            res.render('failSearch', {
                                title: 'fail search'
                            });
                        } else {
                            console.log("Product returned from search is: ", product);
                            res.render('homepage', {
                                title: product.product_name,
                                user: req.session.user,
                                categories: categories,
                                products: product
                            });
                        }
                    });
                } else {
                    productColl.find({product_category_id: cat}, function (err, products) {
                        if (err)
                            throw err;
                        if (!products) {
                            res.render('failSearch', {
                                title: 'fail search'
                            });
                        } else {
                            res.render('homepage', {
                                title: products[0].product_category_name,
                                user: req.session.user,
                                categories: categories,
                                products: products
                            });
                        }
                    });
                }
            }
        });
    });

};


exports.bid = function (req, res) {
    if (!req.session.user || !req.session.product) {
        // res.redirect('/login');
        res.redirect('/');
    }
    var time =  new Date().toISOString().slice(0, 19).replace('T', ' ');
  //  lessenlogger.bidlogger.log('info', 'User ' + req.session.user.user_firstName + ' is bidding for product ' + req.session.product.product_id);
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is bidding for a product', {'user':req.session.user.user_email, 'url_clicked':'/showProduct'});
    if (req.body.quantity == 0) {
        res.send('Sold OUT');
    }
    else {
        mongo.connect(mongoURL, function () {
            console.log('Connected to mongo at: ' + mongoURL);

            var productColl = mongo.collection('product');
            var userColl = mongo.collection('users');
            var product_id_object = require('mongodb').ObjectID(req.session.product._id);
            var user_id_object = require('mongodb').ObjectID(req.session.user._id);

            console.log("Bid amount is: ", req.body.myprice);
            var bidplaced = {bid_buyer: req.session.user, bid_price: req.body.myprice, bid_time: time};
            var insertToBidHistory = {bid_product: req.session.product,  bid_price: req.body.myprice, bid_time: time};

            if (req.body.myprice > req.session.product.nameValuePairs.product_max_bid_price) {
                productColl.update({_id: product_id_object}, {$set: {"nameValuePairs.product_max_bid_price": req.body.myprice}}, function (err, product) {
                    if (err)
                        throw err;
                    else {
                        lessenlogger.clicklogger.info(req.session.user.user_email + ' has placed bid for a product',
                            {'user':req.session.user.user_email,
                                'product_bid':req.session.product._id,
                            'bid_price':req.body.myprice});
                    }
                });
            }
//Push bid history in user collection also?
            productColl.update({_id: product_id_object}, {$push: {"nameValuePairs.bids": bidplaced}}, function (err, product) {
                if (err)
                    throw err;
                userColl.update({_id: user_id_object}, {$push: {"nameValuePairs.bidHistory": insertToBidHistory}}, function (err, user) {
                    //Update the product with new bid values.
                    if (err)
                        throw err;
                    res.redirect('/homepage');
                });
            });
        });

    }
};
