"use strict";
// import { io } from 'socket.io-client';
const socket = io();
socket.on('message', (m) => {
    console.log(m);
});
const form = document.querySelector('form');
const inputEl = document.querySelector('.input-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = inputEl.value;
    socket.emit('sendMessage', value);
});
