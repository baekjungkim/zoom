const socket = io();

const enter = document.getElementById("enter");
const enterForm = enter.querySelector("form");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");

room.hidden = true;

let roomName;

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

enterForm.addEventListener("submit", handleRoomSubmit);
