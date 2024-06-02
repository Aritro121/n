const socket = io('http://localhost:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');
let audio = new Audio('song.mp3');

// Function to append messages to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }  
}

// Prompt user for their name
const names = prompt('Enter your name to join: ');
socket.emit('new-user-joined', names);

// Listen for events from the server
socket.on('user-joined', names => {
    append(`${names}: joined the chat`, 'left');
});

socket.on('receive', data => {
    append(`${data.names}: ${data.message}`, 'left');
});

socket.on('user-left', names => {
    append(`${names}: left the chat`, 'left');
});

// Event listener for form submission to send messages
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});
