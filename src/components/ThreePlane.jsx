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
    <group rotation={[0.05, -0.2, 0.05]} scale={0.75}>
      {/* AERODYNAMIC FUSELAGE */}
      <group position={[0, 0, 0]}>
        {/* Main Body (Sleek Cylinder) */}
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 3.5, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.7} />
        </mesh>
        
        {/* Nose Cone (Aerodynamic) */}
        <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.7, 1.5, 32]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.2} metalness={0.7} />
        </mesh>

        {/* Tail Cone */}
        <mesh position={[0, 0, -2.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.7, 1.0, 32]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.2} metalness={0.7} />
        </mesh>
      </group>
      
      {/* Cockpit Window Glass */}
      <mesh position={[0, 0.5, 0.8]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.55, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshPhysicalMaterial 
          color="#1e3a8a" 
          transmission={0.9} 
          opacity={1} 
          transparent 
          roughness={0.05} 
          thickness={0.5}
        />
      </mesh>

      {/* Pilot */}
      <group position={[0, 0.15, 0.8]}>
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
        {/* Visor */}
        <mesh position={[0, 0.28, 0.18]}>
          <boxGeometry args={[0.35, 0.1, 0.15]} />
          <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>
      
      {/* Main Swept Wings */}
      <group position={[0, -0.15, -0.2]}>
        {/* Left Wing */}
        <mesh position={[-2.2, 0, -0.2]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[4.5, 0.1, 1.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Right Wing */}
        <mesh position={[2.2, 0, -0.2]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[4.5, 0.1, 1.4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>
      
      {/* Swept Tail Fin */}
      <mesh position={[0, 0.8, -2.6]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.15, 1.6, 1.2]} />
        <meshStandardMaterial color="#64748b" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* Swept Horizontal Stabilizers */}
      <group position={[0, 0.1, -2.8]}>
        <mesh position={[-1.0, 0, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[2.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[1.0, 0, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[2.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>
      
      {/* Jet Engine 1 (Left) */}
      <group position={[-1.8, -0.4, 0.2]}>
        {/* Outer Engine Nacelle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.6, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Jet Intake (Dark Inner Hole) */}
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Inside Fan Blades */}
        <group ref={prop1Ref} position={[0, 0, 0.76]}>
          {/* Fan Spinner */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Fan Blades (Multiple thin blades for a turbofan look) */}
          {[...Array(6)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <boxGeometry args={[0.7, 0.04, 0.02]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
          ))}
        </group>
        {/* Jet Exhaust Glow */}
        <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.9]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* Jet Engine 2 (Right) */}
      <group position={[1.8, -0.4, 0.2]}>
        {/* Outer Engine Nacelle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.6, 32]} />
          <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Jet Intake (Dark Inner Hole) */}
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.9} />
        </mesh>
        {/* Inside Fan Blades */}
        <group ref={prop2Ref} position={[0, 0, 0.76]}>
          {/* Fan Spinner */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} />
          </mesh>
          {/* Fan Blades */}
          {[...Array(6)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
              <boxGeometry args={[0.7, 0.04, 0.02]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
          ))}
        </group>
        {/* Jet Exhaust Glow */}
        <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 32]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0, -0.9]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial color="#7dd3fc" transparent opacity={0.6} />
        </mesh>
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
