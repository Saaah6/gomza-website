import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

function Airliner() {
  const fan1Ref = useRef();
  const fan2Ref = useRef();
  const thrust1Ref = useRef();
  const thrust2Ref = useRef();
  
  useFrame((state, delta) => {
    // Spin the fans rapidly
    if (fan1Ref.current) fan1Ref.current.rotation.z += delta * 25;
    if (fan2Ref.current) fan2Ref.current.rotation.z += delta * 25;
    
    // Animate the jet thrust (flickering scale)
    const flicker = 0.8 + Math.random() * 0.4;
    if (thrust1Ref.current) thrust1Ref.current.scale.set(flicker, flicker, flicker + Math.random());
    if (thrust2Ref.current) thrust2Ref.current.scale.set(flicker, flicker, flicker + Math.random());
  });

  // Colors based on the reference image
  const COLOR_CYAN = "#0dbda1"; // bright teal/cyan fuselage
  const COLOR_BLACK = "#111111"; // underbelly, tail, details
  const COLOR_RED = "#e6192b"; // red trims, engine rims
  const COLOR_GREY = "#475569"; // wings, gear struts

  return (
    // Base rotation to show off the plane
    <group rotation={[0.1, -0.25, 0.05]} scale={0.65}>
      
      {/* --- FUSELAGE --- */}
      <group position={[0, 0, 0]}>
        {/* Main Body (Cyan top) */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 5.0, 16]} />
          <meshStandardMaterial color={COLOR_CYAN} roughness={0.3} metalness={0.2} />
        </mesh>
        
        {/* Black Underbelly */}
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.05, 1.05, 5.02, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={COLOR_BLACK} roughness={0.4} />
        </mesh>

        {/* Red dividing stripe */}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.08, 1.08, 5.05, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color={COLOR_RED} roughness={0.4} />
        </mesh>

        {/* Nose Cone (Blunt wide-body nose) */}
        <group position={[0, 0, 2.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={COLOR_CYAN} roughness={0.3} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry args={[1.05, 16, 16, 0, Math.PI, 0, Math.PI / 2]} />
            <meshStandardMaterial color={COLOR_BLACK} roughness={0.4} />
          </mesh>
        </group>

        {/* Tail Cone */}
        <mesh position={[0, 0, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 1.1, 1.5, 16]} />
          <meshStandardMaterial color={COLOR_CYAN} roughness={0.3} metalness={0.2} />
        </mesh>
      </group>
      
      {/* --- COCKPIT WINDOWS --- */}
      <mesh position={[0, 0.6, 3.2]} rotation={[0.4, 0, 0]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
        <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.9} transparent opacity={0.6} />
      </mesh>
      
      {/* --- WINGS (Tapered & Swept) --- */}
      <group position={[0, -0.5, 0.2]}>
        {/* Left Wing */}
        <group position={[-3.5, 0, -0.8]} rotation={[0, -0.3, 0.1]}>
          {/* A 4-sided cylinder rotated and squashed creates a perfect tapered wing (trapezoid) */}
          <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} scale={[1, 1, 0.08]}>
            <cylinderGeometry args={[0.6, 2.0, 7.0, 4]} />
            <meshStandardMaterial color={COLOR_GREY} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
        {/* Right Wing */}
        <group position={[3.5, 0, -0.8]} rotation={[0, 0.3, -0.1]}>
          <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} scale={[1, 1, 0.08]}>
            <cylinderGeometry args={[0.6, 2.0, 7.0, 4]} />
            <meshStandardMaterial color={COLOR_GREY} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      </group>
      
      {/* --- TAIL FIN --- */}
      <group position={[0, 1.5, -3.4]} rotation={[-0.4, 0, 0]}>
        {/* Main Fin */}
        <mesh>
          <boxGeometry args={[0.2, 3.0, 1.8]} />
          <meshStandardMaterial color={COLOR_BLACK} roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Red/Cyan details on Fin */}
        <mesh position={[0.11, 0.5, -0.2]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.02, 2.0, 0.4]} />
          <meshStandardMaterial color={COLOR_RED} />
        </mesh>
        <mesh position={[0.11, 0.5, 0.2]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.02, 2.0, 0.4]} />
          <meshStandardMaterial color={COLOR_CYAN} />
        </mesh>
        {/* Left side details */}
        <mesh position={[-0.11, 0.5, -0.2]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.02, 2.0, 0.4]} />
          <meshStandardMaterial color={COLOR_RED} />
        </mesh>
        <mesh position={[-0.11, 0.5, 0.2]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.02, 2.0, 0.4]} />
          <meshStandardMaterial color={COLOR_CYAN} />
        </mesh>
      </group>
      
      {/* --- HORIZONTAL STABILIZERS (Tapered) --- */}
      <group position={[0, 0.2, -3.6]}>
        {/* Left Stabilizer */}
        <group position={[-1.8, 0, 0]} rotation={[0, -0.3, 0]}>
          <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} scale={[1, 1, 0.08]}>
            <cylinderGeometry args={[0.3, 1.2, 3.5, 4]} />
            <meshStandardMaterial color={COLOR_GREY} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
        {/* Right Stabilizer */}
        <group position={[1.8, 0, 0]} rotation={[0, 0.3, 0]}>
          <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} scale={[1, 1, 0.08]}>
            <cylinderGeometry args={[0.3, 1.2, 3.5, 4]} />
            <meshStandardMaterial color={COLOR_GREY} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      </group>
      
      {/* --- ENGINE 1 (Left Under Wing) --- */}
      <group position={[-2.4, -0.8, 0.8]}>
        {/* Engine Pylon */}
        <mesh position={[0, 0.5, -0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.8]} />
          <meshStandardMaterial color={COLOR_GREY} />
        </mesh>
        {/* Aerodynamic Engine Nacelle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.5, 2.2, 16]} />
          <meshStandardMaterial color={COLOR_BLACK} roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Red Intake Rim */}
        <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.15, 16]} />
          <meshStandardMaterial color={COLOR_RED} roughness={0.3} />
        </mesh>
        {/* Silver Intake Inner Lip */}
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Spinning Turbofans */}
        <group ref={fan1Ref} position={[0, 0, 1.02]}>
          {/* High-density fan blades (12 blades) */}
          {[...Array(12)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
              <boxGeometry args={[1.05, 0.08, 0.02]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
          {/* Pointed Spinner Cone */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0, 0.18, 0.4, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} />
          </mesh>
        </group>
        {/* Rear Exhaust Nozzle */}
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.8} />
        </mesh>
        {/* Pulsing Jet Thrust */}
        <group ref={thrust1Ref} position={[0, 0, -1.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.4, 0.8, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>
      
      {/* --- ENGINE 2 (Right Under Wing) --- */}
      <group position={[2.4, -0.8, 0.8]}>
        {/* Engine Pylon */}
        <mesh position={[0, 0.5, -0.2]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.8]} />
          <meshStandardMaterial color={COLOR_GREY} />
        </mesh>
        {/* Aerodynamic Engine Nacelle */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.5, 2.2, 16]} />
          <meshStandardMaterial color={COLOR_BLACK} roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Red Intake Rim */}
        <mesh position={[0, 0, 1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.15, 16]} />
          <meshStandardMaterial color={COLOR_RED} roughness={0.3} />
        </mesh>
        {/* Silver Intake Inner Lip */}
        <mesh position={[0, 0, 1.05]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.8} />
        </mesh>
        {/* Spinning Turbofans */}
        <group ref={fan2Ref} position={[0, 0, 1.02]}>
          {/* High-density fan blades (12 blades) */}
          {[...Array(12)].map((_, i) => (
            <mesh key={i} rotation={[0, 0, (i * Math.PI) / 6]}>
              <boxGeometry args={[1.05, 0.08, 0.02]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
            </mesh>
          ))}
          {/* Pointed Spinner Cone */}
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.05]}>
            <cylinderGeometry args={[0, 0.18, 0.4, 16]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.6} />
          </mesh>
        </group>
        {/* Rear Exhaust Nozzle */}
        <mesh position={[0, 0, -1.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.48, 0.35, 0.3, 16]} />
          <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.8} />
        </mesh>
        {/* Pulsing Jet Thrust */}
        <group ref={thrust2Ref} position={[0, 0, -1.3]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.4, 0.8, 12]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* --- LANDING GEAR (Retracted for flight) --- */}

    </group>
  );
}

export default function ThreePlane() {
  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle, rgba(148,163,184,0.05) 0%, transparent 70%)', backgroundColor: '#0f172a' }}>
      <Canvas 
        camera={{ position: [0, 1.0, 9.5], fov: 45 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={3.5} color="#ffffff" />
        <directionalLight position={[-10, -5, -10]} intensity={1.0} color="#0dbda1" />
        
        <Float 
          speed={1.0} 
          rotationIntensity={0.2} 
          floatIntensity={0.5} 
          floatingRange={[-0.1, 0.1]}
        >
          <Airliner />
        </Float>
      </Canvas>
    </div>
  );
}
