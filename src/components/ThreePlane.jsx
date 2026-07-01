import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows } from '@react-three/drei';

function Airplane() {
  const prop1Ref = useRef();
  const prop2Ref = useRef();
  
  useFrame((state, delta) => {
    // Spin propellers incredibly fast
    if (prop1Ref.current) prop1Ref.current.rotation.z += delta * 25;
    if (prop2Ref.current) prop2Ref.current.rotation.z += delta * 25;
  });

  return (
    // Base rotation to make it face towards us almost directly
    <group rotation={[0.05, -0.15, 0.05]} scale={0.75}>
      {/* Fuselage (compressed/shorter for a lighter look) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <capsuleGeometry args={[0.8, 2.2, 32, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Cockpit Window Glass */}
      <mesh position={[0, 0.5, 0.6]} rotation={[0.35, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshPhysicalMaterial 
          color="#38bdf8" 
          transmission={0.9} 
          opacity={1} 
          transparent 
          roughness={0.05} 
          thickness={0.5}
        />
      </mesh>

      {/* Pilot */}
      <group position={[0, 0.15, 0.7]}>
        {/* Body */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.5]} />
          <meshStandardMaterial color="#f87171" roughness={0.8} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.25, 0]}>
          <sphereGeometry args={[0.22]} />
          <meshStandardMaterial color="#fde047" roughness={0.5} />
        </mesh>
        {/* Goggles/Visor */}
        <mesh position={[0, 0.28, 0.18]}>
          <boxGeometry args={[0.35, 0.1, 0.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
        </mesh>
        {/* Scarf */}
        <mesh position={[0.2, 0.1, -0.3]} rotation={[0, 0.5, -0.2]}>
          <boxGeometry args={[0.4, 0.05, 0.8]} />
          <meshStandardMaterial color="#ef4444" />
        </mesh>
      </group>
      
      {/* Main Wing (more compressed) */}
      <mesh position={[0, -0.15, 0.1]}>
        <boxGeometry args={[5.5, 0.15, 1.2]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* Tail Fin */}
      <mesh position={[0, 0.7, -1.6]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.15, 1.2, 0.8]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Horizontal Stabilizer */}
      <mesh position={[0, 0, -1.7]}>
        <boxGeometry args={[2.0, 0.12, 0.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
      </mesh>
      
      {/* Engine 1 (Left) */}
      <group position={[-1.5, -0.35, 0.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.9, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
        </mesh>
        <group ref={prop1Ref} position={[0, 0, 0.5]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 1.4, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      </group>
      
      {/* Engine 2 (Right) */}
      <group position={[1.5, -0.35, 0.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.9, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
        </mesh>
        <group ref={prop2Ref} position={[0, 0, 0.5]}>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.4, 0.08, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.08, 1.4, 0.02]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function ThreePlane() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, rgba(148,163,184,0.05) 0%, transparent 70%)', backgroundColor: '#0f172a' }}>
      <Canvas camera={{ position: [0, 1.0, 7.5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <Float 
          speed={2.5} 
          rotationIntensity={0.3} 
          floatIntensity={1.5} 
          floatingRange={[-0.1, 0.1]}
        >
          <Airplane />
        </Float>
        
        <Environment preset="city" />
        <ContactShadows position={[0, -2.0, 0]} opacity={0.6} scale={15} blur={2.5} far={4.5} color="#000000" />
      </Canvas>
    </div>
  );
}
