import http from "http";
import { Server } from "socket.io";
import express from "express";
const { instrument } = require("@socket.io/admin-ui");

const app = express();

const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(ioServer, {
  auth: false,
});

function getPublicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = ioServer;

  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function getRoomUserCount(roomName) {
  return ioServer.sockets.adapter.rooms.get(roomName)?.size;
}

ioServer.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";

  socket.onAny((event) => {
    console.log(ioServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done(getRoomUserCount(roomName));
    socket
      .to(roomName)
      .emit("welcome", socket.nickname, getRoomUserCount(roomName));
    ioServer.sockets.emit("room_change", getPublicRooms());
  });

  socket.on("send_message", (message, roomName, done) => {
    socket
      .to(roomName)
      .emit("recieve_message", `${socket.nickname}: ${message}`);
    done();
  });

  socket.on("set_nickname", (nickname, done) => {
    const beforeNick = socket.nickname;
    socket["nickname"] = nickname;
    socket.rooms.forEach((room) =>
      socket.to(room).emit("set_nickname", beforeNick, nickname)
    );
    done();
  });

  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, getRoomUserCount(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    ioServer.sockets.emit("room_change", getPublicRooms());
  });
});

// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on("connection", (socket) => {
//   socket["nickname"] = "Anonymous";
//   sockets.push(socket);
//   console.log("Connected to browser ???");
//   socket.on("close", () => console.log("Disconnected from the browser ???"));
//   socket.on("message", (message) => {
//     const { type, payload } = JSON.parse(message);
//     switch (type) {
//       case "message":
//         sockets.forEach((aSocket) =>
//           aSocket.send(`${socket.nickname}: ${payload}`)
//         );
//         break;
//       case "nickname":
//         socket["nickname"] = payload;
//         break;
//     }
//   });
// });

httpServer.listen(PORT, handleListen);
