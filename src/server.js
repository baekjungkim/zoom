import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

const PORT = 3000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

const httpServer = http.createServer(app);
const ioServer = SocketIO(httpServer);

ioServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("send_message", (message, roomName, done) => {
    socket.to(roomName).emit("recieve_message", message);
    done(message);
  });

  socket.on("disconnecting", (reason) => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye"));
  });
});

// const wss = new WebSocket.Server({ server });
// const sockets = [];
// wss.on("connection", (socket) => {
//   socket["nickname"] = "Anonymous";
//   sockets.push(socket);
//   console.log("Connected to browser ✅");
//   socket.on("close", () => console.log("Disconnected from the browser ❌"));
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
