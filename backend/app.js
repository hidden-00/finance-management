require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const { default: mongoose } = require('mongoose')
const requestIp = require('request-ip')
const path = require('path')
const httpStatus = require('http-status')
const sendResponse = require('./helpers/sendResponse')
const mongoURI = process.env.MONGODB_URI;

const app = express()

app.use(logger('dev'))
app.use(
    bodyParser.json({
        limit: '50mb',
    })
)

app.use(
    bodyParser.urlencoded({
        limit: '50mb',
        extended: false,
    })
)

mongoose.Promise = global.Promise

Promise.resolve(app)
    .then(MongoDBConnection())
    .catch(err => console.error.bind(console, `MongoDB connection error: ${JSON.stringify(err)}`))

async function MongoDBConnection() {
    console.log(`| MongoDB URL  : ${mongoURI}`);
    await mongoose
        .connect(mongoURI)
        .then(() => {
            console.log('| MongoDB Connected');
            console.log('|--------------------------------------------');
        });

    return null;
}

app.use(function (req, res, next) {
    req.client_ip_address = requestIp.getClientIp(req);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'DELETE, GET, POST, PUT, PATCH, OPTIONS');
    next();
});

app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/api/v1', (req, res)=>{
  res.send("Welcome to Finance API")
})
const api_v1 = require('./routes/index');
app.use('/api/v1', api_v1)
// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return sendResponse(res, httpStatus.NOT_FOUND, false, null, err, 'Route Not Found', null);
  } else {
    console.log('\x1b[41m', err);
    let path = req.baseUrl + req.route && req.route.path;
    if (path.substr(path.length - 1) === '/') {
      path = path.slice(0, path.length - 1);
    }
    err.method = req.method;
    err.path = req.path;
    return sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, false, null, err, null, null);
  }
});

module.exports = app