var lib = require('./lib');

/**
 * Return for query {query} results {results} as {res} JSON (REST)
 * @param query PG.CLIENT
 * @param results Object
 * @param res Express Response Object
 */
function getResults(res, query, param) {
    var results = [];
    query.on('row', function (row, result) {
        result.addRow(row);
        results.push(row);
    });
    query.on('end', function (result) {
        returnJSON(res, results, param);
    });
}

/**
 * Error function for generating error page
 * using {err}
 * @param req Express Request Object
 * @param res Express Response Object
 * @param err Error Callback
 */
function error(req, res, err) {
    // res.status(err.status || 500);
    if (err) {
        var ret = {
            statusCode: 0,
            message: '',
            subtext: ''
        };
        if (err.message.contains('Failed to lookup view')) {
            ret.statusCode = 404
        }
        if (ret.statusCode === 404) {
            ret.message = "Page Not Found!";
            ret.subtext = "Sorry, but the page you were trying to view does not exist."
        }
        res.render('error', {
            statusCode: ret.statusCode,
            message: ret.message,
            status: "Error: " + ret.statusCode,
            subtext: ret.subtext,
            error: err,
            bg: lib.rnd()
        });
    }
    else {
        res.render('error', {
            statusCode: 418,
            message: "Problem with request.",
            status: "Error: 418",
            subtext: "We're sorry, but there was a problem with your request.",
            bg: lib.rnd()
        });
    }

}

/**
 * Check if query parameter has been provided
 * @param req Express Request Object
 * @param res Express Response Object
 */
function checkPretty(req, res, param) {
    if (req.query['pretty'] != undefined) {
        param.pretty = req.query['pretty'];
    }
}

function checkParams(req, res) {
    var param = {};
    if (lib.isset(req.query)) {
        param = req.query;
    }
    return param;
}

/**
 * Return {res} JSON Variant for when a
 * query parameter {param} has been provided
 * @param res Express Response Object
 * @param results Object
 * @param param Object
 */
function returnJSON(res, results, param) {
    if (!lib.isset(results)) {
        return res.status(404).json({message: "Error: Not Found."});
    }
    if (lib.isset(param)) {
        if (lib.isset(param.pretty)) {
            if (param.pretty) return res.send("<pre>" + JSON.stringify(results, null, 2) + "</pre>");
        }
        else return res.json(results);
    }
    else return res.json(results);
}


/**
 * {res} Render {file} providing session
 * and user data in {req}
 * @param req Express Request Object
 * @param res Express Response Object
 * @param file String
 */
function renderLoggedIn(req, res, file) {
    var $ = req.session;
    var getReq;
    var idReq;
    var userReq;

    if (file === "home" || file === "Home" || file == "index" || file === "index") {
        file = "index";
        if (!lib.isset(req.query)) {
            getReq = req.query['q'];
        }
        console.log(getReq);
        res.render(file, {
            getReq: getReq,
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn,
            userId: $.user.UserId,
            username: $.user.Username,
            title: $.user.Title,
            firstName: $.user.FirstName,
            lastName: $.user.LastName,
            emailAddress: $.user.EmailAddress,
            doB: $.user.DateOfBirth,
            created: $.user.Created,
            role: $.user.Role
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result); // send rendered HTML back to client
        });
    }
    else if (file === "result") {
        idReq = req.query['id'];
        res.render(file, {
            idReq: idReq,
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn,
            userId: $.user.UserId,
            username: $.user.Username,
            title: $.user.Title,
            firstName: $.user.FirstName,
            lastName: $.user.LastName,
            emailAddress: $.user.EmailAddress,
            doB: $.user.DateOfBirth,
            created: $.user.Created,
            role: $.user.Role
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result); // send rendered HTML back to client
        });
    }
    else if (file === "profile") {
        userReq = req.params.user;
        res.render(file, {
            userReq: userReq,
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn,
            userId: $.user.UserId,
            username: $.user.Username,
            title: $.user.Title,
            firstName: $.user.FirstName,
            lastName: $.user.LastName,
            emailAddress: $.user.EmailAddress,
            doB: $.user.DateOfBirth,
            created: $.user.Created,
            role: $.user.Role
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result); // send rendered HTML back to client
        });
    }
    else {
        res.render(file, {
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn,
            userId: $.user.UserId,
            username: $.user.Username,
            title: $.user.Title,
            firstName: $.user.FirstName,
            lastName: $.user.LastName,
            emailAddress: $.user.EmailAddress,
            doB: $.user.DateOfBirth,
            created: $.user.Created,
            role: $.user.Role
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result)
        });
    }
}

/**
 * {res} Render {file} no user data available
 * @param req Express Request Object
 * @param res Express Response Object
 * @param file String
 */
function renderLoggedOut(req, res, file) {
    var $ = req.session;
    var getReq;
    var idReq;
    file = file.toLowerCase();
    if (file === "home" || file === "index") {
        file = "index";
        if (lib.isset(req.query)) {
            getReq = req.query['q'];
        }
        res.render(file, {
            getReq: getReq,
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result); // send rendered HTML back to client
        });
    }
    else if (file === "result") {
        if (lib.isset(req.query)) {
            idReq = req.query['id'];
        }
        res.render(file, {
            idReq: idReq,
            session: $,
            status: req.flash('status'),
            loggedIn: $.loggedIn
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result); // send rendered HTML back to client
        });
    }
    else {
        res.render(file, {
            status: req.flash('status'),
            loggedIn: $.loggedIn
        }, function (err, result) {
            if (err) error(req, res, err);
            else res.send(result)
        });
    }
}

/**
 * {res} Render user profile page
 * and user data in {req}
 * @param req Express Request Object
 * @param res Express Response Object
 */
function renderFile(req, res, file) {
    res.render(file, {
        bg: lib.rnd(),
    }, function (err, result) {
        if (err) error(req, res, err);
        else res.send(result)
    });
}

exports.getResults = getResults;
exports.checkParams = checkParams;
exports.checkPretty = checkPretty;
exports.returnJSON = returnJSON;
exports.error = error;
exports.renderLoggedOut = renderLoggedOut;
exports.renderLoggedIn = renderLoggedIn;
exports.renderFile = renderFile;
// exports.renderProfile = renderProfile;


/**
 * {res} Render user profile page
 * and user data in {req}
 * @param req Express Request Object
 * @param res Express Response Object
 */
// function renderProfile(req, res) {
//     //TODO FIX No Vars rendering
//     var $ = req.session;
//     res.render('profile', {
//         bg: lib.rnd(),
//         session: $,
//         status: req.flash('status'),
//         loggedIn: $.loggedIn,
//         userId: $.user.UserId,
//         username: $.user.Username,
//         title: $.user.Title,
//         firstName: $.user.FirstName,
//         lastName: $.user.LastName,
//         emailAddress: $.user.EmailAddress,
//         doB: $.user.DateOfBirth,
//         created: $.user.Created,
//         role: $.user.Role,
//         pUsername: $.profile.User,
//         pTitle: $.profile.Title,
//         pFirstName: $.profile.FirstName,
//         pLastName: $.profile.LastName,
//         pEmailAddress: $.profile.EmailAddress,
//         pDoB: $.profile.DateOfBirth,
//         pCreated: $.profile.Created,
//         pRole: $.profile.Role
//     }, function (err, result) {
//         if (err) error(req, res, err);
//         else res.send(result)
//     });
// }