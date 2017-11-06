let Promise = require('bluebird');
let bodyParser = require('body-parser');
let cons = require('consolidate');
let cookieParser = require('cookie-parser');
let express = require('express');
let session = require('express-session');
let _ = require('lodash');
let mongoose = require('mongoose');
let passport = require('passport');
let path = require('path');
let util = require('util');
let config = require('./config');
let authAPI = require('./controllers/auth');
let matchAPI = require('./controllers/match');
let squadAPI = require('./controllers/squad');
let userAPI = require('./controllers/user');
let staticdata = require('./staticdata');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'FIFA',
  resave: false,
  saveUninitialized: true
}));
app.use(cookieParser());
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${util.inspect(req.body, { colors: true }).replace(/\n/g, '')}`);
  next(null, req, res);
});
app.use(express.static('views'));
app.use(passport.initialize());
app.use(passport.session());

staticdata.fetch();
mongoose.Promise = Promise;

let connection = `mongodb://${config.mongoose.username}:${config.mongoose.password}@fifacluster-shard-00-00-iact2.mongodb.net:27017,fifacluster-shard-00-01-iact2.mongodb.net:27017,fifacluster-shard-00-02-iact2.mongodb.net:27017/test?ssl=true&replicaSet=FIFACluster-shard-0&authSource=admin`;
console.log(`Connecting to DB.. ${connection}`);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log('connection error:', err);
});
db.once('open', (callback) => {
  console.log('db open');
  const { address } = config;
  app.listen(port, () => {
    console.log(`Listening from ${address}`);
  });
});
mongoose.connect(connection, {
  useMongoClient: true
});

let router = express.Router();

app.get('/', (req, res) => {
  res.render('main', { user: _.get(req, 'session.passport.user') });
});

app.get('/auth/google', authAPI.googleAuth);
app.get('/auth/google/callback', authAPI.googleAuthCallback);
app.get('/auth/facebook', authAPI.facebookAuth);
app.get('/auth/facebook/callback', authAPI.facebookAuthCallback);
app.get('/auth/logout', authAPI.logout);

router.get('/user/me', userAPI.getMe);
router.get('/user/:userid', userAPI.getUser);
router.get('/squad/mine', squadAPI.getMine);
router.put('/squad/mine/team/:teamid', squadAPI.setTeam);

router.put('/match', matchAPI.make);

app.use('/api', router);

