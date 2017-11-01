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
let authController = require('./controllers/auth');
let userController = require('./controllers/user');

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

mongoose.Promise = Promise;

let connection = `mongodb://${config.mongoose.username}:${config.mongoose.password}@fifacluster-shard-00-00-iact2.mongodb.net:27017,fifacluster-shard-00-01-iact2.mongodb.net:27017,fifacluster-shard-00-02-iact2.mongodb.net:27017/test?ssl=true&replicaSet=FIFACluster-shard-0&authSource=admin`;
console.log(`Connecting to DB.. ${connection}`);
let db = mongoose.connection;
db.on('error', (err) => {
  console.log('connection error:', err);
});
db.once('open', (callback) => {
  console.log('db open');
  app.listen(3134, () => {
    console.log('Listening from 3134...');
  });
});
mongoose.connect(connection, {
  useMongoClient: true
});

let router = express.Router();

app.get('/', (req, res) => {
  res.render('main', { user: _.get(req, 'session.passport.user') });
});

app.get('/auth/google', authController.googleAuth);
app.get('/auth/google/callback', authController.googleAuthCallback);
app.get('/auth/facebook', authController.facebookAuth);
app.get('/auth/facebook/callback', authController.facebookAuthCallback);
app.get('/auth/logout', authController.logout);

router.get('/user/me', userController.getMe);

app.use('/api', router);

