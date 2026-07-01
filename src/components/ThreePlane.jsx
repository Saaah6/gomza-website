import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Airplane() {
  return (
    <group rotation={[0.05, -0.2, 0.05]} scale={0.75}>
      {/* FUSELAGE */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
          {/* 16 segments is a good balance of roundness vs performance */}
          <cylinderGeometry args={[0.7, 0.7, 3.5, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.7, 1.5, 16]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0, -2.75]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.7, 1.0, 16]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
      
      {/* COCKPIT */}
      <mesh position={[0, 0.5, 0.8]} rotation={[0.4, 0, 0]}>
        <sphereGeometry args={[0.55, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#0f172a" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* WINGS (IndiGo Blue Accents) */}
      <group position={[0, -0.15, -0.2]}>
        <mesh position={[-2.2, 0, -0.2]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[4.5, 0.1, 1.4]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[2.2, 0, -0.2]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[4.5, 0.1, 1.4]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
      
      {/* TAIL FIN */}
      <mesh position={[0, 0.8, -2.6]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[0.15, 1.6, 1.2]} />
        <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* HORIZONTAL STABILIZERS */}
      <group position={[0, 0.1, -2.8]}>
        <mesh position={[-1.0, 0, 0]} rotation={[0, -0.3, 0]}>
          <boxGeometry args={[2.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.2} />
        </mesh>
        <mesh position={[1.0, 0, 0]} rotation={[0, 0.3, 0]}>
          <boxGeometry args={[2.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#001B94" roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
      
      {/* ENGINE 1 (Left) */}
      <group position={[-1.8, -0.4, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Exhaust Glow */}
        <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
      
      {/* ENGINE 2 (Right) */}
      <group position={[1.8, -0.4, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.4, 1.6, 16]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 16]} />
          <meshStandardMaterial color="#020617" roughness={0.9} />
        </mesh>
        {/* Exhaust Glow */}
        <mesh position={[0, 0, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
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
