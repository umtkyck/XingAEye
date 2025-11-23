'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { EffectComposer, Noise, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

// Custom Dither Shader
const DitherShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2() },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Bayer matrix for dithering
    float dither8x8(vec2 position, float brightness) {
      int x = int(mod(position.x, 8.0));
      int y = int(mod(position.y, 8.0));
      int index = x + y * 8;
      float limit = 0.0;

      if (x < 8) {
        if (index == 0) limit = 0.0;
        if (index == 1) limit = 32.0;
        if (index == 2) limit = 8.0;
        if (index == 3) limit = 40.0;
        if (index == 4) limit = 2.0;
        if (index == 5) limit = 34.0;
        if (index == 6) limit = 10.0;
        if (index == 7) limit = 42.0;
        if (index == 8) limit = 48.0;
        if (index == 9) limit = 16.0;
        if (index == 10) limit = 56.0;
        if (index == 11) limit = 24.0;
        if (index == 12) limit = 50.0;
        if (index == 13) limit = 18.0;
        if (index == 14) limit = 58.0;
        if (index == 15) limit = 26.0;
      }

      return brightness < limit / 64.0 ? 0.0 : 1.0;
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      vec2 pixelPos = vUv * uResolution;

      float brightness = dot(texel.rgb, vec3(0.299, 0.587, 0.114));
      float dithered = dither8x8(pixelPos, brightness);

      // Add subtle color grading
      vec3 color = mix(vec3(0.05, 0.1, 0.2), vec3(0.2, 0.4, 0.8), dithered);
      color = mix(texel.rgb, color, 0.15);

      gl_FragColor = vec4(color, texel.a);
    }
  `,
}

export function Scene3D() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const particlesRef = useRef<THREE.Points>(null)

  // Animated particles
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 1000; i++) {
      const t = Math.random() * Math.PI * 2
      const p = Math.random() * Math.PI * 2
      const r = 3 + Math.random() * 5

      temp.push(
        r * Math.sin(t) * Math.cos(p),
        r * Math.sin(t) * Math.sin(p),
        r * Math.cos(t)
      )
    }
    return new Float32Array(temp)
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.1
      sphereRef.current.rotation.y = time * 0.15
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.05
      particlesRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
    }
  })

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Directional Lights */}
      <directionalLight position={[10, 10, 5]} intensity={1} color="#2563eb" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#ef4444" />

      {/* Point Lights */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#60a5fa" />

      {/* Main Distorted Sphere */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={sphereRef} args={[1, 128, 128]} position={[0, 0, 0]}>
          <MeshDistortMaterial
            color="#1e40af"
            attach="material"
            distort={0.6}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>

      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#60a5fa"
          transparent
          opacity={0.6}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Post-processing Effects */}
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new THREE.Vector2(0.001, 0.001)}
        />
        <Noise opacity={0.08} />
      </EffectComposer>
    </>
  )
}
