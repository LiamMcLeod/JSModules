var lib = require('./../modules/lib');
var bcrypt = require('bcrypt-nodejs');
var md5 = require('md5');
var pg = require('pg');

/*
 * Object Constructor
 */
function User() {
    this.UserId = -1;
    this.Title = '';
    this.FirstName = '';
    this.Surname = '';
    this.Address1 = '';
    this.Address2 = '';
    this.Address3 = '';
    this.City = '';
    this.County = '';
    this.Postcode = '';
    this.Username = '';
    this.Password = '';
    this.Email = '';
    this.Contact = '';
    this.DoB = '';
    this.Gender = '';
    this.Academia = '';
    this.Twitter = '';
    this.Website = '';
    this.DateCreated = '';
    this.Permissions = '';
    this.Activated = '';
    this.Banned = '';
    // Additional
    this.Digest = ''; //Digest of Email
    /**
     * Hash password in pass property of object {o}
     * @param o Object
     */
    this.hash = function (o) {
        var salt = bcrypt.genSaltSync(8);
        return bcrypt.hashSync(o.pass, salt)
    };

    /**
     * validate pass property of object {o}
     * against user password property
     * @param o Object
     * @param callback function(err, valid)
     */
    this.validate = function (o, callback) {
        callback(bcrypt.compareSync(o.pass, this.Password));
    };

    /**
     * Find user in database with object from form {object}
     * populate object with user data for later interrogation
     * @param o Object
     * @param callback function(err, user)
     */
    this.findUser = function (o, callback) {
        var error;
        var results = [];
        var query = {};

        if (o.user.contains('.ac.uk') || o.user.contains('.co.uk') || o.user.contains('.com') && o.user.contains('@')) {
            query = {
                text: 'SELECT * from "User" WHERE "EmailAddress"=$1',
                values: [o.user.toLowerCase()]
            }
        } else {
            query = {
                text: 'SELECT * from "User" WHERE LOWER("Username")=LOWER($1) LIMIT 1',
                values: [o.user]
            };
        }
        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            /* if Connection Callback Error */
            if (err) {
                console.log(err);
            }
            /* Client runs query */
            var q = client.query(query, function (err, result) {
                /* Client Q has error */
                if (err) throw err;
                else return result;
            });
            /* Client Q has row */
            q.on('row', function (row, result) {
                results.push(row);
                result.addRow(row);
            });
            /* Client Q has finished */
            q.on('end', function (result) {
                done();
                var found = false;
                if (result.rows[0] != undefined) {
                    var u = new User();
                    u.setResults(result.rows[0]);
                    found = true;
                }
                else found = false;
                callback(error, u, found);
            });
        });
    };
    /**
     * get {user} and populate object with user
     * for rendering of their profile
     * @param o Object
     */
    this.getUser = function (o) {
        var results = [];
        var query = {
            text: 'SELECT * from "User" WHERE LOWER("Username")=LOWER($1) LIMIT 1',
            values: [o.user]
        };

        pg.connect(process.env.DATABASE_URL, function (err, client, done) {
            /* if Connection Callback Error */
            if (err) {
                console.log(err);
            }
            /* Client runs query */
            var q = client.query(query, function (err, result) {
                /* Client Q has error */
                if (err) throw err;
                else return result;
            });
            /* Client Q has row */
            q.on('row', function (row, result) {
                results.push(row);
                result.addRow(row);
            });
            /* Client Q has finished */
            q.on('end', function (result) {
                done();
                var found = false;
                if (lib.isset(result.rows[0])) {
                    var u = new User();
                    u.setResults(result.rows[0]);
                    found = true;
                }
                else found = false;
                callback(error, u, found);
            });
        });
    };

    /**
     * sets {property} of user
     * to {values} provided
     * @param prop String
     * @param val Type
     */
    this.set = function (prop, val) {
        this[prop] = val;
    };

    /**
     * populate User object with query data {results}
     * @param results Object
     */
    this.setResults = function (results) {
        for (var prop in results) {
            this.set(prop, results[prop]);
        }
        this.set("Digest", md5(results[prop]));
    };
}

module.exports = User;


// -- DDL
// CREATE TABLE "User"
// (
//     "UserId" INTEGER PRIMARY KEY NOT NULL,
//     "Title" VARCHAR(35),
//     "FirstName" VARCHAR(35) NOT NULL,
//     "Surname" VARCHAR(35) NOT NULL,
//     "Address1" VARCHAR(35) NOT NULL,
//     "Address2" VARCHAR(35),
//     "Address3" VARCHAR(35),
//     "City" VARCHAR(35) NOT NULL,
//     "County" VARCHAR(35) NOT NULL,
//     "Postcode" VARCHAR(8) NOT NULL,
//     "Username" VARCHAR(35) NOT NULL,
//     "Password" VARCHAR(63) NOT NULL,
//     "Email" VARCHAR(254) NOT NULL,
//     "Contact" CHAR(12),
//     "DoB" DATE NOT NULL,
//     "Gender" VARCHAR(14),
//     "Facebook" VARCHAR(254),
//     "Academia" VARCHAR(254),
//     "Twitter" VARCHAR(254),
//     "Website" VARCHAR(254),
//     "DateCreated" DATE DEFAULT now() NOT NULL,
//     "Permissions" INTEGER DEFAULT 3 NOT NULL,
//     "Activated" BOOLEAN DEFAULT true NOT NULL,
//     "Banned" BOOLEAN DEFAULT false NOT NULL
// );
// CREATE UNIQUE INDEX "U_Username" ON "User" ("Username");
