"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float iTime;
  uniform float uIntensity;
  uniform float uAspect;
  uniform sampler2D iChannel0;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * vec2(uAspect, 1.0);
    float result = texture2D(iChannel0, uv * 1.1 + vec2(iTime * -0.005)).r;
    result *= texture2D(iChannel0, uv * 0.9 + vec2(iTime * 0.005)).g;
    result = pow(result, 12.0);
    gl_FragColor = vec4(vec3(1.0, 0.9, 0.8) * result * uIntensity, 1.0);
  }
`;

function generateNoiseTexture(size: number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.random() * 255;
    data[i + 1] = Math.random() * 255;
    data[i + 2] = Math.random() * 255;
    data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

type PlaneProps = {
  speed: number;
  intensity: number;
  boost: boolean;
  still: boolean;
  textureSize: number;
};

function SparklesPlane({ speed, intensity, boost, still, textureSize }: PlaneProps) {
  const level = useRef(intensity);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          iTime: { value: 0 },
          uIntensity: { value: intensity },
          uAspect: { value: 1 },
          iChannel0: { value: generateNoiseTexture(textureSize) },
        },
        vertexShader,
        fragmentShader,
      }),
    // Texture and material are created once; intensity is driven in useFrame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textureSize],
  );

  useFrame((state, delta) => {
    const u = material.uniforms;
    u.iTime.value = still ? 30 : state.clock.elapsedTime * speed;
    u.uAspect.value = state.size.width / state.size.height;
    level.current = THREE.MathUtils.damp(
      level.current,
      boost ? intensity * 2.4 : intensity,
      3,
      delta,
    );
    u.uIntensity.value = level.current;
  });

  return (
    <mesh material={material} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}

type GlitterProps = {
  speed?: number;
  intensity?: number;
  /** Brightens the glitter (used during the ENTER transition). */
  boost?: boolean;
  /** Render a single static frame (reduced motion). */
  still?: boolean;
  /** Lighter settings for phones. */
  mobile?: boolean;
  className?: string;
};

export function GlitterFinal({
  speed = 0.75,
  intensity = 5,
  boost = false,
  still = false,
  mobile = false,
  className = "",
}: GlitterProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 mix-blend-screen ${className}`}
      aria-hidden
    >
      <Canvas
        frameloop={still ? "demand" : "always"}
        dpr={[1, mobile ? 1 : 1.5]}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <SparklesPlane
          speed={mobile ? speed * 0.65 : speed}
          intensity={mobile ? intensity * 0.7 : intensity}
          boost={boost}
          still={still}
          textureSize={mobile ? 256 : 512}
        />
      </Canvas>
    </div>
  );
}

export const Component = GlitterFinal;
export default GlitterFinal;
