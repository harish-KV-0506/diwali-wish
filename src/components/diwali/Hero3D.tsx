"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  3D Diya — a stylized oil lamp (clay bowl + flame + glow halo)     */
/* ------------------------------------------------------------------ */

function DiyaMesh({
  scale = 1,
  flameColor = "#ffb300",
  glowColor = "#ff8a00",
}: {
  scale?: number;
  flameColor?: string;
  glowColor?: string;
}) {
  const flameRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  // Clay bowl — half-sphere flattened
  const bowlGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.9, 32, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    return geo;
  }, []);

  // Flame — cone stretched upward
  const flameGeometry = useMemo(() => new THREE.ConeGeometry(0.18, 0.7, 24), []);

  // Halo plane (always faces camera-ish)
  const haloGeometry = useMemo(() => new THREE.PlaneGeometry(3, 3), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flameRef.current) {
      // flicker
      const flick = 1 + Math.sin(t * 18) * 0.06 + Math.sin(t * 31) * 0.04;
      flameRef.current.scale.set(flick, 1 + Math.sin(t * 14) * 0.1, flick);
      flameRef.current.rotation.z = Math.sin(t * 6) * 0.04;
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 12) * 0.1;
    }
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 4) * 0.04;
      // billboarding — face camera
      haloRef.current.lookAt(state.camera.position);
    }
  });

  return (
    <group scale={scale}>
      {/* Clay bowl */}
      <mesh geometry={bowlGeometry} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#9c4a1c" roughness={0.7} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Bowl rim highlight */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 12, 48]} />
        <meshStandardMaterial color="#d97a2c" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* Oil surface */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.78, 32]} />
        <meshStandardMaterial color="#ffd54f" emissive="#ff8a00" emissiveIntensity={0.4} roughness={0.2} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
        <meshStandardMaterial color="#3a1a0a" />
      </mesh>
      {/* Flame */}
      <group ref={flameRef} position={[0, 0.55, 0]}>
        <mesh geometry={flameGeometry}>
          <meshStandardMaterial
            color={flameColor}
            emissive={flameColor}
            emissiveIntensity={2.2}
            transparent
            opacity={0.95}
          />
        </mesh>
        {/* Inner brighter flame */}
        <mesh position={[0, 0.05, 0]} scale={0.55}>
          <coneGeometry args={[0.16, 0.55, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#fff4cc" emissiveIntensity={3} transparent opacity={0.85} />
        </mesh>
      </group>
      {/* Point light from flame */}
      <pointLight position={[0, 0.7, 0]} color={glowColor} intensity={6} distance={6} decay={2} />
      {/* Glow sphere */}
      <mesh ref={glowRef} position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Halo plane */}
      <mesh ref={haloRef} position={[0, 0.55, 0]}>
        <primitive object={haloGeometry} attach="geometry" />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Rotating mandala ring — concentric decorative geometry            */
/* ------------------------------------------------------------------ */

function MandalaRing({
  radius = 3.2,
  segments = 16,
  color = "#ffd54f",
  speed = 0.1,
  tilt = 0,
}: {
  radius?: number;
  segments?: number;
  color?: string;
  speed?: number;
  tilt?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed;
  });

  const petals = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = [];
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rot: angle,
      });
    }
    return arr;
  }, [radius, segments]);

  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      {petals.map((p, i) => (
        <group key={i} position={p.pos} rotation={[0, 0, p.rot]}>
          {/* Lotus petal shape — teardrop using scaled sphere */}
          <mesh scale={[0.32, 0.6, 0.05]}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.85}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          {/* Center bead */}
          <mesh position={[0, 0, 0.1]} scale={0.08}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#fff4cc" emissive="#ffd54f" emissiveIntensity={2} />
          </mesh>
        </group>
      ))}
      {/* Decorative ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <torusGeometry args={[radius, 0.025, 8, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Particle field — floating sparks / floating embers                */
/* ------------------------------------------------------------------ */

function FloatingEmbers({ count = 120 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 1] = Math.random() * 12 - 2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      // gentle rise + drift
      arr[i * 3 + 1] += delta * (0.3 + (i % 5) * 0.05);
      arr[i * 3] += Math.sin(t * 0.5 + i) * delta * 0.1;
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = -2;
    }
    pos.needsUpdate = true;
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffd54f"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating diyas — multiple lamps slowly bobbing around scene       */
/* ------------------------------------------------------------------ */

function FloatingDiyas() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={1.4}>
        <group position={[-3.2, 1.5, -1]}>
          <DiyaMesh scale={0.6} flameColor="#ff4081" glowColor="#e91e63" />
        </group>
      </Float>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={1.2}>
        <group position={[3.2, 1.2, -1]}>
          <DiyaMesh scale={0.55} flameColor="#ffd54f" glowColor="#ffb300" />
        </group>
      </Float>
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={1.6}>
        <group position={[-2.4, -1.4, 0]}>
          <DiyaMesh scale={0.45} flameColor="#ff8a00" glowColor="#ff8a00" />
        </group>
      </Float>
      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.5}>
        <group position={[2.4, -1.2, 0]}>
          <DiyaMesh scale={0.5} flameColor="#ffd54f" glowColor="#ffd54f" />
        </group>
      </Float>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Auto camera parallax based on pointer                              */
/* ------------------------------------------------------------------ */

function CameraParallax() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 2 - camera.position.x) * 0.04;
    camera.position.y += (1 + pointer.y * 1 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ------------------------------------------------------------------ */
/*  Scene assembly                                                     */
/* ------------------------------------------------------------------ */

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} color="#6a1b9a" />
      <directionalLight position={[5, 8, 5]} intensity={0.4} color="#ffd54f" />
      <pointLight position={[-5, 2, -5]} color="#e91e63" intensity={3} distance={15} />
      <pointLight position={[5, 2, -5]} color="#ff8a00" intensity={3} distance={15} />

      {/* Center hero diya — slowly rotates */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
        <group rotation={[0, 0, 0]}>
          <DiyaMesh scale={1.4} flameColor="#ffb300" glowColor="#ff8a00" />
        </group>
      </Float>

      {/* Rotating mandala rings around the diya */}
      <MandalaRing radius={3.2} segments={12} color="#ffd54f" speed={0.12} tilt={0.1} />
      <MandalaRing radius={4.4} segments={16} color="#e91e63" speed={-0.08} tilt={-0.15} />
      <MandalaRing radius={5.6} segments={20} color="#ff8a00" speed={0.06} tilt={0.2} />

      {/* Floating diyas */}
      <FloatingDiyas />

      {/* Embers + sparkles */}
      <FloatingEmbers count={140} />
      <Sparkles count={80} scale={[14, 8, 6]} size={3} speed={0.4} color="#ffd54f" opacity={0.7} />
      <Sparkles count={50} scale={[10, 6, 4]} size={5} speed={0.3} color="#ff4081" opacity={0.6} />

      <CameraParallax />

      <Suspense fallback={null}>
        <Environment preset="sunset" background={false} />
      </Suspense>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported Hero3D — full-screen canvas behind the hero text          */
/* ------------------------------------------------------------------ */

export default function Hero3D({ interactive = true }: { interactive?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1, 8], fov: 55 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
      {interactive && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
          autoRotate
          autoRotateSpeed={0.4}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      )}
    </Canvas>
  );
}
