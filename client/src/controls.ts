import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
export class CustomControls extends PointerLockControls {
  constructor(camera: THREE.PerspectiveCamera, element: HTMLElement) {
    super(camera, element);
  }
}
