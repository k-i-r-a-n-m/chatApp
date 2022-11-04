const form = document.querySelector("form");
const locationButton = document.querySelector("#sendLocation");

const socket = io();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.querySelector("#msg").value;
  socket.emit("sendMessage", msg, (ack) => {
    if (ack) {
      return console.log(ack);
      }
      console.log('message delivered!')
  });
});

locationButton.addEventListener("click", (e) => {
  if (!navigator.geolocation) {
    return alert("Geolocaiton not supported by browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    }, () => {
        console.log(`Location shared!`)
    });
  });
});

socket.on("message", (msg) => {
  console.log(`${msg}`);
});
