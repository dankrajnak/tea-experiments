import type { NextPage } from "next";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import {
  OrbitControls,
  ScrollControls,
  Stats,
  useScroll,
} from "@react-three/drei";
import { Mesh } from "three";

const Home: NextPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <Stats
          showPanel={0} // Start-up panel (default=0)
        />

        <OrbitControls
          enablePan
          enableRotate
          enableZoom={false}
          // Below added because they're required attributes for some reason
          addEventListener={undefined}
          hasEventListener={undefined}
          removeEventListener={undefined}
          dispatchEvent={undefined}
        />
        <ScrollControls pages={5}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[1, 0, 5]} color="blue" intensity={0.2} />
          <directionalLight
            position={[-2, 0, -5]}
            color="red"
            intensity={0.2}
          />
          <Box xOffset={-4} rotation={2} />
          <Box xOffset={0} rotation={0.5} />
          <Box xOffset={4} rotation={1} />
        </ScrollControls>
      </Canvas>
    </div>
  );
};

const Box = ({ xOffset, rotation }: { xOffset: number; rotation: number }) => {
  const scroll = useScroll();
  const meshRef = useRef<Mesh>();
  useFrame(() => {
    if (rotation && meshRef.current) {
      meshRef.current.rotation.y = scroll.offset * Math.PI * 2 * rotation;
    }
  });
  console.log(scroll.offset);
  return (
    <mesh ref={meshRef} position={[xOffset, 0, 0]}>
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshStandardMaterial metalness={0.8} />
    </mesh>
  );
};

export default Home;
