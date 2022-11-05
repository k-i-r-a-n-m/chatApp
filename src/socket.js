const Filter = require("bad-words");
const { generateMessage } = require("./utils/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`client:${socket.id}`);

    socket.emit("message", generateMessage("Welcome!"));

    socket.broadcast.emit("message", generateMessage("New user +1"));

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
        `https://google.com/maps?q=${coords.lat},${coords.long}`
      );
      callback();
    });

    socket.on("disconnect", () => {
      io.emit("message", generateMessage("user left -1"));
    });
  });
};
