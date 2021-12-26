import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Mesh,
  PlaneBufferGeometry,
  PointLight,
  ShaderMaterial,
  TextureLoader,
} from "three";
import { SubsurfaceScatteringShader } from "three/examples/jsm/shaders/SubsurfaceScatteringShader";
import { useControls } from "leva";
import { useFBX } from "@react-three/drei";

const uniforms = THREE.UniformsUtils.clone(SubsurfaceScatteringShader.uniforms);
uniforms["diffuse"].value = new THREE.Vector3(0.2, 0.2, 0.2);
uniforms["shininess"].value = 800;

uniforms["thicknessColor"].value = new THREE.Vector3(0.5, 0.3, 0.0);
uniforms["thicknessDistortion"].value = 0.8;
uniforms["thicknessAmbient"].value = 0.2;
uniforms["thicknessAttenuation"].value = 0.8;
uniforms["thicknessPower"].value = 2.0;
uniforms["thicknessScale"].value = 16.0;

const controls: {
  property: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
}[] = [
  {
    name: "distortion",
    property: "thicknessDistortion",
    min: 0,
    max: 10,
    step: 0.1,
  },
  { name: "ambient", property: "thicknessAmbient" },
  { name: "attenuation", property: "thicknessAttenuation" },
  { name: "power", property: "thicknessPower" },
  { name: "scale", property: "thicknessScale" },
];

const controlsWithControls: Parameters<typeof useControls>[0] = controls.reduce(
  (sum, control) => ({
    ...sum,
    [control.name]: {
      value: uniforms[control.property].value,
      min: control.min ?? 0,
      max: control.max ?? 50,
      step: control.step ?? 0.1,
      onChange: (v: number) => (uniforms[control.property].value = v),
    },
  }),
  {}
);

const Cloth = () => {
  const geometryRef = useRef<PlaneBufferGeometry>();

  const whiteTexture = useLoader(TextureLoader, "textures/white.jpg");
  whiteTexture.wrapS = THREE.RepeatWrapping;
  whiteTexture.wrapT = THREE.RepeatWrapping;

  const thicknessTexture = useLoader(
    TextureLoader,
    "textures/bunny_thickness.jpg"
  );
  const model = useFBX("stanford-bunny.fbx");
  useControls(controlsWithControls);

  uniforms.map.value = whiteTexture;
  uniforms.thicknessMap.value = thicknessTexture;

  const boxRef = useRef<Mesh>();

  const pointLightRef = useRef<PointLight>();

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime / 3;
    boxRef.current?.setRotationFromEuler(
      new THREE.Euler(elapsedTime, elapsedTime, elapsedTime)
    );
    if (materialRef.current) {
      materialRef.current.uniformsNeedUpdate = true;
    }
    if (pointLightRef.current) {
      pointLightRef.current.position.x = Math.sin(elapsedTime) * 400;
      pointLightRef.current.position.y = -30;
    }
  });

  const materialRef = useRef<ShaderMaterial>();
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.extensions.derivatives = true;
    }
  }, []);
  const { bunnyScale } = useControls({
    bunnyScale: { value: 1, min: 0, max: 1, step: 0.01 },
  });

  return (
    <>
      <primitive
        object={model.children[0]}
        position={[0, 0, 10]}
        scale={[bunnyScale, bunnyScale, bunnyScale]}
        visible
      >
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={SubsurfaceScatteringShader.vertexShader}
          fragmentShader={SubsurfaceScatteringShader.fragmentShader}
          lights
          ref={materialRef}
        />
      </primitive>

      <pointLight args={["blue", 7.0, 300]} position={[0, -50, 350]} />
      <mesh position={[0, -50, 350]}>
        <sphereBufferGeometry args={[4, 8, 8]} />
        <meshBasicMaterial color="blue" />
      </mesh>

      <pointLight args={["blue", 1.0, 500]} position={[-100, 20, -260]} />
      <mesh position={[-100, 20, -260]}>
        <sphereBufferGeometry args={[4, 8, 8]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>

      <pointLight args={["red", 1, 800]} ref={pointLightRef} />

      <lineSegments position={[0, 6.5, 0]}>
        <edgesGeometry
          args={[new THREE.BoxGeometry(350, 350, 350)]}
        ></edgesGeometry>
        <lineBasicMaterial color="white" />
      </lineSegments>
    </>
  );
};

export default Cloth;
