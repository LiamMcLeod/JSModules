/*
 * REDUNDANT
 */
exports = function (app) {
    if (app.get('env') === 'development') {

        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });

    }
    else {
        // production error handler
        // no stacktraces leaked to user
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });


        function logErrors(err, req, res, next) {
            console.error(err.stack);
            next(err);
        }

        function clientErrorHandler(err, req, res, next) {
            if (req.xhr) {
                res.status(500).send({error: 'Something failed!'});
            } else {
                next(err);
            }
        }

        function localErrorHandler(err, req, res, next) {
            res.status(500);
            res.render('error', {error: err});
        }
    }
};