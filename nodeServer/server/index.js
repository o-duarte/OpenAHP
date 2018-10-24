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
import mockData from './db/mockdata';

const app = express();
const router = express.Router();

// Applying basic middlewares.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

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
//todo this redirects to 3001 no to 3000
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
  })
);

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

// mocking some data.
mockData();
