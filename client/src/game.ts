import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { Ball } from "./ball";
import { Quaternion } from "./main";
import { CustomMap } from "./map";
import { Player } from "./player";

export type Position = { x: number; y: number; z: number };

export type Players = {
  [key: string]: { position: Position; looking: Quaternion; team: number };
};

/**
 * Runs the game with the given map
 */
export class Game {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ alpha: true });

  camera: THREE.PerspectiveCamera;
  controls: PointerLockControls;
  ball = new Ball();

  id: string;
  players: Players;

  map: CustomMap;

  collidableMeshList = [];

  playerObjects: { [key: string]: Player } = {};

  ballAttached = false;

  constructor(
    id: string,
    players: Players,
    setRotation: (rotation: Quaternion) => void
  ) {
    this.id = id;
    this.players = players;

    Object.entries(players).forEach(([id, { position, team }]) => {
      this.playerJoined(id, position, team);
    });

    this.map = new CustomMap({ x: 0, y: 0, z: 0 });

    this.camera = new THREE.PerspectiveCamera(
      103,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.y = 2;

    this.controls = new PointerLockControls(this.camera, document.body);

    this.renderer.setClearColor(0x000000, 0); // the default
    this.renderer.domElement.addEventListener("click", () => {
      this.controls.lock();
    });

    this.renderer.setPixelRatio(devicePixelRatio);

    this.controls.addEventListener("change", () => {
      setRotation({
        x: this.camera.quaternion.x,
        y: this.camera.quaternion.y,
        z: this.camera.quaternion.z,
        w: this.camera.quaternion.w,
      });
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    const loader = new THREE.TextureLoader();

    const texture = loader.load("sky_image.jpeg", () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(this.renderer, texture);
      this.scene.background = rt.texture;
    });

    this.scene.add(this.map);

    this.ball.position.set(0, 2, 0);
    this.scene.add(this.ball);

    this.camera.position.z = 5;
    this.camera.position.y += Math.sin(1 * 10) * 1.5; //attempt to head bob
    this.animate();
  }

  playerJoined = (id: string, { x, y, z }: Position, team: number) => {
    console.log(id, x, y, z);

    if (id !== this.id) {
      const player = new Player(team);
      player.position.set(x, y, z);
      this.scene.add(player);

      console.log(id, player);

      this.playerObjects[id] = player;
    }
  };

  playerLeft = (id: string) => {
    this.scene.remove(this.playerObjects[id]);

    delete this.playerObjects[id];
  };

  tick = (
    players: Players,
    ball: {
      position: Position;
      attached: null | { id: string; offset: Position };
    }
  ) => {
    Object.entries(players).forEach(([id, { position, looking }]) => {
      const euler = new THREE.Quaternion(
        looking.x,
        looking.y,
        looking.z,
        looking.w
      );
      if (id === this.id) {
        this.camera.position.set(position.x, position.y + 2, position.z);
      } else {
        this.playerObjects[id].position.set(position.x, position.y, position.z);
        this.playerObjects[id].rotation.y = euler.y;
        this.playerObjects[id].head.rotation.z = euler.z;
      }
    });

    this.ball.position.set(ball.position.x, ball.position.y, ball.position.z);
  };

  animate = () => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.map.animate(this.players[this.id].position);

    // this.controls.update(delta);

    this.renderer.render(this.scene, this.camera);
  };
}
