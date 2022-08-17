const socket = io();

const enter = document.getElementById("enter");
const enterForm = enter.querySelector("form");

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = enterForm.querySelector("input");
  socket.emit("enter_room", { payload: input.value }, () => {
    console.log("server is done!");
  });
  input.value = "";
}

enterForm.addEventListener("submit", handleRoomSubmit);
