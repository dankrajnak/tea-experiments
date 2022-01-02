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
import SimplexNoise from "simplex-noise";

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

type Morpher = {
  morph: (args: {
    x: number;
    y: number;
    noiseFactor: number;
    amplitude: number;
    noiseMaker: (x: number, y: number) => number;
  }) => number;
  min: number;
  max: number;
  speed: number;
};

const morphers: Morpher[] = [
  {
    morph: ({ x, y, noiseFactor, amplitude, noiseMaker }) =>
      noiseMaker(x / noiseFactor, y / noiseFactor) * amplitude,
    min: 0.2,
    max: 0.4,
    speed: 1,
  },
  {
    morph: ({ x, y, noiseFactor, noiseMaker }) =>
      noiseMaker(x / noiseFactor, (3 * y) / noiseFactor),
    min: 0.5,
    max: 1,
    speed: 0.2,
  },
  {
    morph: ({ x, y, noiseFactor, amplitude, noiseMaker }) =>
      noiseMaker(x / noiseFactor / 4, y / noiseFactor / 4) * amplitude,
    min: 0.2,
    max: 1,
    speed: 0.5,
  },
  {
    morph: ({ x, y, noiseFactor, amplitude, noiseMaker }) =>
      noiseMaker(x / noiseFactor / 4, y / noiseFactor / 4) * amplitude,
    min: 0.5,
    max: 2,
    speed: 0.1,
  },
];

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

  const { amplitude, noiseFactor, bunnyScale } = useControls({
    amplitude: { value: 20, min: 0, max: 50 },
    noiseFactor: { value: 42, min: 1, max: 200 },
    bunnyScale: { value: 300, min: 50, max: 1000, step: 1 },
  });

  // const morphAmounts = useControls(
  //   morphers.reduce(
  //     (sum, _, i) => ({
  //       ...sum,
  //       [`morphAmount${i + 1}`]: { value: 0, min: 0, max: 2, step: 0.01 },
  //     }),
  //     {}
  //   ) as Record<string, { value: number }>
  // );

  const morphAmounts = useRef(morphers.map((_) => 0));
  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    morphers.forEach((morpher, i) => {
      morphAmounts.current[i] =
        ((Math.sin(elapsedTime * morpher.speed) + 1) / 2) *
          (morpher.max - morpher.min) +
        morpher.min;
    });
  });

  const { interiorLightColor, externalLightColor } = useControls("lights", {
    interiorLightColor: { r: 255, g: 0, b: 0 },
    externalLightColor: { r: 0, g: 0, b: 255 },
  });

  // Create morph targets
  useEffect(() => {
    if (geometryRef.current) {
      // geometryRef.current.morphTargetsRelative = true;
      geometryRef.current.morphAttributes.position = [];
      geometryRef.current.morphAttributes.normal = [];

      const positions = geometryRef.current.getAttribute(
        "position"
      ) as BufferAttribute;

      // Make some noise
      const noises = morphers.map((_) => new SimplexNoise());
      const newPositionsAndNormals = morphers.map((_) => ({
        normals: [] as number[],
        positions: [] as number[],
      }));
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);

        morphers.forEach((morpher, i) => {
          const noise = noises[i];
          const positionsAndNormals = newPositionsAndNormals[i];
          positionsAndNormals.positions.push(
            x,
            y,
            morpher.morph({
              x,
              y,
              noiseFactor,
              noiseMaker: (x, y) => noise.noise2D(x, y),
              amplitude,
            })
          );
        });
      }

      // Compute normals inefficiently.
      newPositionsAndNormals.forEach((pAndN) => {
        if (geometryRef.current) {
          geometryRef.current.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(pAndN.positions, 3)
          );
          geometryRef.current.computeVertexNormals();

          geometryRef.current.morphAttributes.normal.push(
            geometryRef.current.getAttribute("normal").clone()
          );

          geometryRef.current.morphAttributes.position.push(
            new THREE.Float32BufferAttribute(pAndN.positions, 3)
          );
        }
      });

      // reset
      geometryRef.current.setAttribute("position", positions);
      geometryRef.current.computeVertexNormals();
    }
  }, [amplitude, bunnyScale, noiseFactor]);

  const materialRef = useRef<ShaderMaterial>();
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.extensions.derivatives = true;
    }
  }, []);

  return (
    <>
      <mesh
        morphTargetInfluences={morphAmounts.current}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeBufferGeometry
          args={[bunnyScale, bunnyScale, bunnyScale, bunnyScale]}
          ref={geometryRef}
        />
        <shaderMaterial
          side={THREE.DoubleSide}
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
        position={[0, 200, 10]}
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
        position={[0, 10, 20]}
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
    </>
  );
};

export default Cloth;
