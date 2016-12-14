var mongo = require("./mongo");
//var mongoURL = "mongodb://localhost:27017/lessen";
var mongoURL = "mongodb://admin:admin@ds119768.mlab.com:19768/lessen";
var lessenlogger = require('./lessenlogger');

exports.show = function(req, res) {

  if (req.session.user.user_id == req.params.id) {
   // lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his account') ;
    lessenlogger.clicklogger.info(req.session.user.user_email + ' has requested for account check', {'user':req.session.user.user_email, 'url_clicked':'/homepage'});
    res.redirect('/myAccount');
  } else {
    res.redirect('/login');
  }

};

exports.account = function(req, res){
  if (!req.session.user) {
    res.redirect('/login');
  }
  //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his account') ;
  lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking his account', {'user':req.session.user.user_email, 'url_clicked':'/myAccount'});
  mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);

    var coll = mongo.collection('users');
    var user_id_object = require('mongodb').ObjectID(req.session.user._id);

    coll.findOne({_id: user_id_object}, function(err, user){
      console.log('Query Ran, user on the way or not? !!');
      if (err)
        throw err;
      else {
        console.log('User found, render mY Account Page !!');
        res.render('myAccount', {
          title: 'My Account',
          user: user,
          userinfo: user,
          soldinfo: user.sellHistory,
          purchaseinfo: user.purchaseHistory
        });
      }
    });
  });

};

exports.purchaseHistory = function(req, res){
  if (!req.session.user) {
    res.redirect('/login');
  }
  //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his purchase history') ;
  lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking his purchase history', {'user':req.session.user.user_email, 'url_clicked':'/purchaseHistory'});

  mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);
    var user_id_object = require('mongodb').ObjectID(req.session.user._id);
    var coll = mongo.collection('users');

    coll.findOne({_id: user_id_object}, function(err, user){
      if (err)
        throw err;
      if (user) {
        res.render('purchaseHistory', {
          title: 'Purchase History',
          user: user,
          userinfo: user,
          purchaseinfo: user.purchaseHistory
        });
      }
    });
  });
};

exports.sellHistory = function(req, res){
  if (!req.session.user) {
    res.redirect('/login');
  }
  //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his sell history') ;
  lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking his sell history', {'user':req.session.user.user_email, 'url_clicked':'/sellHistory'});

  mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);
    var user_id_object = require('mongodb').ObjectID(req.session.user._id);

    var coll = mongo.collection('users');

    coll.findOne({_id: user_id_object}, function(err, user){
      if (err)
        throw err;
      if (user) {
        res.render('sellHistory', {
          title: 'Sell History',
          user: user,
          userInfo: user,
          soldInfo: user.sellHistory
        });
      }
    });
  });
};


exports.bidHistory = function(req, res) {
  if (!req.session.user) {
    res.redirect('/login');
  }
  //lessenlogger.clicklogger.log('info', 'User ' + req.session.user.user_firstName + ' is checking his bid history') ;
  lessenlogger.clicklogger.info(req.session.user.user_email + ' is checking his bid history', {'user':req.session.user.user_email, 'url_clicked':'/bidHistory'});

  mongo.connect(mongoURL, function(){
    console.log('Connected to mongo at: ' + mongoURL);
    var user_id_object = require('mongodb').ObjectID(req.session.user._id);
    var coll = mongo.collection('users');

    coll.findOne({_id: user_id_object}, function(err, user){
      if (err)
        throw err;
      if (user) {
        res.render('bidHistory', {
          title: 'Bid History',
          user: user,
          result: user.bidHistory
        });
      }
    });
  });

};