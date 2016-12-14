var lessenlogger = require('./lessenlogger');
var ejs = require('ejs');
var sha256 =  require('crypto-js/sha256');
var mongo = require("./mongo");

//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";

var invalid_login = false;
var invalid_first_name = false;
var invalid_last_name = false;
var invalid_email = false;
var invalid_city = false;
var invalid_state = false;
var invalid_zip = false;
var invalid_phone = false;
var email_already_used = false;

exports.login = function(req, res) {
    console.log("Rendering LOGIN page");
    res.render('login', {
        title : 'Sign in or Register | Lessen',
        invalid_login: invalid_login,
        invalid_first_name: invalid_first_name,
        invalid_last_name: invalid_last_name,
        invalid_email: invalid_email,
        invalid_city:invalid_city,
        invalid_state:invalid_state,
        invalid_zip : invalid_zip,
        invalid_phone : invalid_phone,
        email_already_used : email_already_used
    });
};

exports.validateUser = function(req, res) {

    //lessenlogger.clicklogger.log('info', req.param("username") + ' trying to login');
    lessenlogger.clicklogger.info(req.param("username") + 'is trying to login', {'user':req.param("username"), 'url_clicked':'/validateuser'});

    var username = req.param("username");
    var password = req.param("password");


    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        var coll = mongo.collection('users');

        coll.findOne({user_email: username, user_password:password}, function(err, user){
            if (user) {
                console.log("User found in DB");
                // This way subsequent requests will know the user is logged in.
                req.session.user = user;
                console.log("Setting session", req.session.user);
                //console.log(req.session.user +" is the session");
                //update login time
                console.log(" Before Setting login time for user");
                var time = new Date().toISOString().slice(0, 19).replace('T', ' ');    //update login time
                coll.update({user_email: username}, {$set: {user_loginTime: time}}, function(err, user1) {
                    if (err)
                        throw err;
                    console.log("Setting login time for user");
                    //lessenlogger.clicklogger.info(req.session.user.user_email + 'has logged in', {'user':req.session.user.user_email, 'url_clicked':'/validateuser'});
                    req.session.user = user;
                    //  res.send(json_responses);
                    res.redirect('/homepage');
                });
                console.log(" After Setting login time for user");
                //json_responses = {"statusCode" : 200};
            } else {
                console.log("User entry not found, returned false");
               // json_responses = {"statusCode" : 401};
                //lessenlogger.clicklogger.log('info', req.param("username") + ' failed to login');
                lessenlogger.clicklogger.info(req.session.user.user_email + 'failed to log in', {'user':req.session.user.user_email, 'url_clicked':'/validateuser'});
               // res.send(json_responses);
                res.redirect('/');
            }
        });
    });
};

exports.register = function(req, res){
    var firstname = req.param("firstname");
    var lastname = req.param("lastname");
    var email = req.param("email");
    var password = req.param("password");
    var address = req.param("address");
    var city = req.param("city");
    var state = req.param("state");
    var zip = req.param("zip");
    var phone = req.param("phone");
    var dob = req.param("dob");
    var balance = 1000;
    var handle = email.split("@")[0]; //set handle from email
    console.log("handle is:", handle);
    var sha256_password = sha256(password);
    console.log("SHA 256 password is: ", sha256_password);

    console.log('Registering new user ' + email);
   // lessenlogger.clicklogger.log('info', 'New user ' + email + ' trying to register');
    lessenlogger.clicklogger.info(email + ' is trying to register', {'user':email, 'url_clicked':'/register'});

    //Can do some basic checks for ZIP, PHONE, DOB etc.

    var regZip = new RegExp("^\\d{5}(-\\d{4})?$");
    var regPhone = new RegExp("^\\d{10}");
    var regName = new RegExp("[a-zA-Z]+(?:(?:\. |[' ])[a-zA-Z]+)*");

    if (!regName.test(firstname)) {
        console.log("Invalid Firstname");
        invalid_first_name = true;
    }

    if (!regName.test(lastname)) {
        console.log("Invalid last_name");
        invalid_last_name = true;
    }

    if (!regZip.test(zip)) {
        console.log("Invalid zip");
        invalid_zip = true;
    }

    if (!regPhone.test(phone)) {
        console.log("Invalid Phone");
        invalid_phone = true;
    }

    if (!regName.test(city)) {
        console.log("Invalid city");
        invalid_city = true;
    }

    if (!regName.test(state)) {
        console.log("Invalid state");
        invalid_state = true;
    }

// If any of the input validation fails, stop and redirect to login
    if (invalid_first_name || invalid_last_name || invalid_zip || invalid_email || invalid_phone
        || invalid_city || invalid_state) {
        console.log("invalid registration fields! Redirect!");
       // lessenlogger.clicklogger.log('info', 'New user ' +firstname + ' entered invalid details while registering');
        res.redirect('/login');
    } else {

        var json_responses;

        mongo.connect(mongoURL, function(){
            console.log('Connected to mongo at: ' + mongoURL);
            var coll = mongo.collection('users');

            coll.findOne({user_email: email, user_password:password}, function(err, user){
                if (user) {
                    lessenlogger.clicklogger.log('info', 'Registration failed, user ' +firstname + ' is already registered');
                    console.log("User already registered!");
                    json_responses = {"statusCode" : 401};
                    res.send(json_responses);

                } else {
                    coll.insertOne({
                        user_firstName: firstname,
                        user_lastName: lastname,
                        user_email: email,
                     //   userpassword: sha256_password,
                        user_password: password,
                        user_address: address,
                        user_city: city,
                        user_state: state,
                        user_zip: zip,
                        user_phone: phone,
                        user_dob: dob,
                        user_handle: handle,
                        user_balance: balance,
                        user_loginTime : 0,
                        user_spent: 0,
                        user_earned: 0}, function(err, user) {

                        if (err) {
                            console.log("Error while inserting: ", err);
                           // json_responses = {"statusCode": 401};
                        } else {
                            console.log("New user entry inserted into collection", user);
                           // json_responses = {"statusCode": 200};
                        }
                           // res.send(json_responses);
                        res.redirect('/');
                    });
                }
            });
        });
    }
};
exports.homeWithoutLogin = function(req, res) {

    //SAND_TODO: check session management
/*    if (!req.session.user) {
        console.log("Session is invalid!! Redirect!");
        res.redirect('/');
        return;
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
*/
    console.log("Redirecting to homepage of Guest User");
   // console.log("User is: ", req.session.user);
    lessenlogger.clicklogger.log('info', 'Guest User ' + ' is being redirected to homepage');
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        var categoryColl = mongo.collection('category');
        var productColl = mongo.collection('product');

        categoryColl.find({}).toArray(function(err, categories){
            if (err)
                throw err;
            if (categories) {
                //console.log("Categories loaded: ", categories);
                //Load all products:
                productColl.find({"nameValuePairs.is_admin_approved": true}).toArray(function(err, products) {
                    if (err)
                        throw err;
                    console.log("Rendering Homepage!!!!! ");
                    res.render('HomePageGuest', {
                        title: 'HOMEPAGE',
                        //user: req.session.user,
                        categories: categories,
                        products: products
                    });
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};


exports.redirectToHomepage = function(req, res) {

    //SAND_TODO: check session management
    console.log("After Setting session", req.session.user);
    if (!req.session.user) {
        console.log("Session is invalid!! Redirect!");
        res.redirect('/');
        return;
    }

    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    console.log("Redirecting to homepage");
   // console.log("User is: ", req.session.user);
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is being redirected to homepage');
    lessenlogger.clicklogger.info(req.session.user.user_email + ' is being redirected to homepage', {'user':req.session.user.user_email, 'url_clicked':'/homepage'});
    mongo.connect(mongoURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);

        var categoryColl = mongo.collection('category');
        var productColl = mongo.collection('product');

        categoryColl.find({}).toArray(function(err, categories){
            if (err)
                throw err;
            if (categories) {
                //console.log("Categories loaded: ", categories);
                //Load all products:
                productColl.find({"nameValuePairs.is_admin_approved": true}).toArray(function(err, products) {
                    if (err)
                        throw err;
                    console.log("Rendering Homepage!!!!! ");
                    res.render('homepage', {
                        title: 'HOMEPAGE',
                        user: req.session.user,
                        categories: categories,
                        products: products
                    });
                });
            } else {
                res.redirect('/login');
            }
        });
    });
};

exports.logout = function(req, res){
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is being logged out');
    if (req.session.user) {
        lessenlogger.clicklogger.info(req.session.user.user_email + ' is logging out', {
            'user': req.session.user.user_email,
            'url_clicked': '/logout'
        });
    }
    req.session.user= null;
    req.session.product = null;
    req.session.destroy();
    res.redirect('/');
};
