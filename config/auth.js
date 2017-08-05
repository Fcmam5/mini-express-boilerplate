var url = require('url');

module.exports = {
    'facebookAuth' : {
        'clientID'      : process.env.FB_CID, // your App ID
        'clientSecret'  : process.env.FB_CSECRET, // your App Secret
        'callbackURL'   : url.resolve(process.env.APP_URL,'/auth/facebook/callback')
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TWT_CK,
        'consumerSecret'    : process.env.TWT_SECRET,
        'callbackURL'       : url.resolve(process.env.APP_URL,'/auth/twitter/callback')
    },

};
