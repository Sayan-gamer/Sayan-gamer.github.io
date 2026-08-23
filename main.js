import { store } from './messageStore.js';

// Grab the elements from our HTML
const displayHeader = document.getElementById('message-display');
const inputBox = document.getElementById('message-input');
const updateButton = document.getElementById('update-btn');

// 1. WATCH: Whenever the store changes, update the header automatically
store.watch((newMessage) => {
  displayHeader.textContent = newMessage;
});

// 2. UPDATE: When the button is clicked, change the store's message
updateButton.addEventListener('click', () => {
  store.message = inputBox.value;
  inputBox.value = ''; // Clear the input box after sending
});
