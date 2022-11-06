const Filter = require("bad-words");
const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`client:${socket.id}`);

    // room
    socket.on("join", ({ username, room }) => {
      socket.join(room);

      socket.emit("message", generateMessage("Welcome!"));
      socket.broadcast
        .to(room)
        .emit("message", generateMessage(`${username} has joined`));
    });

    socket.on("sendMessage", (msg, callback) => {
      const filter = new Filter();
      if (filter.isProfane(msg)) {
        return callback(`Profanity is not allowed`);
      }
      io.emit("message", generateMessage(msg));
      callback();
    });

    socket.on("sendLocation", (coords, callback) => {
      console.log("position:" + coords.lat, coords.long);
      io.emit(
        "locationMessage",
        generateLocationMessage(
          `https://google.com/maps?q=${coords.lat},${coords.long}`
        )
      );
      callback();
    });

    socket.on("disconnect", () => {
      io.emit("message", generateMessage("user left -1"));
    });
  });
};
