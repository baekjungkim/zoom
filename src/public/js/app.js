const socket = io();

const enter = document.getElementById("enter");
const enterForm = enter.querySelector("form");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function showRoom() {
  enter.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = enterForm.querySelector("input");
  socket.emit("enter_room", input.value, showRoom);
  roomName = input.value;
  input.value = "";
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = roomForm.querySelector("input");
  const value = input.value;
  socket.emit("send_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}
enterForm.addEventListener("submit", handleRoomSubmit);

roomForm.addEventListener("submit", handleMessageSubmit);

socket.on("welcome", () => {
  addMessage("Someone Joined!");
});

socket.on("bye", () => {
  addMessage("Someone left!");
});

socket.on("recieve_message", addMessage);
