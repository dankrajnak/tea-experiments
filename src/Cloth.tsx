import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { PlaneBufferGeometry } from "three";

const Cloth = () => {
  const timeRef = useRef({ value: 0 });
  const geometryRef = useRef<PlaneBufferGeometry>();
  useFrame((state) => {
    const time = state.clock.elapsedTime / 3;
    if (geometryRef.current) {
      const positions = geometryRef.current.getAttribute("position");
      for (let i = 0; i < positions.count; i++) {
        const newZ =
          2 +
          Math.sin((positions.getX(i) + time) * 3) +
          Math.sin((positions.getY(i) + time) * 2);
        positions.setZ(i, newZ);
      }
      positions.needsUpdate = true;
      // geometryRef.current.computeVertexNormals();
    }
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <meshStandardMaterial
          metalness={0.8}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
        <planeBufferGeometry args={[30, 30, 100, 100]} ref={geometryRef} />
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
