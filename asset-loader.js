var url = require('url'),
    request = require('request');

module.exports = function (app) {
  // phantomjs has this weird bug which causes
  // it not to follow 301's when it's loading
  // assets like images, to fix we're rewriting
  // those urls to a local url which serves as
  // a proxy for loading these assets
  app.get('/asset/:url', function (req, res, next) {
    var url = decodeURIComponent(req.params.url);

    request.get(url).pipe(res);
  });

  // method to route urls through proxy
  app.proxify = function (url) {
    return '/asset/' + encodeURIComponent(url);
  };
}
