import * as THREE from "three";
import { CustomControls } from "./controls";

/**
 * Runs the game with the given map
 */
export class Game {
  clock = new THREE.Clock();
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer();
  camera: THREE.PerspectiveCamera;
  controls: CustomControls;

  constructor(map: THREE.Scene) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.controls = new CustomControls(this.camera, this.renderer.domElement);

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.add(map);

    this.camera.position.z = 5;

    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    this.controls.update(delta);

    this.renderer.render(this.scene, this.camera);
  };
}
