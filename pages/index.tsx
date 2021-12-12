import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import {
  OrbitControls,
  Stage,
  Stars,
  Stats,
  useHelper,
} from "@react-three/drei";
import Cloth from "../src/Cloth";
import * as THREE from "three";
import { PointLightHelper } from "three";

const origin = new THREE.Vector3(0, 0, 0);

const Home: NextPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <Inner />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Inner = () => {
  const pointLightRef = useRef();
  const bluePointLightRef = useRef();
  const greenPointLightRef = useRef();
  useHelper(pointLightRef, PointLightHelper);
  useHelper(bluePointLightRef, PointLightHelper);
  useHelper(greenPointLightRef, PointLightHelper);
  return (
    <>
      <OrbitControls
        minDistance={30}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.5}
        minPolarAngle={Math.PI / 4}
      />
      <Suspense fallback={null}>
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
          <planeGeometry args={[2000, 2000, 4]} />
          <meshBasicMaterial color="black" />
        </mesh>

        <pointLight
          position={[0, 5, 0]}
          color="red"
          ref={pointLightRef}
          intensity={5}
        />
        <pointLight
          position={[0, -5, 0]}
          color="blue"
          ref={bluePointLightRef}
          intensity={5}
        />

        <Cloth />
      </Suspense>
    </>
  );
};
export default Home;
