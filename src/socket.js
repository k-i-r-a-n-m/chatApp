const Filter = require("bad-words");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require("./utils/users");

const {
  generateMessage,
  generateLocationMessage,
} = require("./utils/messages");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`client:${socket.id}`);

    // room
    socket.on("join", (userData, callback) => {
      const { error, user } = addUser({ id: socket.id, ...userData });
      if (error) {
        return callback(error);
      }

      socket.join(user.room);

      socket.emit("message", generateMessage("Admin", "Welcome!"));
      socket.broadcast
        .to(user.room)
        .emit("message", generateMessage(`${user.username} has joined`));

      // sending all in a room to the client
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("sendMessage", (msg, callback) => {
      const filter = new Filter();
      if (filter.isProfane(msg)) {
        return callback(`Profanity is not allowed`);
      }
      const user = getUser(socket.id);
      io.to(user.room).emit("message", generateMessage(user.username, msg));
      callback();
    });

    socket.on("sendLocation", (coords, callback) => {
      console.log("position:" + coords.lat, coords.long);
      const user = getUser(socket.id);
      io.to(user.room).emit(
        "locationMessage",
        generateLocationMessage(
          user.username,
          `https://google.com/maps?q=${coords.lat},${coords.long}`
        )
      );
      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit(
          "message",
          generateMessage(`${user.username} has left`)
        );

        io.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
};
