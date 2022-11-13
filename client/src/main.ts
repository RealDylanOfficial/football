import { Game, Position } from "./game";
import { io } from "socket.io-client";

// Connects to the server
const socket = io("ws://localhost:3000");

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

socket.on("start", ({ id, players }) => {
  console.log(id, players);
  const game = new Game(id, players, (quaternion: Quaternion) => {
    socket.emit("set looking", quaternion);
  });

  socket.on("player joined", ({ id, state: { position } }) => {
    game.playerJoined(id, position);
  });

  socket.on("player left", (id) => {
    game.playerLeft(id);
  });

  socket.on("tick", (players, ball) => {
    game.tick(players, ball);
  });
});

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      socket.emit("input down", "forward");
      break;

    case "ArrowLeft":
    case "a":
    case "A":
      socket.emit("input down", "left");
      break;

    case "ArrowDown":
    case "s":
    case "S":
      socket.emit("input down", "backward");
      break;

    case "ArrowRight":
    case "d":
    case "D":
      socket.emit("input down", "right");
      break;

    case " ":
      socket.emit("jump");
      break;

    case "Shift":
      socket.emit("input down", "sprint");
      break;
  }
});

document.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      socket.emit("input up", "forward");
      break;

    case "ArrowLeft":
    case "a":
    case "A":
      socket.emit("input up", "left");
      break;

    case "ArrowDown":
    case "s":
    case "S":
      socket.emit("input up", "backward");
      break;

    case "ArrowRight":
    case "d":
    case "D":
      socket.emit("input up", "right");
      break;

    case "Shift":
      socket.emit("input up", "sprint");
      break;
  }
});

document.addEventListener("mousedown", (e) => {
  switch (e.button) {
    case 0:
      socket.emit("boot");
      break;
    case 2:
      socket.emit("tap");
  }
});

document.addEventListener("contextmenu", (event) => event.preventDefault());
