import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import { OrbitControls, Stage, Stats } from "@react-three/drei";
import Cloth from "../src/Cloth";

const Home: NextPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <OrbitControls />
          <Stage
            shadows
            adjustCamera
            intensity={1}
            environment="city"
            preset="rembrandt"
          >
            <Cloth />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
