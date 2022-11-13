const GRAVITY = -10;
const GRASS_E = 0.85;
const SIDE_E = 0.85;
const NET_E = 0.5;

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" }});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const ball = {
  position: { x: 0, y: 4, z: -4 },
  velocity: { x: 0, y: 0, z: 0 },
  acceleration: { x: 0, y: GRAVITY, z: 0 },
};

let goal = false;

// map of the players
const players = {};

function closeEnough(id) {
  return rectangleCollider(
    ball.position,
    players[id].position.x - 2,
    players[id].position.z - 2,
    4,
    4
  );
}

io.on("connection", (socket) => {
  console.log("a user connected");

  const position = { x: 0, y: 0, z: 0};

  const velocity = { x: 0, y: 0, z: 0 };

  const looking = { x: 0, y: 0, z: 0, w: 1 };

  socket.broadcast.emit("player joined", {
    id: socket.id,
    state: { position, velocity, looking },
  });

  const state = { position, velocity, looking, input: new Set() };

  players[socket.id] = state;

  socket.emit("start", { id: socket.id, players });

  socket.on("input down", (input) => {
    // keep track of the input to handle next tick
    players[socket.id].input.add(input);
  });

  socket.on("input up", (input) => {
    // remove the input
    players[socket.id].input.delete(input);
  });
  
  socket.on("set looking", (vector) => {
    players[socket.id].looking = vector;
  })

  socket.on("jump", () => {
    if (players[socket.id].position.y === 0) {
      players[socket.id].velocity.y = 5;
    }
  })

  socket.on("tap", () => {
    if (closeEnough(socket.id)) {
      const direction = { x: 0, y: 0, z: -1 };

      applyQuaternion(
        direction,
        players[socket.id].looking
      );

      direction.y = 0;

      normalise(direction);

      ball.velocity.x += direction.x * 5;
      ball.velocity.y += 2;
      ball.velocity.z += direction.z * 5;
    }
  })

  socket.on("boot", () => {
    if (closeEnough(socket.id)) {
      const direction = { x: 0, y: 0, z: -1 };

      applyQuaternion(
        direction,
        players[socket.id].looking
      );

      normalise(direction);

      console.log(direction);

      console.log(ball.velocity);

      ball.velocity.x += direction.x * 20;
      ball.velocity.y += (direction.y + 0.5) * 20;
      ball.velocity.z += direction.z * 20;
    }
  })

  socket.on("disconnect", () => {
    io.emit("player left", socket.id);

    delete players[socket.id];
  });
});

function length({ x, y, z }) {
  return Math.hypot(x, y, z);
}

function normalise(vector) {
  const magnitude = length(vector);

  if (magnitude !== 0) {
    const scalar = 1 / length(vector);

    vector.x *= scalar;
    vector.y *= scalar;
    vector.z *= scalar;
  }
}

function applyQuaternion(v, q) {
  const ix = q.w * v.x + q.y * v.z - q.z * v.y;
  const iy = q.w * v.y + q.z * v.x - q.x * v.z;
  const iz = q.w * v.z + q.x * v.y - q.y * v.x;
  const iw = - q.x * v.x - q.y * v.y - q.z * v.z;

  v.x = ix * q.w + iw * - q.x + iy * - q.z - iz * - q.y;
  v.y = iy * q.w + iw * - q.y + iz * - q.x - ix * - q.z;
  v.z = iz * q.w + iw * - q.z + ix * - q.y - iy * - q.x;
}

function rectangleCollider(point, x, z, width, height) { //ball tackle zone
  return point.x >= x &&
    point.x <= x + width &&
    point.z >= z &&
    point.z <= z + height
}

function update() {
  Object.entries(players).forEach(([id, { input, looking }]) => {
    const direction = { x: 0, y: 0, z: 0 };

    let speed = 6;
    
    if (input.has("forward")) {
      direction.z -= 1;
    }

    if (input.has("backward")) {
      direction.z += 1;
    }

    if (input.has("right")) {
      direction.x += 1;
    }

    if (input.has("left")) {
      direction.x -= 1;
    }

    if (input.has("sprint") && input.has("forward")) {
      speed = 8;
    }

    applyQuaternion(direction, looking);

    direction.y = 0;

    normalise(direction);

    players[id].velocity.x = direction.x * speed;
    players[id].velocity.y += GRAVITY * 0.016;
    players[id].velocity.z = direction.z * speed;

    players[id].position.x += players[id].velocity.x * 0.016;
    // can't go below zero
    players[id].position.y += players[id].velocity.y * 0.016;
    if (players[id].position.y <= 0) {
      players[id].position.y = 0;
      players[id].velocity.y = 0;
    }
    players[id].position.z += players[id].velocity.z * 0.016;
  });

  ball.acceleration.x = -0.5 * ball.velocity.x;

  ball.acceleration.z = -0.5 * ball.velocity.z;
  //update ball drag/gravity
  ball.velocity.x += ball.acceleration.x * 0.016;
  ball.velocity.y += ball.acceleration.y * 0.016;
  ball.velocity.z += ball.acceleration.z * 0.016;

  const RADIUS = 0.1;

  ball.position.x += ball.velocity.x * 0.016;

  // can't go below zero
  ball.position.y = ball.position.y + ball.velocity.y * 0.016;
  // v = -e*u on ball touch ground
  if (ball.position.y < RADIUS) {
    ball.position.y = RADIUS;
    ball.velocity.y = -GRASS_E * ball.velocity.y;
  }

  ball.position.z += ball.velocity.z * 0.016;

  if (ball.position.z + RADIUS >= 20) {
    if (ball.position.x - RADIUS > -3.75 && ball.position.x + RADIUS < 3.75) {
      if (!goal) {
        goal = true;
        console.log("GOAL!");
      }

      if (ball.position.z - RADIUS >= -1) {
        ball.position.z = 21 - RADIUS;
        ball.velocity.z = -NET_E * ball.velocity.z;
      }

      if (ball.position.x - RADIUS <= -3.75) {
        ball.position.x = -3.75 + RADIUS;
        ball.velocity.x = -NET_E * ball.velocity.x;
      } else if (ball.position.x + RADIUS >= 3.75) {
        ball.position.x = 3.75 + RADIUS;
        ball.velocity.x = -NET_E * ball.velocity.x;
      }
    } else {
      ball.position.z = 20 + RADIUS;
      ball.velocity.z = -SIDE_E * ball.velocity.z;
    }
  } else if (ball.position.z - RADIUS <= -20) {
    if (ball.position.x - RADIUS > -3.75 && ball.position.x + RADIUS < 3.75) {
      if (!goal) {
        goal = true;
        console.log("GOAL!");
      }

      if (ball.position.z - RADIUS <= -21) {
        ball.position.z = -21 + RADIUS;
        ball.velocity.z = -NET_E * ball.velocity.z;
      }

      if (ball.position.x - RADIUS <= -3.75) {
        ball.position.x = -3.75 + RADIUS;
        ball.velocity.x = -NET_E * ball.velocity.x;
      } else if (ball.position.x + RADIUS >= 3.75) {
        ball.position.x = 3.75 + RADIUS;
        ball.velocity.x = -NET_E * ball.velocity.x;
      }
    } else {
      ball.position.z = -20 + RADIUS;
      ball.velocity.z = -SIDE_E * ball.velocity.z;
    }
  } else if (ball.position.x + RADIUS <= -15) {
    ball.position.x = -15 + RADIUS;
    ball.velocity.x = -SIDE_E * ball.velocity.x;
  } else if (ball.position.x - RADIUS >= 15) {
    ball.position.x = 15 - RADIUS;
    ball.velocity.x = -SIDE_E * ball.velocity.x;
  }

  io.emit("tick", players, ball);
}

function tick() {
  update();
}

const interval = setInterval(tick, 16);