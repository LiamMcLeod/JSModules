var LEX = require('letsencrypt-express');

var lex = LEX.create({
    configDir: require('os').homedir() + '/letsencrypt/etc'
    , approveRegistration: function (hostname, cb) { // leave `null` to disable automatic registration
        // Note: this is the place to check your database to get the user associated with this domain
        cb(null, {
            domains: [hostname]
            , email: 'CHANGE_ME' // user@example.com
            , agreeTos: true
        });
    }
});
module.exports = lex;

/*
Move these into server when needed
var lex = require ('./app/letsEnc');
lex.onRequest = app;
    lex.listen([80], [443, 5001], function () {
        var protocol = ('requestCert' in this) ? 'https' : 'http';
        console.log("Listening at " + protocol + '://localhost:' + this.address().port);
    });
 */