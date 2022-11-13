import * as THREE from "three";

export class Player extends THREE.Scene {
  head: THREE.Mesh;
  body: THREE.Mesh;

  constructor() {
    super();

    {
      const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);
      const material = new THREE.MeshBasicMaterial({ color: 0xff00000 });
      this.head = new THREE.Mesh(geometry, material);
      this.head.position.y = 2;
      this.add(this.head);
    }

    {
      const geometry = new THREE.BoxGeometry(0.95, 1.5, 0.55);
      const material = new THREE.MeshBasicMaterial({ color: 0xff00000 });
      this.body = new THREE.Mesh(geometry, material);
      this.body.position.y = 0.75;
      this.add(this.body);

      console.log(this.body.quaternion);
    }
  }
}
