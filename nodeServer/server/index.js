import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

// For mongodb.
import mongoose from 'mongoose';
import './lib/models';

// For authetication and session management.
import session from 'express-session';
import passport from 'passport';
import ConnectMongo from 'connect-mongo';
import './lib/auth';

// For GraphQL Server.
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import { MONGO_URI } from './lib/config';
import schemas from './lib/schema';
import resolvers from './lib/resolvers';
import {CLIENT_URL, SOLVER_URL} from './lib/config'

import request from 'request';

const app = express();
const router = express.Router();

// Applying basic middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
 * Mongoose setup.
 */

// Mongoose's built in promise library is deprecated, replace it with ES2015
// Promise
mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, { useMongoClient: true });

/*
 * Passport and session setup.
 */

const MongoStore = ConnectMongo(session);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: 'aaabbbccc',
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true
    })
  })
);

/*
 * Passoport Setup.
 */

// Passport is wired into express as a middleware. When a request comes in,
// Passport will examine the request's session (as set by the above config) and
// assign the current user to the 'req.user' object.
app.use(passport.initialize());
app.use(passport.session());

/*
 * GraphQL Server setup.
 */

// Put together a schema.
const schema = makeExecutableSchema({
  typeDefs: schemas,
  resolvers: resolvers
});

// The GraphQL endpoint.
app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => {
    return { schema, context: req };
  })
);

// GraphiQL, a visual editor for queries.
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

/*
 * Express Routes.
 */

// Router for google API.
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_URL + '/dashboard',
    failureRedirect: CLIENT_URL + '/login'
  })
);

app.get('/ahpsolver/:id', function(req,res) {

  var path = SOLVER_URL + '/ahp/' + req.params.id

  request.get(path, function (error, response, body) {
    console.log('error:', error); 
    console.log('statusCode:', response && response.statusCode); 
    res.send(JSON.parse(body))
  })
})

app.post('/ahpanalisis/:id', function(req,res) {
  var path = SOLVER_URL + '/ahp/analisis/' + req.params.id
  console.log(req.body)
  console.log(JSON.stringify(req.body))
  request({
    method: 'POST',
    uri: path,
    json: true,
    body: req.body,     
  },
  function (error, response, body) {
    if (error) {
      return console.error('upload failed:', error);
    }
    console.log('Upload successful!  Server responded with:', body);
    res.send(body)
  })
})


/*
 * Static File server setup.
 */

// All files must be in the build client directory.
const staticFiles = express.static(path.join(__dirname, '../../client/build'));
app.use(staticFiles);

// Any routes not picked up by the server api will be handled by the react router
app.use('/*', staticFiles);

// Setup port and running.
app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), () => {
  console.log(`OpenChoice app running on ${app.get('port')}`);
});

