import type { NextPage } from "next";
import { Canvas, useThree } from "@react-three/fiber";
import React, { Suspense, useRef, useState, useLayoutEffect } from "react";
import { OrbitControls, Stars, Stats, useHelper } from "@react-three/drei";
import Cloth from "../src/Cloth";
import * as THREE from "three";
import { PointLightHelper } from "three";

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
  const pointLightRef = useRef();
  const bluePointLightRef = useRef();
  const greenPointLightRef = useRef();
  useHelper(pointLightRef, PointLightHelper);
  useHelper(bluePointLightRef, PointLightHelper);
  // useHelper(greenPointLightRef, PointLightHelper);
  const [s, damn] = useState(0);
  useLayoutEffect(() => {
    setTimeout(() => {
      damn(1);
    }, 30);
  }, []);
  return (
    <>
      <OrbitControls
        minDistance={10}
        maxDistance={200}
        autoRotate
        // enableZoom={false}
        // enablePan={false}
        // maxPolarAngle={Math.PI / 2.5}
        // minPolarAngle={Math.PI / 4}
      />
      <Suspense fallback={null}>
        <Cloth />
        <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        />
      </Suspense>
    </>
  );
};
export default Home;
