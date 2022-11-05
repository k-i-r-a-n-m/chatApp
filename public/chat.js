const $form = document.querySelector("form");
const $submitBtn = document.querySelector("#msgSubmit");
const $msgInput = document.querySelector("#msgInput");
const $locationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");

const socket = io();

$form.addEventListener("submit", (e) => {
  e.preventDefault();
  // disable the button
  $submitBtn.setAttribute("disabled", "disabled");

  const msg = document.querySelector("#msgInput").value;
  // enable the button
  // reset the input textbox
  // refocus textbox
  socket.emit("sendMessage", msg, (ack) => {
    $submitBtn.removeAttribute("disabled");
    $msgInput.value = "";
    $msgInput.focus();
    if (ack) {
      return console.log(ack);
    }
    console.log("message delivered!");
  });
});

$locationButton.addEventListener("click", (e) => {
  // disable the location button
  e.target.setAttribute("disabled", "disabled");

  if (!navigator.geolocation) {
    return alert("Geolocaiton not supported by browser");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position);
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      },
      () => {
        e.target.removeAttribute("disabled");
        console.log(`Location shared!`);
      }
    );
  });
});

// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

socket.on("message", (message) => {
  console.log(`${message}`);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:m a"),
  });
  console.log(html);
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (location) => {
  const html = Mustache.render(locationTemplate, {
    url: location.url,
    createdAt: moment(location.createdAt).format("h:m a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  console.log(location);
});
