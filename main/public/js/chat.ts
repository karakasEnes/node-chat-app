const socket = io();

socket.on('countUpdated', (count) => {
  console.log('count updated from client side ' + count);
});

const btnInc = document.querySelector('.btn-inc') as HTMLButtonElement;

btnInc.addEventListener('click', () => {
  console.log('btn cliked');
  socket.emit('increment');
});
