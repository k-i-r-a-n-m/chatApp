const users = [];

// addUser, removeUser, getUser, getUsersInRoom


// ADD-USER
const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // userName and room must not be empty
  if (!username || !room) {
    return {
      error: "UserName and room are required!",
    };
  }

  // check if the user already exists in the room
  const existingUser = users.find((user) => {
    return user.username === username && user.room === room;
  });

  //  validate user name
  if (existingUser) {
    return { error: "userName in use!" };
  }

  // store user
  const user = { id, username, room };
  users.push(user);

  return {user};
};

// REMOVE-USER
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index >= 0) {
    return users.splice(index, 1)[0];
  }
};

// GET-USER
const getUser = (id) => {
   return users.find((user)=>user.id===id)
}

//GET-All-USER-IN-A-ROOM
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user)=>user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


//  addUser({
//   id: 12,
//   username: "kiki",
//   room: "silicon valley",
// });
//  addUser({
//   id: 22,
//   username: "jojo",
//   room: "silicon valley",
// });
//  addUser({
//   id: 32,
//   username: "harry",
//   room: "hogwards",
// });


// console.log(getUser(20))
// console.log(getUsersInRoom("silicon valley"))
// console.log(getUsersInRoom("red"))



