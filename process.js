module.exports = function (app) {
  app.post('/process', function (req, res, next) {
    console.log(req.body);
    // create temp id
    var id = Date.now();
    console.log(id);

    // save html to store
    app.store[id] = req.body['body-html'];

    // render using phantom
    app.phantom.run(function (ph) {
      ph.createPage(function (page) {
        page.open('http://localhost:' + app.get('port') + '/output/' + id, function (status) {
          page.render('test.png', function () {
            // render done
            res.send(200);
          });
        });
      });
    });
  });
}
