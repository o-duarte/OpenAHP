const GOOGLE_CLIENT_ID =  '532448165576-aoh94u8pqopndte3hhn6g2o81cps0or4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '24bb8rzTzEKQEawy6ASH1psE';
/*
const MONGO_URI = 'mongodb://localhost:27017/OpenChoice';
const SERVER_URL = 'http://localhost:3001';
const CLIENT_URL = 'http://localhost:3000';
const SOLVER_URL = 'http://localhost:8080';
const MACHINE_URL = 'http://localhost:3000';
*/

//use in docker
const MACHINE_URL = 'http://localhost'
const SERVER_URL = 'express:3001';
const CLIENT_URL = 'react:3000';
const SOLVER_URL = 'maven:8080';

export { MONGO_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_URL, CLIENT_URL, SOLVER_URL, MACHINE_URL };
