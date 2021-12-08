import { useParticle } from "@react-three/cannon";
import { Vector3 } from "three";

const Cloth = () => {
  const clothMass = 1; // 1 kg in total
  const clothSize = 1; // 1 meter
  const Nx = 12; // number of horizontal particles in the cloth
  const Ny = 12; // number of vertical particles in the cloth
  const mass = (clothMass / Nx) * Ny;
  const restDistance = clothSize / Nx;

  const sphereSize = 0.1;
  const movementRadius = 0.2;

  // Parametric function
  // https://threejs.org/docs/index.html#api/en/geometries/ParametricGeometry
  function clothFunction(u: number, v: number, target: Vector3) {
    const x = (u - 0.5) * restDistance * Nx;
    const y = (v + 0.5) * restDistance * Ny;
    const z = 0;

    target.set(x, y, z);

    return target;
  }

  // We make particles.
};

type ParticleProps = {
  mass: number;
};

const Particle = ({ mass }: ParticleProps, ref) => {
  const [particle, api] = useParticle(() => ({
    mass,
  }));
  return null;
};
