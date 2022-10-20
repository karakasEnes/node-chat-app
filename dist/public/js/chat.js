"use strict";
const socket = io();
const form = document.querySelector('form');
const btnMessage = document.querySelector('.btn-form');
const inputEl = document.querySelector('.input-form');
const btnLocation = document.querySelector('.location');
const $messages = document.querySelector('.messages');
const markupMaker = (isLink, obj) => {
    const dateNew = moment(obj.createdAt).format('h:mm');
    if (!isLink) {
        return `
    <div>
    ${dateNew} - ${obj.text}
    </div>
    `;
    }
    return `
  <div>
    <a href="${obj.text}" target="_blank">Your Location</a>
  </div>
  `;
};
socket.on('message', (obj) => {
    const htmlMarkup = markupMaker(false, obj);
    $messages.insertAdjacentHTML('beforeend', htmlMarkup);
});
socket.on('locationMessage', (obj) => {
    const htmlMarkup = markupMaker(true, obj);
    $messages.insertAdjacentHTML('beforeend', htmlMarkup);
});
btnMessage.addEventListener('click', (e) => {
    e.preventDefault();
    btnMessage.setAttribute('disabled', 'disabled');
    const value = inputEl.value;
    socket.emit('sendMessage', value, (err, message) => {
        btnMessage.removeAttribute('disabled');
        inputEl.value = '';
        inputEl.focus();
        if (err) {
            return console.log(err);
        }
        console.log(message);
    });
});
btnLocation.addEventListener('click', () => {
    if (!window.navigator) {
        return alert("Your browser doesn't support for geo location, please update it!");
    }
    btnLocation.setAttribute('disabled', 'disabled');
    window.navigator.geolocation.getCurrentPosition((pos) => {
        const urlLoc = `https://google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        socket.emit('sendLocation', urlLoc, (m) => {
            btnLocation.removeAttribute('disabled');
        });
    });
});
