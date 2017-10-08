module.exports = {
  /*
  * Midleware for checking if the user is authenticated
  * */
  isLoggedIn: function(req, res, next) {
     if (req.isAuthenticated()){
       res.locals.user = req.user;
       return next();
     }
     req.flash('loginMessage', "You must login to see this page")
     return res.redirect('/login');
 },

};
