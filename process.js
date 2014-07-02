module.exports = function (app) {
  app.post('/process', function (req, res, next) {
    
    // create temp id
    var id = Date.now();

    // extra content from email
    var input = req.body['body-html'];

    // strip newlines
    input = input.replace(/\r?\n|\r/g, '');

    // regex for parsing content
    var parse_regex = /<div dir="ltr"><br><br><div class="gmail_quote">(.*)<u><\/u>(.*)<\/div><br><\/div>/g;

    // get matches from input
    var matches = parse_regex.exec(input);

    // result contains
    // [0] -> entire mail
    // [1] -> forwarded message info
    // [2] -> forwarded mail

    // save html to store
    app.store[id] = matches[2].trim();

    // get additional data from email
    var parse_data_regex = /From: <b class="gmail_sendername">(.*)<\/b>.*?<a href="mailto:(.*?)@(.*?)".*Subject: (.*?)<br>/;

    // run regex on message info part
    var message_data = parse_data_regex.exec(matches[1]);

    // result contains
    // [0] whole thing
    // [1] sender name
    // [2] sender email before @
    // [3] sender email after @
    // [4] subject

    // create object to return as json
    var data = {
      subject: message_data[4].trim(),
      sender: {
        name: message_data[1].trim(),
        email: message_data[2] + '@' + message_data[3],
        domain: message_data[3]
      }
    };

    // render using phantom
    app.phantom.run(function (ph) {
      ph.createPage(function (page) {
        page.open('http://localhost:' + app.get('port') + '/output/' + id, function (status) {
          // get rendered image as base64
          page.renderBase64('PNG', function (base64) {
            // add base64 to data
            data.image = base64;
  
            // TODO: send as JSON to configured url
            console.log(data);
  
            // debug
            page.render('test.png', function () {});
  
            res.send(200);
          });
        });
      });
    });
  });
}
