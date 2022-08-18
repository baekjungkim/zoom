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

ioServer.on("connection", (socket) => {
  socket.on("join_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });

  socket.on("send_offer", (offer, roomName) => {
    socket.to(roomName).emit("recieve_offer", offer);
  });
});

httpServer.listen(PORT, handleListen);
