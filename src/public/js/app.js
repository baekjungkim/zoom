const socket = io();

const enter = document.getElementById("enter");
const enterForm = enter.querySelector("form");

function backendDone(message) {
  console.log(message);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = enterForm.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, backendDone);
  input.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);
