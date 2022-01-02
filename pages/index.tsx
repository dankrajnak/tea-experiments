import {
  MeshReflectorMaterial,
  OrbitControls,
  Reflector,
  Stars,
  Stats,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import React, { Suspense } from "react";
import * as THREE from "three";
import Cloth from "../src/Cloth";

const origin = new THREE.Vector3(0, 0, 0);

const Home: NextPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas shadows>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <Inner />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Inner = () => {
  return (
    <>
      <OrbitControls
        minDistance={10}
        autoRotate
        // enableZoom={false}
        enablePan={false}
        maxPolarAngle={(Math.PI / 2) * 0.95}
        // minPolarAngle={Math.PI / 4}
      />
      <Suspense fallback={null}>
        <Cloth />
        <Reflector
          position={[0, 1, 0]}
          args={[500, 500, 4]} // PlaneBufferGeometry arguments
          resolution={512} // Off-buffer resolution, lower=faster, higher=better quality
          mirror={0.6} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          mixBlur={0} // How much blur mixes with surface roughness (default = 0), note that this can affect performance
          mixStrength={1} // Strength of the reflections
          depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
          rotation={[-Math.PI / 2, 0, 0]}
          debug={0}
        >
          {(Material, props) => <Material {...props} />}
        </Reflector>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[2000, 2000, 4]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </Suspense>
    </>
  );
};
export default Home;
