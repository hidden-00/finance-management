'use strict';

require('dotenv').config();
const http = require('http');
const app = require('./app');
const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const process = require('node:process');
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");
const { Server } = require("socket.io");
const { info } = require('node:console');
const messageModel = require('./models/message.model');
const port = process.env.PORT || 5050;
const env = process.env.ENV || 'Development';
const app_name = process.env.APP_NAME || 'Finance Management Server';

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`)

  const server = http.createServer();

  setupMaster(server, {
    loadBalancingMethod: "least-connection"
  });
  setupPrimary();
  cluster.setupPrimary({
    serialization: "advanced"
  });

  // Launching workers based on the number of CPU threads.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const server = http.createServer(app);
  app.set('PORT_NUMBER', port);

  //  Start the app on the specific interface (and port).
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

  const io = new Server(server);

  // Using the cluster socket.io adapter.
  io.adapter(createAdapter());

  // Setting up worker connection with the primary thread.
  setupWorker(io);

  io.on("connection", (socket) => {
    console.log('New client connected');
    socket.on("message", async (data) => {
      try {
        const message = new messageModel(data);
        await message.save();
        socket.to(message.receiver).emit(data);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });
    socket.on('join', (userId) => {
      // Khi một người dùng tham gia vào phòng chat, họ sẽ tham gia vào một room có tên là userId của họ
      socket.join(userId);
    });
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

}