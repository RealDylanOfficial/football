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

  // constructor() {
  //   super();

  //   let geometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 32);
  //   const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  //   for (let X = -2; X < 3; X += 4) {
  //     const cylinder = new THREE.Mesh(geometry, material);
  //     cylinder.position.x = X;
  //     cylinder.position.z = 0;
  //     cylinder.position.y = -0.5;
  //     this.add(cylinder);
  //   }
  //   geometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 32);
  //   const cylinder = new THREE.Mesh(geometry, material);
  //   const rotation = new THREE.Vector3(0, 0, Math.PI / 2);
  //   cylinder.rotation.setFromVector3(rotation);
  //   //cylinder.position.x = 0;
  //   //cylinder.position.z = 0;
  //   cylinder.position.y = 0.92;
  //   this.add(cylinder);
}
