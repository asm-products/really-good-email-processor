module.exports = function (app) {
    app.get('/output/:id', function (req, res, next) {
        if (app.store[req.params.id]) {
            var output = '<html><head><style>* { margin: 0; padding: 0; } body { background-color: white; }</style></head><body>' + app.store[req.params.id] + '</body></html>';
            
            output = output.replace("\r", '');
            output = output.replace("\n", '');
            output = output.replace('<br><u></u>', '');
            output = output.replace("<br>\r\n</div></body>", '</div></body');

            res.send(output);
        } else res.send(404);
    });
}
