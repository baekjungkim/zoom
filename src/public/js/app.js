const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
  try {
    myStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    myFace.srcObject = myStream;
    console.log(myStream);
  } catch (e) {
    console.log(e);
  }
}

getMedia();

function handleMuteClick() {
  if (!muted) {
    muteBtn.innerText = "Unmute";
  } else {
    muteBtn.innerText = "Mute";
  }
  muted = !muted;
}
function handleCameraClick() {
  if (!cameraOff) {
    cameraBtn.innerText = "Camera On";
  } else {
    cameraBtn.innerText = "Camera Off";
  }
  cameraOff = !cameraOff;
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
