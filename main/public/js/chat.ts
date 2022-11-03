declare const moment: any;
declare const queryString: any;
declare const io: any;
declare const Qs: any;

const socket = io();

const form = document.querySelector('form') as HTMLFormElement;
const btnMessage = document.querySelector('.btn-form') as HTMLButtonElement;
const inputEl = document.querySelector('.input-form') as HTMLInputElement;
const btnLocation = document.querySelector('.location') as HTMLButtonElement;
const $messages = document.querySelector('.messages') as HTMLDivElement;

const { username, room } = Qs.parse(window.location.search, {
  ignoreQueryPrefix: true,
});

const markupMaker = (isURL, messageObj) => {
  const currentTime = moment(messageObj.createdAt).format('h:mm a');
  if (!isURL) {
    return `
    <div>
      <div class="username-text">${messageObj.username}</div>
      <div class="message">${currentTime} - ${messageObj.text}</div>
    </div>
    `;
  }

  return `
  <div>
      <div class="username-text">${messageObj.username}</div>
      <div class="message">
      ${currentTime} - <a href="${messageObj.text}" target="_blank">Your Location</a>
      </div>
    
  </div>
  `;
};

socket.on('message', (messageObj) => {
  const htmlMarkup = markupMaker(false, messageObj);
  $messages.insertAdjacentHTML('beforeend', htmlMarkup);
});

socket.on('locationMessage', (messageObj) => {
  const htmlMarkup = markupMaker(true, messageObj);
  $messages.insertAdjacentHTML('beforeend', htmlMarkup);
});

form.addEventListener('submit', (e) => {
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
    return alert(
      "Your browser doesn't support for geo location, please update it!"
    );
  }

  btnLocation.setAttribute('disabled', 'disabled');

  window.navigator.geolocation.getCurrentPosition((pos) => {
    const urlLoc = `https://google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;

    socket.emit('sendLocation', urlLoc, () => {
      btnLocation.removeAttribute('disabled');
    });
  });
});

socket.emit('join', { username, room }, (error) => {
  if (error) {
    console.log(error);
    alert(error);
    location.href = '/';
  }
});
