(function() {
    'use strict';
    var env = process.env.NODE_ENV || 'development';
    var config = require('./config/config.json')[env];
    var app = require('connect')();
    var swaggerTools = require('swagger-tools');
    var jsyaml = require('js-yaml');
    var fs = require('fs');
    var cors = require('cors');
    var serveStatic = require('serve-static');
    var options = {
        swaggerUi: '/swagger.json',
        controllers: './controllers',
        useStubs: env === 'development' ? true : false // Conditionally turn on stubs (mock mode)
    };
    app.use(cors()); //Allow Cross Origin Connections

    var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function(middleware) {
      app.use(middleware.swaggerMetadata());
      app.use(middleware.swaggerValidator());
      app.use(middleware.swaggerRouter(options));
      app.use(middleware.swaggerUi());
      app.use(function onerror(err, req, res, next) {
        //console.log(err.results.errors);
        res.setHeader('content-type', 'application/json');
        res.statusCode = 400;
        if(err.code && err.code < 599 && err.code > 399){
          res.statusCode = err.code;
        }
        res.end(JSON.stringify({"name": err.name, "message": err.message, "verbose": err}, null, 2));
      });
    });
    app.use('/', serveStatic("./public",{'index': ['index.html', 'index.htm']}));
    app.use('/data', serveStatic("./data"));
    module.exports = app;
}());
