'use strict';

require('dotenv').config();
const http = require('http');
const process = require('node:process');
const { Server } = require("socket.io");
const messageModel = require('./models/message.model');
const port = process.env.PORT || 5050;
const env = process.env.ENV || 'Development';
const app_name = process.env.APP_NAME || 'Finance Management Server';

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
app.get('/api/v1', (req, res) => {
  res.send("Welcome to Finance API")
})
const api_v1 = require('./routes/index');
// Handle HTTP Requests

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

const server = http.createServer(app);
app.set('PORT_NUMBER', port);

server.listen(port, () => {
  const data = new Date();
  console.log('|--------------------------------------------');
  console.log('| Server       : ' + app_name);
  console.log('| Environment  : ' + env);
  console.log('| Port         : ' + port);
  console.log(
    '| Date         : ' +
    data
      .toJSON()
      .split('T')
      .join(' '),
  );
  console.log('|--------------------------------------------');
  console.log('| Waiting For Database Connection ');
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

const io = new Server(server,{
  cors: {
    origin: "*", // Cho phép tất cả các origin
    methods: ["GET", "POST"] // Cho phép các phương thức GET và POST
  }
});

io.on("connection", (socket) => {
  console.log('New client connected');
  socket.on("message", async (data) => {
    try {
      const message = new messageModel(data);
      const newMessage = await message.save();
      const populateMessage = await newMessage.populate([
        {path: 'sender', select: 'name'},
        {path: 'receiver', select: 'name'}
      ]);
      // console.log(populateMessage.receiver._id.toString());
      socket.to(populateMessage.receiver._id.toString()).emit('message', populateMessage);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});