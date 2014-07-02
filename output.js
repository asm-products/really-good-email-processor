module.exports = function (app) {
    app.get('/output/:id', function (req, res, next) {
        if (app.store[req.params.id]) {
            // get html from email and wrap in basic html page
            var output = '<html><head><style>* { margin: 0; padding: 0; } body { background-color: white; }</style></head><body>' + app.store[req.params.id] + '</body></html>';

            res.send(output);
        } else res.send(404);
    });
}
