const $form = document.querySelector("form");
const $submitBtn = document.querySelector("#msgSubmit");
const $msgInput = document.querySelector("#msgInput");
const $locationButton = document.querySelector("#sendLocation");
const $messages = document.querySelector("#messages");
const $sideBar = document.querySelector("#sideBar");

const socket = io();

// LISTENERS-DOM
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

// opitons
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// TEMPLATES
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sideBarTemplate = document.querySelector("#sidebar-template").innerHTML;

const autoScroll = () => {
  // new message element
  $newMessage = $messages.lastElementChild;

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  //  visible height
  const visibleHeight = $messages.offsetHeight;
  // Height of messages container
  const containerHeight = $messages.scrollHeight;
  // How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

// SOCKET-LISTERNERS/HANDLERS

// Message Template
socket.on("message", (message) => {
  console.log(`${message}`);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format("h:m a"),
    username: message.username,
  });
  console.log(html);
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

// Locaiton Template
socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationTemplate, {
    url: message.url,
    createdAt: moment(message.createdAt).format("h:m a"),
    username: message.username,
  });
  $messages.insertAdjacentHTML("beforeend", html);
  console.log(location);
  autoScroll();
});

// sidebar template
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sideBarTemplate, {
    room,
    users,
  });
  $sideBar.innerHTML = html;
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
  console.log("joined a room!");
});
