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

    const light2 = new THREE.AmbientLight(0x404040, 3); // soft white light
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

    const sideAGeometry = new THREE.PlaneGeometry(11.25, 2.5);
    const redMaterial = new THREE.MeshBasicMaterial({
      color: 0xff00000,
      side: THREE.DoubleSide,
    });
    const blueMaterial = new THREE.MeshBasicMaterial({
      color: 0x0000ff,
      side: THREE.DoubleSide,
    });
    const side1a = new THREE.Mesh(sideAGeometry, redMaterial);
    const side2a = new THREE.Mesh(sideAGeometry, blueMaterial);
    side1a.position.z = 20;
    side1a.position.x = -9.375;
    side2a.position.z = -20;
    side2a.position.x = 9.375;
    this.add(side1a);
    this.add(side2a);
    const side1b = new THREE.Mesh(sideAGeometry, redMaterial);
    const side2b = new THREE.Mesh(sideAGeometry, blueMaterial);
    side1b.position.z = 20;
    side1b.position.x = 9.375;
    side2b.position.z = -20;
    side2b.position.x = -9.375;
    this.add(side1b);
    this.add(side2b);

    const sideBGeometry = new THREE.PlaneGeometry(40, 2.5);
    const sideBMaterial = new THREE.MeshBasicMaterial({
      color: 0x606060,
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
    const side5 = new THREE.Mesh(sideBGeometry, redMaterial);
    const side6 = new THREE.Mesh(sideBGeometry, blueMaterial);
    side5.rotation.setFromVector3(sideBRotation);
    side5.position.x = 15;
    side6.rotation.setFromVector3(sideBRotation);
    side6.position.x = -15;
    this.add(side5);
    this.add(side6);

    const goal1 = new Goal();
    goal1.position.z = 20;
    const goal1Rotation = new THREE.Vector3(0, Math.PI, 0);
    goal1.rotation.setFromVector3(goal1Rotation);
    this.add(goal1);

    const goal2 = new Goal();
    goal2.position.z = -20;

    this.add(goal2);

    var loader = new THREE.TextureLoader();
    loader.load("PITCH.png", (texture) => {
      var geometry = new THREE.PlaneGeometry(30, 40);

      var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: texture,
        transparent: true,
      });
      var lines = new THREE.Mesh(geometry, material);
      lines.rotation.setFromVector3(rotation);
      lines.position.y = 0.05;
      this.add(lines);
    });

    this.add(new Crowd());

    // GRASS
    const X_SEGMENTS = 20;
    const Z_SEGMENTS = 20;

    const xWidth = 30 / X_SEGMENTS;
    const zWidth = 40 / Z_SEGMENTS;

    const clock = new THREE.Clock();

    for (let x = -15 + xWidth / 2; x <= 15 - xWidth / 2; x += xWidth) {
      for (let z = -22 + zWidth / 2; z <= 22 - zWidth / 2; z += zWidth) {
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
