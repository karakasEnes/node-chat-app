// import { io } from 'socket.io-client';

const socket = io();

socket.on('message', (m) => {
  console.log(m);
});

const form = document.querySelector('form') as HTMLFormElement;
const inputEl = document.querySelector('.input-form') as HTMLInputElement;
const btnLocation = document.querySelector('.location') as HTMLButtonElement;

btnLocation.addEventListener('click', () => {
  if (!window.navigator) {
    alert("Your browser doesn't support for geo location, please update it!");
  }

  window.navigator.geolocation.getCurrentPosition((pos) => {
    const urlLoc = `https://google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

    socket.emit('sendLocation', urlLoc, (m) => {
      console.log(m);
    });
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = inputEl.value;
  socket.emit('sendMessage', value, (err, m) => {
    if (err) {
      return console.log(err);
    }

    console.log(m);
  });
});
