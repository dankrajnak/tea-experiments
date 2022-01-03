import { OrbitControls, Reflector, Stats } from "@react-three/drei";
import Head from "next/head";
import { Canvas } from "@react-three/fiber";
import type { NextPage } from "next";
import React, { Suspense } from "react";
import * as THREE from "three";
import Cloth from "../src/Cloth";
import {
  Bloom,
  EffectComposer,
  SSAO,
  Vignette,
} from "@react-three/postprocessing";
import { useControls } from "leva";

const origin = new THREE.Vector3(0, 0, 0);

const Home: NextPage = () => {
  return (
    <div style={{ height: "100vh" }}>
      <Head>
        <title>Tea Experiments</title>
      </Head>
      <Canvas shadows camera={{ position: [200, 80, 200] }}>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <Inner />
        </Suspense>
      </Canvas>
    </div>
  );
};

const Inner = () => {
  const { useEffects } = useControls({ useEffects: true });
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
      {useEffects && (
        <EffectComposer>
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={500} />
          <Vignette eskil={false} offset={0.4} darkness={1.1} />
          <SSAO />
        </EffectComposer>
      )}
      <Suspense fallback={null}>
        <Cloth />
        <Reflector
          position={[0, -5, 0]}
          args={[500, 500, 4]} // PlaneBufferGeometry arguments
          resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality
          mirror={0.6} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          mixBlur={0} // How much blur mixes with surface roughness (default = 0), note that this can affect performance
          mixStrength={1} // Strength of the reflections
          depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
          rotation={[-Math.PI / 2, 0, 0]}
          debug={0}
        >
          {(Material, props) => <Material {...props} />}
        </Reflector>
        <mesh position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[2000, 2000, 4]} />
          <meshBasicMaterial color="black" />
        </mesh>
        {/* <Stars
          radius={200} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={8} // Size factor (default=4)
          fade // Faded dots (default=false)
        /> */}
      </Suspense>
    </>
  );
};
export default Home;
