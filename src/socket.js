const Filter = require("bad-words");


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`client:${socket.id}`);

    socket.emit("message", "welcome");
    socket.broadcast.emit('message',"New user +1")
      socket.on("sendMessage", (msg, callback) => {
        const filter = new Filter()
      if (filter.isProfane(msg)) {
        return callback(`Profanity is not allowed`);
      }
      io.emit("message", msg);
      callback();
    });

      socket.on("sendLocation", (coords, callback) => {
      console.log("position:" + coords.lat, coords.long);
      io.emit(
        "message",
        `https://google.com/maps?q=${coords.lat},${coords.long}`
          );
          callback()
    });
      
      socket.on('disconnect', () => {
        io.emit('message',"user left -1")
    })
  });
};
