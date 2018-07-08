// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var bodyParser = require('body-parser');
var boot = require('loopback-boot');
var loopback = require('loopback');
var path = require('path');
const logger = require('winston');
let LoopBackContext = require('loopback-context');
require('events').EventEmitter.prototype._maxListeners = 150;

var app = module.exports = loopback();


app.use(loopback.token({
  model: app.models.accessToken
}));
app.use(loopback.token(
  process.env.environment === 'development' ? {
    headers: ['access_token', 'X-Access_Token'],
    params: ['access_token', 'access_token']
  } : {
    headers: ['access_token', 'X-Access_Token']
  }
));
app.middleware('initial', bodyParser.urlencoded({ extended: true }));

// Bootstrap the application, configure models, datasources and middleware.

boot(app, __dirname);

app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing

// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, 'views'));

//Set the currently authenticated user data
app.use(function (req, res, next) {
  let loopbackContext = LoopBackContext.getCurrentContext();
  if (!req.accessToken) return next();
  app.models.Users.findOne({
    where:
      {id: req.accessToken.userid},
    include: {
      relation: "user_role",
      scope: { include: "role" }
    }
  }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new Error("No user with this access token was found."));
    }
    res.locals.currentUser = user;
    if (loopbackContext) loopbackContext.set("currentUser", user);
    console.log('-----------',loopbackContext.get("currentUser"));
    next();
  });
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
