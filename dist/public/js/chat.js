const socket = io();
const form = document.querySelector('form');
const btnMessage = document.querySelector('.btn-form');
const inputEl = document.querySelector('.input-form');
const btnLocation = document.querySelector('.location');
const $messages = document.querySelector('.messages');
const $sidebar = document.querySelector('.sidebar');
const { username, room } = Qs.parse(window.location.search, {
    ignoreQueryPrefix: true,
});
const markupMaker = (isURL, messageObj) => {
    const currentTime = moment(messageObj.createdAt).format('h:mm a');
    if (!isURL) {
        return `
    <div class="single-message">
      <div class="server-text">${messageObj.username} <span>${currentTime}</span> </div>
      <div class="server-message">${messageObj.text}</div>
    </div>
    `;
    }
    return `
  <div class="single-message">
      <div class="server-text">${messageObj.username} <span>${currentTime}</span></div>
      <div class="server-message">
        <a href="${messageObj.text}" target="_blank">My Location</a>
      </div>
    
  </div>
  `;
};
const markupSideBar = (roomData) => {
    const { room, users } = roomData;
    const roomEl = document.createElement('div');
    roomEl.classList.add('room');
    roomEl.innerHTML = room;
    const userTitle = document.createElement('h1');
    userTitle.classList.add('user-title');
    userTitle.innerHTML = 'USERS';
    const usersEl = document.createElement('ul');
    usersEl.classList.add('users');
    users.forEach((user) => {
        const userEl = document.createElement('li');
        userEl.classList.add('user');
        userEl.innerHTML = user.username;
        usersEl.appendChild(userEl);
    });
    $sidebar.innerHTML = '';
    $sidebar.appendChild(roomEl);
    $sidebar.appendChild(userTitle);
    $sidebar.appendChild(usersEl);
};
const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;
    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin + 3;
    // Visible height
    const visibleHeight = $messages.offsetHeight;
    // Height of messages container
    const containerHeight = $messages.scrollHeight;
    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};
socket.on('message', (messageObj) => {
    const htmlMarkup = markupMaker(false, messageObj);
    $messages.insertAdjacentHTML('beforeend', htmlMarkup);
    autoscroll();
});
socket.on('locationMessage', (messageObj) => {
    const htmlMarkup = markupMaker(true, messageObj);
    $messages.insertAdjacentHTML('beforeend', htmlMarkup);
    autoscroll();
});
socket.on('roomData', (roomData) => {
    markupSideBar(roomData);
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
            return err;
        }
    });
});
btnLocation.addEventListener('click', () => {
    if (!window.navigator) {
        return alert("Your browser doesn't support for geo location, please update it!");
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
        alert(error);
        location.href = '/';
    }
});
export {};
