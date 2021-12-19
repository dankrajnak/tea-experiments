import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PlaneBufferGeometry } from "three";
import SimplexNoise from "simplex-noise";

const Cloth = () => {
  const geometryRef = useRef<PlaneBufferGeometry>();
  useFrame((state) => {
    const time = state.clock.elapsedTime / 3;
    if (geometryRef.current) {
      const positions = geometryRef.current.getAttribute("position");

      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const newZ = 2 + Math.sin((x + time) * 3) + Math.sin((y + time) * 2);
        positions.setZ(i, newZ);
      }
      positions.needsUpdate = true;
      // geometryRef.current.computeVertexNormals();
    }
  });
  return (
    <>
      <mesh
        rotation={[-Math.PI / 1.9, 0, 0]}
        position={[0.1, 2, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          shadowSide={THREE.DoubleSide}
          // metalness={0.8}
          // transparent
          // opacity={1}
          // side={THREE.DoubleSide}
        />
        <planeGeometry args={[15, 15, 30, 30]} />
      </mesh>

      <mesh
        rotation={[-Math.PI / 1.8, 0, 0]}
        position={[0, 1, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          shadowSide={THREE.FrontSide}
          // metalness={0.8}
          // transparent
          // opacity={1}
          // side={THREE.DoubleSide}
        />
        <planeGeometry args={[30, 30, 30, 30]} />
      </mesh>
      {/* <lineSegments position={[0, 6.5, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(30, 15, 30)]}
        ></edgesGeometry>
        <lineBasicMaterial color="white" />
      </lineSegments> */}
    </>
  );
};

export default Cloth;
