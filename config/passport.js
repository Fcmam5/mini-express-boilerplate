var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/UserModel');
var configAuth = require('./auth');
var crypto = require('crypto');

module.exports = function(passport) {
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
       // by default, local strategy uses username and password, we will override with email
       usernameField : 'email',
       passwordField : 'password',
       passReqToCallback : true // allows us to pass back the entire request to the callback
   },
   function(req, email, password, done) {
       process.nextTick(function() {
       User.findOne({ 'local.email' :  email }, function(err, user) {
           if (err)
               return done(err);
           if (user) {
               return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
           } else {
               var newUser            = new User();
               newUser.local.email    = email;
               newUser.profile.name   = req.body.name;
               newUser.local.password = newUser.generateHash(password);
               newUser.profile.pictureUrl = getGAvatar(email);


               newUser.save(function(err) {
                   if (err)
                       throw err;
                   return done(null, newUser);
               });
           }

       });

       });

   }));

   passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });

    }));

    /*
    * Facebook authentication
    * Make sure that you have a Facebook application code, from
    */
    passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'displayName', 'picture', 'email', 'name'],
        passReqToCallback : true,
    },
    function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
          if (!req.user) {
            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
                // if there is an error, stop everything and return that
                if (err)
                    return done(err);

                if (user) {
                  if (!user.facebook.token) {
                    user.facebook.token = token;
                    user.facebook.email = profile.emails[0].value;
                    user.profile.pictureUrl = user.profile.pictureUrl || profile.picture;
                    user.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, user);
                    });
                  }
                  return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();
                    newUser.facebook.id    = profile.id;
                    newUser.facebook.token = token;
                    newUser.facebook.email = profile.emails[0].value;
                    // Create a profile
                    newUser.profile.name = profile.displayName;
                    newUser.profile.pictureUrl = profile.picture;

                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }

            });
          } else {
            var user = req.user;
            user.facebook.id    = profile.id;
            user.facebook.token = token;
            user.facebook.email = profile.emails[0].value;
            user.profile.pictureUrl = user.profile.pictureUrl || profile.picture;

            // Update the profile
            user.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
            });
          }
        });
      }));

    /*
    * Twitter authentication
    * Make sure that you have a Twitter application code, from
    */
    passport.use(new TwitterStrategy({
      consumerKey     : configAuth.twitterAuth.consumerKey,
      consumerSecret  : configAuth.twitterAuth.consumerSecret,
      callbackURL     : configAuth.twitterAuth.callbackURL,
      passReqToCallback : true,
  },
  function(req, token, tokenSecret, profile, done) {
      process.nextTick(function() {
        if (!req.user) {
          User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
              if (err)
                  return done(err);

              if (user) {
                if (!user.twitter.token) {
                  user.twitter.token = token;
                  user.twitter.username = profile.username;
                  user.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, user);
                  });
              }
              return done(null, user);
              } else {
                  var newUser                 = new User();
                  newUser.twitter.id          = profile.id;
                  newUser.twitter.token       = token;
                  newUser.twitter.username    = profile.username;
                  newUser.profile.name        = profile.displayName;
                  newUser.profile.pictureUrl  = profile.photos[0].value;

                  // save our user into the database
                  newUser.save(function(err) {
                      if (err)
                          throw err;
                      return done(null, newUser);
                  });
              }
          });
        } else {
          var user = req.user;
          user.twitter.id          = profile.id;
          user.twitter.token       = token;
          user.twitter.username    = profile.username;

          user.save(function(err) {
              if (err)
                  throw err;
              return done(null, user);
          });
        }
      });
  }));
};


function getGAvatar(emailAdr) {
   var mailToHash= crypto.createHash('md5').update(emailAdr).digest("hex");
   return "https://www.gravatar.com/avatar/" + mailToHash + "?s=400";
}
