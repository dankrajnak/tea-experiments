import type { NextPage } from "next";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import {
  ContactShadows,
  MeshDistortMaterial,
  OrbitControls,
  ScrollControls,
  Stage,
  Stats,
  useScroll,
} from "@react-three/drei";
import { Mesh } from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";

const Home: NextPage = () => {
  const controlsRef = useRef();
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <Stage
            shadows={false}
            castShadow={true}
            adjustCamera
            // ambience={0}
            // intensity={0}
            environment="city"
            preset="rembrandt"
          >
            <OrbitControls
              enablePan
              enableRotate
              enableZoom
              // Below added because they're required attributes for some reason
              addEventListener={undefined}
              hasEventListener={undefined}
              removeEventListener={undefined}
              dispatchEvent={undefined}
            />
            <Physics>
              <Box xOffset={-5} rotation={2} />
              <Box xOffset={0} rotation={0.5} />
              <Box xOffset={5} rotation={1} />
              <Plane />
            </Physics>
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
};

const Plane = (props) => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.1, 0],
    ...props,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
    </mesh>
  );
};

const Box = ({ xOffset, rotation }: { xOffset: number; rotation: number }) => {
  const scroll = useScroll();
  const [meshRef] = useBox(() => ({
    args: [10, 10, 10],
    mass: 1,
    position: [xOffset, Math.random() * 80 + 20, 0],
  }));

  // useFrame(() => {
  //   if (rotation && meshRef.current) {
  //     meshRef.current.rotation.y = scroll.offset * Math.PI * 2 * rotation;
  //   }
  // });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial />
    </mesh>
  );
};

export default Home;
