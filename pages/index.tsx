import type { NextPage } from "next";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import {
  Cloud,
  OrbitControls,
  Reflector,
  Stage,
  Stars,
  Stats,
  useGLTF,
  useHelper,
} from "@react-three/drei";
import Cloth from "../src/Cloth";
import * as THREE from "three";
import { MeshStandardMaterial, PointLightHelper, SpotLightHelper } from "three";
import { softShadows } from "@react-three/drei";

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
  useHelper(pointLightRef, SpotLightHelper);
  useHelper(bluePointLightRef, PointLightHelper);
  useHelper(greenPointLightRef, PointLightHelper);

  const gltf = useGLTF("concrete_floor_02_1k.gltf");
  console.log(gltf);
  const concreteMaterial = gltf.materials
    .concrete_floor_02 as MeshStandardMaterial;
  concreteMaterial.map.repeat = new THREE.Vector2(8, 8);

  return (
    <>
      <OrbitControls
      // minDistance={30}
      // enableZoom={false}
      // enablePan={false}
      // maxPolarAngle={Math.PI / 2.5}
      // minPolarAngle={Math.PI / 4}
      />
      <Suspense fallback={null}>
        <Cloth />
        {/* <Stars
          radius={100} // Radius of the inner sphere (default=100)
          depth={50} // Depth of area where stars should fit (default=50)
          count={5000} // Amount of stars (default=5000)
          factor={4} // Size factor (default=4)
          saturation={0} // Saturation 0-1 (default=0)
          fade // Faded dots (default=false)
        /> */}

        {/* <Reflector
          args={[2000, 2000, 4]} // PlaneBufferGeometry arguments
          resolution={512} // Off-buffer resolution, lower=faster, higher=better quality
          mirror={0.6} // Mirror environment, 0 = texture colors, 1 = pick up env colors
          mixBlur={0} // How much blur mixes with surface roughness (default = 0), note that this can affect performance
          mixStrength={1} // Strength of the reflections
          depthScale={2} // Scale the depth factor (0 = no depth, default = 0)
          rotation={[-Math.PI / 2, 0, 0]}
          debug={0}
        >
          {(Material, props) => <Material {...props} />}
        </Reflector> */}
        <mesh
          material={concreteMaterial}
          rotation={[-Math.PI / 2, 0, 0]}
          receiveShadow
        >
          <planeGeometry args={[200, 200]} />
        </mesh>

        <spotLight
          position={[0, 40, 0]}
          color="white"
          ref={pointLightRef}
          // intensity={0.2}
          castShadow
        />
      </Suspense>
    </>
  );
};
export default Home;
