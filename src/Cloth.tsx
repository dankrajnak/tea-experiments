import * as THREE from "three";
import fragmentShader from "./shaders/cloth/fragment.glsl";
import vertexShader from "./shaders/cloth/vertex.glsl";

const Cloth = () => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <shaderMaterial
        side={THREE.DoubleSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
      <planeGeometry />
    </mesh>
  );
};

export default Cloth;
