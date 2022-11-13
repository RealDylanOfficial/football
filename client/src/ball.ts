import * as THREE from "three";
export class Ball extends THREE.Scene {
  constructor() {
    super();

    var loader = new THREE.TextureLoader();
    loader.load("football.jpeg", (texture) => {
      var geometry = new THREE.SphereGeometry(0.2, 16, 16);

      var material = new THREE.MeshBasicMaterial({
        map: texture,
        //   overdraw: 0.5,
      });
      var sphere = new THREE.Mesh(geometry, material);
      this.add(sphere);
    });
  }
}
