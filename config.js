module.exports = function (app) {
    // url
    app.set('url', process.env.URL || 'http://localhost');

    // port
    app.set('port', process.env.PORT || 3000);

    // destination api url
    app.set('destination_url', process.env.DESTINATION_URL || 'http://localhost:3000/test');
};
