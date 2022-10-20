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
import Filter from 'bad-words';
//file imports
import { generateMessage } from './utils/messages.js';

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

  socket.emit('message', generateMessage('Welcome to the SERVER!'));

  socket.broadcast.emit('message', 'a new user joined');

  socket.on('sendMessage', (m, cb) => {
    const filter = new Filter();

    if (filter.isProfane(m)) {
      return cb('The message contains profanity words.');
    }

    io.emit('message', generateMessage(m));
    cb(undefined, 'Message revecived by server');
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMessage('a user has left'));
  });

  socket.on('sendLocation', (url, cb) => {
    io.emit('locationMessage', generateMessage(url));
    cb('Your location is shared successfully!');
  });
});

server.listen(PORT, () => {
  console.log('listenin on port ' + PORT);
});
