import * as THREE from "three";

export class Crowd extends THREE.Scene {
  constructor() {
    super();
    let x = -18;
    let z = -25;

    //for loop for each side of the pitch
    for (; x < 18; x += 6) {
      let spectator = new Spectator(x, z);
      spectator.position.x = x + Math.random() * 5;
      spectator.position.z = z;
      this.add(spectator);
    }

    for (; z < 25; z += 6) {
      let spectator = new Spectator(x, z);
      spectator.position.x = x;
      spectator.position.z = z + Math.random() * 5;
      spectator.rotateY(Math.PI / 2);
      this.add(spectator);
    }

    for (; x > -18; x -= 6) {
      let spectator = new Spectator(x, z);
      spectator.position.x = x + Math.random() * 5;
      spectator.position.z = z;
      this.add(spectator);
    }

    for (; z > -25; z -= 6) {
      let spectator = new Spectator(x, z);
      spectator.position.x = x;
      spectator.position.z = z + Math.random() * 5;
      spectator.rotateY(Math.PI / 2);
      this.add(spectator);
    }
  }
}

class Spectator extends THREE.Scene {
  head: THREE.Mesh;
  body: THREE.Mesh;
  constructor(x: number, z: number) {
    super();
    const colours = [
      0x3cac15, 0x9bac15, 0x157fac, 0x6815ac, 0xac157f, 0xac1536,
    ];
    let Colour = colours[Math.floor(Math.random() * 6)];

    //let Colour = Math.random() * 0xfffffff;§

    {
      const geometry = new THREE.BoxGeometry(0.45, 0.45, 0.45);

      const material = new THREE.MeshBasicMaterial({
        color: Colour,
      });
      this.head = new THREE.Mesh(geometry, material);
      this.head.position.y = 4.6;
      this.add(this.head);
    }

    {
      const geometry = new THREE.BoxGeometry(0.95, 1.5, 0.55);
      const material = new THREE.MeshBasicMaterial({ color: Colour });
      this.body = new THREE.Mesh(geometry, material);
      this.body.position.y = 3.35;
      this.add(this.body);

      console.log(this.body.quaternion);
    }
  }
}
