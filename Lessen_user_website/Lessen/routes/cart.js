var lessenlogger = require('./lessenlogger');
var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";

//Get CART details
exports.cart = function (req, res) {
	if (!req.session.user) {
        res.redirect('/login');
       res.redirect('/');
   }

    var user_id = req.session.user.user_id;
    var user = req.session.user;
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking the items in his cart');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking the items in his cart', {'user':req.session.user.user_email, 'url_clicked':'/cart'});

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(req.session.user._id);

        userColl.findOne({_id: user_id_object}, function (err, user) {
            if (err) {
                throw err;
            } else {
                var cart_total = 0;
                if (user.cart) {
                    for (var i = 0; i < user.cart.length; i++) {
                        cart_total += parseInt(user.cart[i].nameValuePairs.product_price);
                    }
                }
                console.log("Cart total after calculation is: ", cart_total);
                res.render('cart', {
                    title: 'Shopping Cart',
                    items: user.cart,
                    total: user.cart_total,
                    total: cart_total,
                    user: req.session.user
                    //seller: req.session.seller
                });
            }
        });
    });

};

exports.addToCart = function (req, res) {
    //var user_id = req.session.user.user_id;
	if (!req.session.user) {
    res.redirect('/login');
	}
	var user = req.session.user;

    var product_id = req.body.product_id;
    var seller_id = req.body.seller_id;
  //  lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is adding product' + product_id + 'to his cart');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is adding items to his cart', {'user':req.session.user.user_email, 'url_clicked':'/addToCart'});

    var seller_name = "GOD";
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var productColl = mongo.collection('product');
        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(req.session.user._id);
         //var user_id_object = (req.session.user);

        var product_id_object = require('mongodb').ObjectID(product_id);

        productColl.findOne({_id: product_id_object}, function (err, product) {
            if (err) {
                throw err;
            }
            if (product) {
                console.log("Product found in DB");
                console.log("Product is :", product);

                userColl.update({_id: user_id_object}, {$push: {cart: product}}, function (err, user) {
                    if (err) {
                        throw err;
                    } else {
                        //all is well, item added to cart
                        console.log("Item added to cart");
                        res.redirect('/cart');
                    }
                });
            }
        });

    });

};

exports.payment = function (req, res) {
    //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is ready to make a payment');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is making a payment', {'user':req.session.user.user_email, 'url_clicked':'/payment'});
    res.render("payment", {
        title: "Pay",
        user: req.session.user
    });
};

function removeUserFromCart(user_id, callback) {

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(user_id);

        userColl.update({_id: user_id_object}, {$set : {cart : []}}, function (err, user) {
            if (err) {
                throw err;
            }
               callback(user);
            });

    });

}

function decrementProductQuantity(user_id, callback) {
    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var productColl = mongo.collection('product');
        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(user_id);

        userColl.findOne({_id: user_id_object}, function (err, user) {
            if (err) {
                throw err;
            }
            if (user) {
                //Decrement product stock
                for (var i = 0; i < user.cart.length; i++) {
                    var product_id_object = require('mongodb').ObjectID(user.cart[i]._id);
                    productColl.findOne({_id: product_id_object}, function (err, product) {
                        if (err) {
                            throw err;
                        } else {
                            var product_stock = parseInt(product.nameValuePairs.product_stock) - 1;
                            productColl.update({_id: product_id_object}, {$set: {"nameValuePairs.product_stock": product_stock}}, function (err, product1) {
                                if (err) {
                                    throw err;
                                }
                            });
                        }
                    });

                }
              callback(user);
            }
        });

    });

}

exports.checkout = function (req, res) {
  //  lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is trying to do a cart checkout');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is trying to do a cart checkout', {'user':req.session.user.user_email, 'url_clicked':'/checkout'});

    var cardnumber, expirydate, cvv;
    var isCardValid = false;
    cardnumber = req.param("cardnumber");
    expirydate = req.param("expirydate");
    cvv = req.param("cvv");

    var json_responses;

    //Do credit card validation //set isCardValid:

    var regCardNumber = new RegExp("^\\d{16}$");
    var regExpiry = new RegExp("^\\d{4}$");
    var regCvv = new RegExp("^\\d{3}$");

    if (regCardNumber.test(cardnumber) && regExpiry.test(expirydate) && regCvv.test(cvv)) {
        isCardValid = true;
    }

    console.log("card details:", cardnumber, expirydate, cvv);
    console.log("Card is valid? : ", isCardValid);


    if (isCardValid) {
        console.log("Valid card");
        var user_id = req.session.user._id;

        addTransaction(user_id, function (result) {
            decrementProductQuantity(user_id, function (result) {
                removeUserFromCart(user_id, function (result) {
                    json_responses = {"statusCode": 200};
                    res.send(json_responses);
                });
            });
        });


    }  else {
        console.log("Here J !!!");
        json_responses = {"statusCode": 401};
        res.send(json_responses);
    }

};

exports.thankyou = function (req, res) {
    res.render('thankYou', {
        title: 'ThankYou',
        user: req.session.user
    });
};

//Remove item from cart
exports.remove = function (req, res) {

    var product_id = req.params.pid;

    var user_id = req.session.user._id;
    lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is removing product ' + product_id + ' from his cart');
    //var user_id = req.session.user._id;
    //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is removing product ' + product_id + ' from his cart');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is removing items from his cart', {'user':req.session.user.user_email, 'url_clicked':'/removeFromCart'});


    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(req.session.user._id);
        var product_id_object = require('mongodb').ObjectID(product_id);

        userColl.update({_id: user_id_object}, {$pull: {cart: {_id: product_id_object}}}, function (err, user) {
            if (err) {
                throw err;
            } else {
                //all is well, item removed from cart
                console.log("Item removed from cart");
            }
        });

    });


    res.redirect('/cart');
};

function addTransaction(user_id, callback) {

    console.log("Adding Transaction to History !!!");
    //var user = req.session.user;

    mongo.connect(mongoURL, function () {
        console.log("Here 1 !!!");

        console.log('Connected to mongo at: ' + mongoURL);

        var userColl = mongo.collection('users');
        var user_id_object = require('mongodb').ObjectID(user_id);


            console.log("Here 2 !!!");
            userColl.findOne({_id: user_id_object}, function (err, user) {
                //Add products to buyers purchase history
                for (var i = 0; i < user.cart.length; i++) {
                    user.cart[i].transactionTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    userColl.update({_id: user_id_object}, {$push: {purchaseHistory: user.cart[i]}}, function (err, userupdate) {
                            if (err) {
                                throw err;
                            } else {
                                console.log("Products added to Purchase-history");
                            }
                        });
                }
                //Decrement balance from purchaser
                var cart_total = 0;
                for (var k = 0; k < user.cart.length; k++) {
                    cart_total += parseInt(user.cart[k].nameValuePairs.product_price);
                }
                var user_spent = 0;
                console.log("User Spent amount till now: ", parseInt(user.user_spent));
                user_spent = parseInt(user.user_spent) + cart_total;
                console.log("User Spent amount: ", user_spent);
                var user_balance = 0;
                console.log("User Balance amount before deducting: ", parseInt(user.user_balance));
                user_balance = parseInt(user.user_balance) - user_spent;
                console.log("User Balance amount after spending: ", user_balance);
                userColl.update({_id: user_id_object}, {$set: {user_spent: user_spent, user_balance: user_balance}}, function (err, userupdate1) {
                    if (err) {
                        throw err;
                    } /*else {
                        userColl.update({_id: user_id_object}, {$set: {user_balance: user_balance}}, function (err, userupdate2) {
                            if (err)
                                throw err;
                        });
                    }*/
                });

                //Add to sellers selling history! , increment balance
                for (var j = 0; j < user.cart.length; j++) {
                    console.log("User cart length here 1 is :" , user.cart.length);
                    var seller_id_object = require('mongodb').ObjectID(user.cart[j].nameValuePairs.product_seller._id);
                    user.cart[j].transactionTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
                    var product = user.cart[j];
                    userColl.update({_id: seller_id_object}, {$push: {sellHistory: product}}, function (err, seller1) {
                        if (err)
                            throw err;
                        else {
                            //Update earned, balance
                            userColl.findOne({_id: seller_id_object}, function (err, seller2) {
                                console.log("Product price is :", product.nameValuePairs.product_price);
                                console.log("Seller  earned amount till now: ", parseInt(seller2.user_earned));
                                var earned = parseInt(seller2.user_earned) + parseInt(product.nameValuePairs.product_price);
                            //    var earned = (seller2.user_earned) + (product.nameValuePairs.product_price);
                                console.log("Seller  earned amount after selling: ", earned);

                                console.log("Seller  balance amount before selling: ", parseInt(seller2.user_balance));
                                var balance = parseInt(seller2.user_balance) + parseInt(earned);
                                //var balance = (seller2.user_balance) + earned;
                                console.log("Seller  balance amount after selling: ", balance);

                                userColl.update({_id: seller_id_object}, {
                                    $set: {
                                        user_earned: earned,
                                        user_balance: balance
                                    }
                                }, function (err, seller2) {
                                    if (err)
                                        throw err;
                                    /*else {
                                     userColl.update({_id: seller_id_object}, {$set: {user_balance: balance}}, function (err, seller3) {
                                     if (err)
                                     throw err;
                                     });
                                     }
                                     */
                                });
                            });
                        }
                    });
                }

            });

        callback();
    });
}
