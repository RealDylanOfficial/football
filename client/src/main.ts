import { Game } from "./game";
import { io } from "socket.io-client";

// Connects to the server
const socket = io("ws://localhost:3000");

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

function setScores(score: [number, number]) {
  const team1 = document.getElementById("team0");
  const team2 = document.getElementById("team1");

  if (team1 && team2) {
    team1.innerText = score[0].toString();
    team2.innerText = score[1].toString();
  }
}

socket.on("start", ({ id, players, score, team }) => {
  setScores(score);

  const scoreElement = document.getElementById(`team${team}`);
  console.log(scoreElement);

  if (scoreElement) {
    scoreElement.style.color = "yellow";
  }

  console.log(id, players);
  const game = new Game(id, players, (quaternion: Quaternion) => {
    socket.emit("set looking", quaternion);
  });

  socket.on("update clock", (time) => {
    console.log(time);
    const element = document.getElementById("timer");

    if (element) {
      const mins = Math.floor(time / 60);
      const sec = time % 60;
      element.innerText = `${mins}m${sec}`;
    }
  });

  socket.on("player joined", ({ id, state: { position }, team }) => {
    game.playerJoined(id, position, team);
    console.log(id, team);
  });

  socket.on("player left", (id) => {
    game.playerLeft(id);
  });

  socket.on("goal", ({ score, team, scorer }) => {
    console.log(score, team, scorer);

    // update score ui
    setScores(score);

    const goalElement = document.getElementById("goal");

    if (goalElement) {
      goalElement.style.visibility = "visible";

      setTimeout(() => (goalElement.style.visibility = "hidden"), 5000);
    }
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
