import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  BufferAttribute,
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

uniforms["thicknessColor"].value = new THREE.Vector3(0.5, 0.3, 0.0);
uniforms["thicknessDistortion"].value = 0.76;
uniforms["thicknessAmbient"].value = 0.06;
uniforms["thicknessAttenuation"].value = 0.97;
uniforms["thicknessPower"].value = 3.1;
uniforms["thicknessScale"].value = 10.6;
uniforms["shininess"].value = 15;

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
    max: 1,
    step: 0.01,
  },
  { name: "ambient", property: "thicknessAmbient", min: 0, max: 3, step: 0.01 },
  {
    name: "attenuation",
    property: "thicknessAttenuation",
    min: 0,
    max: 3,
    step: 0.01,
  },
  { name: "power", property: "thicknessPower", min: 0, max: 20, step: 0.1 },
  { name: "scale", property: "thicknessScale", min: 0, max: 20, step: 0.1 },
  { name: "shininess", property: "shininess", min: 0, max: 400, step: 5 },
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
    "textures/concrete_floor_02_diff_1k.jpg"
  );
  useControls("shader controls", controlsWithControls);

  uniforms.map.value = whiteTexture;
  uniforms.thicknessMap.value = whiteTexture;

  const pointLightRef = useRef<PointLight>();

  const { amplitude, speed, frequencyX, frequencyY, bunnyScale } = useControls({
    amplitude: { value: 10, min: 0, max: 20 },
    speed: 8,
    frequencyX: { value: 1.16, min: 1, max: 5 },
    frequencyY: { value: 1.24, min: 1, max: 5 },
    bunnyScale: { value: 163, min: 50, max: 350, step: 1 },
  });

  const { interiorLightColor, externalLightColor } = useControls("lights", {
    interiorLightColor: { r: 255, g: 0, b: 0 },
    externalLightColor: { r: 0, g: 0, b: 255 },
  });

  const { computeVertexNormals } = useControls({ computeVertexNormals: false });

  useFrame((state) => {
    const time = state.clock.elapsedTime * speed;
    if (geometryRef.current) {
      const positions = geometryRef.current.getAttribute(
        "position"
      ) as BufferAttribute;

      positions.usage = THREE.DynamicDrawUsage;

      const scalingFactor = (2 * Math.PI) / bunnyScale;
      for (let i = 0; i < positions.count; i++) {
        const newZ =
          amplitude *
          (Math.sin((positions.getX(i) + time) * scalingFactor * frequencyX) +
            Math.sin((positions.getY(i) + time) * scalingFactor * frequencyY));

        positions.setZ(i, newZ);
      }
      positions.needsUpdate = true;
      if (computeVertexNormals) {
        geometryRef.current.computeVertexNormals();
        geometryRef.current.getAttribute("normal").needsUpdate = true;
      }
    }
  });

  const materialRef = useRef<ShaderMaterial>();
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.extensions.derivatives = true;
    }
  }, []);

  return (
    <>
      <mesh>
        <planeBufferGeometry
          args={[bunnyScale, bunnyScale, bunnyScale, bunnyScale]}
          ref={geometryRef}
        />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={SubsurfaceScatteringShader.vertexShader}
          fragmentShader={SubsurfaceScatteringShader.fragmentShader}
          lights
          ref={materialRef}
        />
      </mesh>

      <pointLight
        color={[
          externalLightColor.r / 256,
          externalLightColor.g / 256,
          externalLightColor.b / 256,
        ]}
        intensity={2}
        distance={300}
        position={[0, -50, 250]}
      >
        <mesh>
          <sphereBufferGeometry args={[4, 8, 8]} />
          <meshBasicMaterial
            color={[
              externalLightColor.r / 256,
              externalLightColor.g / 256,
              externalLightColor.b / 256,
            ]}
          />
        </mesh>
      </pointLight>

      <pointLight
        color={[
          interiorLightColor.r / 256,
          interiorLightColor.g / 256,
          interiorLightColor.b / 256,
        ]}
        intensity={0.5}
        distance={800}
        ref={pointLightRef}
        position={[0, 0, -50]}
      >
        <mesh>
          <sphereBufferGeometry args={[4, 8, 8]} />
          <meshBasicMaterial
            color={[
              interiorLightColor.r / 256,
              interiorLightColor.g / 256,
              interiorLightColor.b / 256,
            ]}
          />
        </mesh>
      </pointLight>

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
