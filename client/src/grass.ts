import * as THREE from "three";
import { Position } from "./game";
//import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Grass extends THREE.Scene {
  leavesMaterial: THREE.ShaderMaterial;
  instancedMesh: THREE.InstancedMesh | undefined;

  clock: THREE.Clock;

  width: number;
  height: number;

  constructor(
    width: number,
    height: number,
    density: number,
    clock: THREE.Clock
  ) {
    super();

    this.clock = clock;

    this.width = width;
    this.height = height;

    ////////////
    // MATERIAL
    ////////////

    const vertexShader = `
      varying vec2 vUv;
      uniform float time;
      
        void main() {
    
        vUv = uv;
        
        // VERTEX POSITION
        
        vec4 mvPosition = vec4( position, 1.0 );
        #ifdef USE_INSTANCING
            mvPosition = instanceMatrix * mvPosition;
        #endif
        
        // DISPLACEMENT
        
        // here the displacement is made stronger on the blades tips.
        float dispPower = 1.0 - cos( uv.y * 3.1416 / 3.5 );
        
        float displacementz = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
        mvPosition.z += displacementz;
        
        // float displacementx = sin( mvPosition.x + time * 10.0 ) * ( 0.1 * dispPower );
        // mvPosition.z += displacementx;
        
        vec4 modelViewPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * modelViewPosition;
    
        }
    `;

    const fragmentShader = `
      varying vec2 vUv;
      
      void main() {
          vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
        float clarity = ( vUv.y * 0.5 ) + 0.5;
        gl_FragColor = vec4( baseColor * clarity, 1 );
      }
    `;

    const uniforms = {
      time: {
        value: 0,
      },
    };

    this.leavesMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    this.updateDensity(density);
  }

  updateDensity = (density: number) => {
    if (this.instancedMesh) {
      this.instancedMesh.removeFromParent();
    }

    /////////
    // MESH
    /////////

    const dummy = new THREE.Object3D();

    const geometry = new THREE.PlaneGeometry(0.1, 1, 1, 4);
    geometry.translate(0, 0.5, 0); // move grass blade geometry lowest point at 0.

    let n = this.width * this.height * density;

    this.instancedMesh = new THREE.InstancedMesh(
      geometry,
      this.leavesMaterial,
      n
    );

    this.add(this.instancedMesh);

    // Position and scale the grass blade instances randomly.
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * this.width;
      const z = (Math.random() - 0.5) * this.height;
      dummy.position.set(x, 0, z + 100);

      dummy.scale.setScalar((0.5 + Math.random() * 0.5) * 0.2);

      dummy.rotation.y = Math.random() * Math.PI;

      dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, dummy.matrix);
    }
  };

  animate = (position: Position) => {
    this.leavesMaterial.uniforms.time.value = this.clock.getElapsedTime() * 0.1;
    this.leavesMaterial.uniformsNeedUpdate = true;
  };
}
