import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Airplane() {
  const fan1Ref = useRef();
  const fan2Ref = useRef();
  const thrust1Ref = useRef();
  const thrust2Ref = useRef();
  
  useFrame((state, delta) => {
    // Spin the fans rapidly
    if (fan1Ref.current) fan1Ref.current.rotation.z += delta * 30;
    if (fan2Ref.current) fan2Ref.current.rotation.z += delta * 30;
    
    // Animate the jet thrust (flickering scale & opacity)
    const flicker = 0.8 + Math.random() * 0.4; // random scale between 0.8 and 1.2
    if (thrust1Ref.current) {
      thrust1Ref.current.scale.set(flicker, flicker, flicker + Math.random());
    }
    if (thrust2Ref.current) {
      thrust2Ref.current.scale.set(flicker, flicker, flicker + Math.random());
    }
  });

  return (
    <group rotation={[0.05, -0.2, 0.05]} scale={0.75}>
      {/* PRIVATE JET FUSELAGE */}
      <group position={[0, 0, 0]}>
        {/* Main Body */}
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 4.0, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Sleek Private Jet Nose */}
        <mesh position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.7, 2.5, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.5} />
        </mesh>
        {/* Tapered Tail Cone */}
        <mesh position={[0, 0, -3.25]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.7, 1.5, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
      
      {/* STREAMLINED COCKPIT WINDOWS */}
      <mesh position={[0, 0.45, 1.1]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.8]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} />
      </mesh>
      
      {/* SWEPT BACK WINGS */}
      <group position={[0, -0.15, -0.4]}>
        <mesh position={[-2.4, 0, -0.4]} rotation={[0, -0.45, 0]}>
          <boxGeometry args={[5.0, 0.1, 1.2]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[2.4, 0, -0.4]} rotation={[0, 0.45, 0]}>
          <boxGeometry args={[5.0, 0.1, 1.2]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>
      
      {/* SWEPT TAIL FIN */}
      <mesh position={[0, 0.9, -3.1]} rotation={[-0.5, 0, 0]}>
        <boxGeometry args={[0.15, 1.8, 1.4]} />
        <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.3} />
      </mesh>
      
      {/* T-TAIL HORIZONTAL STABILIZERS (Mounted high on the fin for private jet look) */}
      <group position={[0, 1.7, -3.4]}>
        <mesh position={[-1.2, 0, 0]} rotation={[0, -0.4, 0]}>
          <boxGeometry args={[2.6, 0.1, 0.8]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.3} />
        </mesh>
        <mesh position={[1.2, 0, 0]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[2.6, 0.1, 0.8]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.3} />
        </mesh>
      </group>
      
      {/* REAR-MOUNTED JET ENGINE 1 (Left) */}
      <group position={[-1.1, 0.2, -2.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Intake */}
        <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Spinning Fans */}
        <group ref={fan1Ref} position={[0, 0, 0.83]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2.5]}>
              <boxGeometry args={[0.55, 0.05, 0.02]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>
        {/* Pulsing Jet Thrust */}
        <group ref={thrust1Ref} position={[0, 0, -1.0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.6, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, -0.3]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
        </group>
      </group>
      
      {/* REAR-MOUNTED JET ENGINE 2 (Right) */}
      <group position={[1.1, 0.2, -2.4]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 1.8, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Intake */}
        <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Spinning Fans */}
        <group ref={fan2Ref} position={[0, 0, 0.83]}>
          {[...Array(5)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2.5]}>
              <boxGeometry args={[0.55, 0.05, 0.02]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} />
            </mesh>
          ))}
          <mesh>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} />
          </mesh>
        </group>
        {/* Pulsing Jet Thrust */}
        <group ref={thrust2Ref} position={[0, 0, -1.0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 0.6, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, -0.3]}>
            <sphereGeometry args={[0.15, 12, 12]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

export default function ThreePlane() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, rgba(148,163,184,0.05) 0%, transparent 70%)', backgroundColor: '#0f172a' }}>
      <Canvas 
        camera={{ position: [0, 1.0, 7.5], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={2.0} />
        <directionalLight position={[10, 10, 5]} intensity={3.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#38bdf8" />
        
        <Float 
          speed={1.5} 
          rotationIntensity={0.2} 
          floatIntensity={0.8} 
          floatingRange={[-0.1, 0.1]}
        >
          <Airplane />
        </Float>
      </Canvas>
    </div>
  );
}
