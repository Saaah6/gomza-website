import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Text } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider, useSphericalJoint } from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'

extend({ MeshLineGeometry, MeshLineMaterial })

function useLanyardTexture() {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const context = canvas.getContext('2d')
    context.fillStyle = 'black'
    context.fillRect(0, 0, 512, 128)
    context.fillStyle = 'white'
    context.font = 'bold 80px monospace'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText('GOMZA', 256, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(4, 1)
    return tex
  }, [])
  return texture
}

function FallingCard() {
  const card = useRef(null)

  const handlePointerDown = (e) => {
    e.stopPropagation()
    if (card.current) {
      // Apply upward and random impulse to "juggle" the card
      card.current.applyImpulse({ x: (Math.random() - 0.5) * 20, y: 30, z: (Math.random() - 0.5) * 10 }, true)
      card.current.applyTorqueImpulse({ x: (Math.random() - 0.5) * 10, y: (Math.random() - 0.5) * 10, z: (Math.random() - 0.5) * 10 }, true)
    }
  }

  return (
    <RigidBody position={[-2, 6, 0]} ref={card} type="dynamic" colliders="cuboid" linearDamping={1} angularDamping={1}>
       <CuboidCollider args={[1, 1.5, 0.1]} />
       <mesh onPointerDown={handlePointerDown} onPointerEnter={() => document.body.style.cursor = 'pointer'} onPointerLeave={() => document.body.style.cursor = 'auto'}>
          <boxGeometry args={[2, 3, 0.2]} />
          <meshStandardMaterial color="#111111" />
          <mesh position={[0, 0, 0.11]}>
            <planeGeometry args={[1.8, 2.8]} />
            <meshBasicMaterial color="#ffffff" />
            <Text position={[0, 0.5, 0.01]} fontSize={0.35} color="black" fontWeight="bold" letterSpacing={0.1}>
              GOMZA
            </Text>
            <Text position={[0, 0, 0.01]} fontSize={0.12} color="#666666" maxWidth={1.4} textAlign="center">
              Marketing for Real Estate & SaaS
            </Text>
          </mesh>
       </mesh>
    </RigidBody>
  )
}

function ResponsiveCamera() {
  const { camera, size } = useThree()
  
  useEffect(() => {
    if (size.width < 768) {
      camera.fov = 55
      camera.position.z = 18
    } else {
      camera.fov = 35
      camera.position.z = 13
    }
    camera.updateProjectionMatrix()
  }, [size, camera])
  
  return null
}

export default function Lanyard() {
  const [opacity, setOpacity] = useState(1)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setOpacity(0)
    }, 10000) // Give them 10 seconds to play with it before it fades out

    const removeTimer = setTimeout(() => {
      setMounted(false)
    }, 12000) // fully remove after transition

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [])

  if (!mounted) return null

  return (
    <div style={{ 
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', 
      pointerEvents: 'none', zIndex: 0,
      opacity: opacity, transition: 'opacity 2s ease-in-out'
    }}>
      <Canvas camera={{ position: [0, 0, 13], fov: 35 }} style={{ pointerEvents: opacity > 0.5 ? 'auto' : 'none' }}>
        <ResponsiveCamera />
        <ambientLight intensity={1} />
        <Physics interpolate gravity={[0, -5, 0]} timeStep={1 / 60}>
          <FallingCard />
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
