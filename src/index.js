const http = require("http");
const path = require("path");
const express = require("express");
const socketIo = require("socket.io");

const socketServer = require("./socket.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", express.static("index.html"));

socketServer(io);

server.listen(PORT, () => {
  console.log(`serving on port ${PORT}...`);
});
