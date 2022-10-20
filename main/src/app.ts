//dot ENV
import dotenv from 'dotenv';
dotenv.config();
//lib imports
import express from 'express';
import { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import http from 'http';
import * as socketio from 'socket.io';
//file imports

//express Setup
const app: express.Application = express();
const server = http.createServer(app);
const io = new socketio.Server(server);
//PORT
const STATIC_PORT = 4343;
const PORT = process.env.PORT || STATIC_PORT;

//static paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;
//io
io.on('connection', (socket) => {
  console.log('New Web Socket connection!');

  socket.emit('message', 'Welcome to the SERVER!');

  socket.on('sendMessage', (m) => {
    console.log(m);
  });
});

server.listen(PORT, () => {
  console.log('listenin on port ' + PORT);
});
