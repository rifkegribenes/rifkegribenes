'use strict';

// set up ======================================================================
const express = require('express');
const app = express();
const middleware = require('./middleware');
app.use(middleware);
const favicon = require('serve-favicon');
const dotenv = require('dotenv').load();
const path = require('path');

// initialize passport
const session = require('express-session');
const passport = require('passport');
require('./app/config/passport')(passport); // pass passport for configuration
const user = require('./app/utils/passport-serialize');
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(user.serialize);
passport.deserializeUser(user.deserialize);


// connect to db
const pg = require('pg');
const configDB = require('./app/config/db.js');
const client = new pg.Client(configDB.url);
client.connect((err) => {
  if (err) {
    return console.error('could not connect to postgres', err);
  }
  client.query('SELECT NOW() AS "theTime"', function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log(result.rows[0].theTime);
    // >> output: 2018-08-23T14:02:57.117Z
    client.end();
  });
});

// routes ======================================================================
// const router = require('./router');
// router(app);

// routes
const apiRoutes    = require('./routes/apiRoutes');
const staticRoutes = require('./routes/staticRoutes');

// set static path
app.use(express.static(path.join(__dirname, '/client/build/')));

/* ================================ ROUTES ================================= */

app.use('/api', apiRoutes);
app.use('/',    staticRoutes);

// app.get('/', (req, res) => {
//   console.log('root route, serving client');
//   res.status(200)
//     .sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// launch ======================================================================
var port = process.env.PORT || 3001;
app.listen(port,  function () {
  console.log('Node.js listening on port ' + port + '...');
});