import * as THREE from "three";
import { Crowd } from "./crowd";
import { Position } from "./game";
import { Goal } from "./goal";
import { Grass } from "./grass";

export class CustomMap extends THREE.Scene {
  grasses: Grass[] = [];

  constructor(position: Position) {
    super();

    const light1 = new THREE.DirectionalLight(0xffffff, 1000); // This adds shadows
    light1.position.set(5, 5, 0);
    this.add(light1);

    const light2 = new THREE.AmbientLight(0x404040, 5); // soft white light
    this.add(light2);

    const planeGeometry = new THREE.PlaneGeometry(40, 50); // Actual pitch is 30x40
    const planeMaterial = new THREE.MeshBasicMaterial({
      color: 0x68ff7f,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    const rotation = new THREE.Vector3(-Math.PI / 2, 0, 0);
    plane.rotation.setFromVector3(rotation);
    this.add(plane);

    const sideAGeometry = new THREE.PlaneGeometry(11.25, 5);
    const sideAMaterial = new THREE.MeshBasicMaterial({
      color: 0x404040,
      side: THREE.DoubleSide,
    });
    const side1a = new THREE.Mesh(sideAGeometry, sideAMaterial);
    const side2a = new THREE.Mesh(sideAGeometry, sideAMaterial);
    side1a.position.z = 20;
    side1a.position.x = -9.375;
    side2a.position.z = -20;
    side2a.position.x = 9.375;
    this.add(side1a);
    this.add(side2a);
    const side1b = new THREE.Mesh(sideAGeometry, sideAMaterial);
    const side2b = new THREE.Mesh(sideAGeometry, sideAMaterial);
    side1b.position.z = 20;
    side1b.position.x = 9.375;
    side2b.position.z = -20;
    side2b.position.x = -9.375;
    this.add(side1b);
    this.add(side2b);

    const sideBGeometry = new THREE.PlaneGeometry(40, 5);
    const sideBMaterial = new THREE.MeshBasicMaterial({
      color: 0x404040,
      side: THREE.DoubleSide,
    });
    const sideBRotation = new THREE.Vector3(0, Math.PI / 2, 0);
    const side3 = new THREE.Mesh(sideBGeometry, sideBMaterial);
    const side4 = new THREE.Mesh(sideBGeometry, sideBMaterial);
    side3.rotation.setFromVector3(sideBRotation);
    side3.position.x = 15;
    side4.rotation.setFromVector3(sideBRotation);
    side4.position.x = -15;
    this.add(side3);
    this.add(side4);

    const goal1 = new Goal();
    goal1.position.z = 20;
    const goal1Rotation = new THREE.Vector3(0, Math.PI, 0);
    goal1.rotation.setFromVector3(goal1Rotation);
    this.add(goal1);

    const goal2 = new Goal();
    goal2.position.z = -20;

    this.add(goal2);

    this.add(new Crowd());

    // GRASS
    const X_SEGMENTS = 20;
    const Z_SEGMENTS = 20;

    const xWidth = 30 / X_SEGMENTS;
    const zWidth = 40 / Z_SEGMENTS;

    const clock = new THREE.Clock();

    for (let x = -13.5; x <= 13.5; x += xWidth) {
      for (let z = -18; z <= 18; z += zWidth) {
        const distance = Math.hypot(position.x - x, position.z - z);
        const density = 10000 / (Math.pow(distance, 2) + 10) + 5;
        console.log(x, z, distance, density);
        const grass = new Grass(xWidth, zWidth, density, clock);
        grass.position.x = x;
        grass.position.z = z;
        this.grasses.push(grass);
        this.add(grass);
      }
    }
  }

  animate = (position: Position) => {
    this.grasses.forEach((grass) => {
      grass.animate(position);
    });
  };
}
