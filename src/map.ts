import * as THREE from "three";

export class CustomMap extends THREE.Scene {
  constructor() {
    super();

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(boxGeometry, boxMaterial);
    this.add(cube);

    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    const rotation = new THREE.Vector3(-Math.PI / 2, 0, 0);
    plane.rotation.setFromVector3(rotation);
    this.add(plane);
  }
}
