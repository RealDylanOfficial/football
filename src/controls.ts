import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

const MOVEMENT_SPEED = 5;

export class CustomControls extends PointerLockControls {
  input = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  constructor(camera: THREE.PerspectiveCamera, element: HTMLElement) {
    super(camera, document.body);

    element.addEventListener("click", () => {
      this.lock();
    });

    document.body.addEventListener("keydown", this.onKeyDown);

    document.body.addEventListener("keyup", this.onKeyUp);
  }

  onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.input.forward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        this.input.left = true;
        break;

      case "ArrowDown":
      case "KeyS":
        this.input.backward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        this.input.right = true;
        break;

      // case 'Space':
      //   if ( canJump === true ) velocity.y += 350;
      //   canJump = false;
      //   break;
    }
  };

  onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.input.forward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        this.input.left = false;
        break;

      case "ArrowDown":
      case "KeyS":
        this.input.backward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        this.input.right = false;
        break;
    }
  };

  update = (delta: number) => {
    const velocity = new THREE.Vector3(
      Number(this.input.right) - Number(this.input.left),
      0,
      Number(this.input.forward) - Number(this.input.backward)
    );

    velocity.normalize();

    velocity.multiplyScalar(MOVEMENT_SPEED * delta);

    this.moveRight(velocity.x);
    this.moveForward(velocity.z);
  };
}
