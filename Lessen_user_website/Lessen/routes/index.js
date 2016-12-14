/* GET home page. */
exports.index = function(req, res){
  res.render('login', {
    title: 'Ebay',
    login_error : null
  });
};
