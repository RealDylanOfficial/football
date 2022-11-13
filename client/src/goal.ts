import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
export class Goal extends THREE.Scene {
  constructor() {
    super();

    const loader = new GLTFLoader();

    loader.load("football_goal_rework/scene.gltf", (gltf) => {
      this.add(gltf.scene);

      gltf.animations; // Array<THREE.AnimationClip>
      gltf.scene; // THREE.Group
      gltf.scenes; // Array<THREE.Group>
      gltf.cameras; // Array<THREE.Camera>
      gltf.asset; // Object
    });
    //goal boundary dimensions check
    // const geometry = new THREE.BoxGeometry(7.5, 5.8, 5);
    // const material = new THREE.MeshBasicMaterial({ color: 0xff00000 });
    // const mesh = new THREE.Mesh(geometry, material);
    // this.add(mesh);
  }
}
