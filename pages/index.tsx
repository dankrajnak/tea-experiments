import type { NextPage } from "next";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import { OrbitControls, Stage, Stats } from "@react-three/drei";
import { Mesh } from "three";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import Cloth, { Ball } from "../src/Cloth";

const Home: NextPage = () => {
  const cloth = useRef();

  useLayoutEffect(() => {
    function handleMouseMove(event) {
      console.log("mouseMove");
      let x = (event.clientX - window.innerWidth / 2) / window.innerWidth;
      let y = -(event.clientY - window.innerHeight / 2) / window.innerHeight;
      cloth.current?.setPosition(x * 6, y * 6, 0);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Canvas dpr={[1, 2]}>
        <Stats showPanel={0} />
        <Suspense fallback={null}>
          <Stage
            shadows
            adjustCamera
            intensity={1}
            environment="city"
            preset="rembrandt"
          >
            {/* <Physics iterations={10} gravity={[0, -20, 0]}>
              <Cloth
                ref={cloth}
                width={4}
                height={4}
                resolutionX={16}
                resolutionY={16}
              />
              <Ball />
            </Physics> */}
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Home;
