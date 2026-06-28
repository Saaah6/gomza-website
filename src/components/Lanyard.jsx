import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

function Band() {
  const band = useRef(null)
  const fixed = useRef(null)
  const j1 = useRef(null)
  const j2 = useRef(null)
  const j3 = useRef(null)
  const card = useRef(null)
  
  const [resolution, setResolution] = useState([window.innerWidth, window.innerHeight])
  
  useEffect(() => {
    const handleResize = () => setResolution([window.innerWidth, window.innerHeight])
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Spherical joints connecting the string parts
  useSphericalJoint(fixed, j1, [[0, 0, 0], [0, 1, 0]])
  useSphericalJoint(j1, j2, [[0, -1, 0], [0, 1, 0]])
  useSphericalJoint(j2, j3, [[0, -1, 0], [0, 1, 0]])
  useSphericalJoint(j3, card, [[0, -1, 0], [0, 2, 0]])

  useFrame(() => {
    if (!band.current) return
    const points = [
      fixed.current?.translation(),
      j1.current?.translation(),
      j2.current?.translation(),
      j3.current?.translation(),
      card.current?.translation(),
    ]
    if (points.every(Boolean)) {
      const p = points.map((p) => new THREE.Vector3(p.x, p.y, p.z))
      band.current.geometry.setPoints(p)
    }
  })

  return (
    <>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial 
          color="white" 
          depthTest={true} 
          resolution={resolution} 
          lineWidth={0.1} 
        />
      </mesh>

      <RigidBody ref={fixed} type="fixed" position={[0, 4, 0]} />
      
      <RigidBody position={[0.5, 3, 0]} ref={j1} colliders="ball" linearDamping={1} angularDamping={1}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[1, 2, 0]} ref={j2} colliders="ball" linearDamping={1} angularDamping={1}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[1.5, 1, 0]} ref={j3} colliders="ball" linearDamping={1} angularDamping={1}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[2, 0, 0]} ref={card} type="dynamic" colliders="cuboid" linearDamping={1} angularDamping={1}>
         <CuboidCollider args={[1, 1.5, 0.1]} />
         <mesh>
            <boxGeometry args={[2, 3, 0.2]} />
            <meshStandardMaterial color="#6366f1" />
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[1.8, 2.8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
         </mesh>
      </RigidBody>
    </>
  )
}

export default function Lanyard() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', pointerEvents: 'none', zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 13], fov: 35 }} style={{ pointerEvents: 'auto' }}>
        <ambientLight intensity={1} />
        <Physics interpolate gravity={[0, -20, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}
