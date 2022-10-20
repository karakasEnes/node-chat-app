// import { io } from 'socket.io-client';
const socket = io();

const form = document.querySelector('form') as HTMLFormElement;
const btnForm = document.querySelector('.btn-form') as HTMLButtonElement;
const inputEl = document.querySelector('.input-form') as HTMLInputElement;
const btnLocation = document.querySelector('.location') as HTMLButtonElement;
const $messages = document.querySelector('.messages') as HTMLDivElement;
const $templateHTML = document.querySelector('#message-template')!.innerHTML;

socket.on('message', (m) => {
  console.log(m);
  //update template
  const htmlMarkup = `
    <div>
      ${m}
    </div>
    `;

  $messages.insertAdjacentHTML('beforeend', htmlMarkup);
});

btnForm.addEventListener('click', (e) => {
  e.preventDefault();

  btnForm.setAttribute('disabled', 'disabled');

  const value = inputEl.value;
  socket.emit('sendMessage', value, (err, m) => {
    btnForm.removeAttribute('disabled');
    inputEl.value = '';
    inputEl.focus();

    if (err) {
      return console.log(err);
    }

    console.log(m);
  });
});

btnLocation.addEventListener('click', () => {
  if (!window.navigator) {
    return alert(
      "Your browser doesn't support for geo location, please update it!"
    );
  }

  btnLocation.setAttribute('disabled', 'disabled');

  window.navigator.geolocation.getCurrentPosition((pos) => {
    const urlLoc = `https://google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

    socket.emit('sendLocation', urlLoc, (m) => {
      console.log(m);
      btnLocation.removeAttribute('disabled');
    });
  });
});
