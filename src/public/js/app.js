const socket = io();

const enter = document.getElementById("enter");
const enterForm = enter.querySelector("form");
const room = document.getElementById("room");
const messageForm = room.querySelector("#message");
const nicknameForm = document.querySelector("#nicknameForm");
const nicknameDiv = document.querySelector("#nickname");
const nicknameH3 = nicknameDiv.querySelector("h3");
const nicknameChangeButton = nicknameDiv.querySelector("button");

room.hidden = true;
nicknameDiv.hidden = true;

let roomName;
let nickname;

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

function nicknameFormChange() {
  nicknameDiv.hidden = false;
  nicknameH3.innerText = `Nickname: ${nickname}`;
  nicknameForm.hidden = true;
}

function handleNicknameChange() {
  nicknameDiv.hidden = true;
  nicknameForm.hidden = false;
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
  const input = messageForm.querySelector("input");
  const value = input.value;
  socket.emit("send_message", value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nicknameForm.querySelector("input");
  socket.emit("set_nickname", input.value, nicknameFormChange);
  nickname = input.value;
}

enterForm.addEventListener("submit", handleRoomSubmit);
nicknameForm.addEventListener("submit", handleNicknameSubmit);
messageForm.addEventListener("submit", handleMessageSubmit);
nicknameChangeButton.addEventListener("click", handleNicknameChange);

socket.on("welcome", (nickname) => {
  addMessage(`${nickname} Joined!`);
});

socket.on("bye", (nickname) => {
  addMessage(`${nickname} Left!`);
});

socket.on("recieve_message", addMessage);

socket.on("set_nickname", (before, after) => {
  addMessage(`${before} changed nickname to ${after}`);
});

socket.on("room_change", (rooms) => {
  const roomList = enter.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
