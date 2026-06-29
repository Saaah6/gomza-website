import * as THREE from 'three'
import { useEffect, useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Text, useTexture } from '@react-three/drei'
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

function SwingingCard() {
  const { camera, pointer, size } = useThree()
  const [isDragging, setIsDragging] = useState(false)
  const anchorX = size.width < 768 ? -3.5 : -6.5
  
  const dobermanTex = useTexture('/assets/doberman.png')
  
  const fixed = useRef(null)
  const j1 = useRef(null)
  const j2 = useRef(null)
  const j3 = useRef(null)
  const card = useRef(null)

  // Spherical joints connecting the invisible string parts
  useSphericalJoint(fixed, j1, [[0, 0, 0], [0, 0.8, 0]])
  useSphericalJoint(j1, j2, [[0, -0.8, 0], [0, 0.8, 0]])
  useSphericalJoint(j2, j3, [[0, -0.8, 0], [0, 0.8, 0]])
  useSphericalJoint(j3, card, [[0, -0.8, 0], [0, 1.5, 0]])

  useEffect(() => {
    if (!isDragging) return
    const handleGlobalUp = () => setIsDragging(false)
    window.addEventListener('pointerup', handleGlobalUp)
    window.addEventListener('pointercancel', handleGlobalUp)
    return () => {
      window.removeEventListener('pointerup', handleGlobalUp)
      window.removeEventListener('pointercancel', handleGlobalUp)
    }
  }, [isDragging])

  const handlePointerDown = (e) => {
    e.stopPropagation()
    try { e.target.setPointerCapture(e.pointerId) } catch (err) {}
    setIsDragging(true)
    if (card.current) {
      card.current.wakeUp()
    }
  }

  const handlePointerUp = (e) => {
    e.stopPropagation()
    try { e.target.releasePointerCapture(e.pointerId) } catch (err) {}
    setIsDragging(false)
  }

  useFrame(() => {
    if (isDragging && card.current) {
      const pos = card.current.translation()
      // Project 2D mouse pointer to 3D space at the card's current Z depth
      const target = new THREE.Vector3(pointer.x, pointer.y, 0).unproject(camera)
      target.sub(camera.position).normalize()
      const distance = (pos.z - camera.position.z) / target.z
      const projectedPos = camera.position.clone().add(target.multiplyScalar(distance))
      
      // Apply a strong proportional impulse to pull the card towards the mouse
      const pullStrength = 20
      const force = {
        x: (projectedPos.x - pos.x) * pullStrength,
        y: (projectedPos.y - pos.y) * pullStrength,
        z: (projectedPos.z - pos.z) * pullStrength
      }
      
      card.current.applyImpulse(force, true)
    }
  })

  return (
    <>
      <RigidBody ref={fixed} type="fixed" position={[anchorX, 6, 0]} />
      
      <RigidBody position={[anchorX + 0.2, 5, 0]} ref={j1} colliders="ball" linearDamping={4} angularDamping={4}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[anchorX + 0.4, 4, 0]} ref={j2} colliders="ball" linearDamping={4} angularDamping={4}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[anchorX + 0.6, 3, 0]} ref={j3} colliders="ball" linearDamping={4} angularDamping={4}>
        <BallCollider args={[0.1]} />
      </RigidBody>
      
      <RigidBody position={[anchorX + 1.0, 1, 0]} ref={card} type="dynamic" colliders="cuboid" linearDamping={4} angularDamping={4}>
         <CuboidCollider args={[1, 1.5, 0.1]} />
         <mesh 
            onPointerDown={handlePointerDown} 
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerOut={handlePointerUp}
            onPointerMove={(e) => { if (isDragging) e.stopPropagation() }}
            onPointerEnter={() => document.body.style.cursor = 'grab'} 
            onPointerLeave={(e) => {
              document.body.style.cursor = 'auto'
              handlePointerUp(e)
            }}
         >
            <boxGeometry args={[2, 3, 0.2]} />
            <meshStandardMaterial color="#111111" />
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[1.8, 2.8]} />
              <meshBasicMaterial color="#ffffff" />
              <mesh position={[0, 0.25, 0.01]}>
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial map={dobermanTex} transparent={true} />
              </mesh>
              <Text position={[0, -0.65, 0.01]} fontSize={0.35} color="black" fontWeight="bold" letterSpacing={0.1}>
                GOMZA
              </Text>
              <Text position={[0, -1.05, 0.01]} fontSize={0.12} color="#666666" maxWidth={1.4} textAlign="center">
                Marketing for Real Estate & SaaS
              </Text>
            </mesh>
         </mesh>
      </RigidBody>
    </>
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

  useEffect(() => {
    const barkSound = new Audio('https://actions.google.com/sounds/v1/animals/dog_barking.ogg');
    barkSound.volume = 0.5;
    let played = false;

    const playSound = () => {
      if (played) return;
      const playPromise = barkSound.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          played = true;
          setTimeout(() => {
            barkSound.pause();
            barkSound.currentTime = 0;
          }, 3000);
        }).catch(err => console.log(err));
      }
      window.removeEventListener('pointerdown', playSound);
      window.removeEventListener('keydown', playSound);
      window.removeEventListener('scroll', playSound);
    };

    const immediatePlay = barkSound.play();
    if (immediatePlay !== undefined) {
      immediatePlay.then(() => {
        played = true;
        setTimeout(() => {
          barkSound.pause();
          barkSound.currentTime = 0;
        }, 3000);
      }).catch(() => {
        window.addEventListener('pointerdown', playSound);
        window.addEventListener('keydown', playSound);
        window.addEventListener('scroll', playSound, { once: true });
      });
    }

    return () => {
      barkSound.pause();
      window.removeEventListener('pointerdown', playSound);
      window.removeEventListener('keydown', playSound);
      window.removeEventListener('scroll', playSound);
    };
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('.site-footer')
      if (footer) {
        const rect = footer.getBoundingClientRect()
        // Fade out when footer enters the viewport
        if (rect.top < window.innerHeight + 100) {
          setOpacity(0)
        } else {
          setOpacity(1)
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', 
      pointerEvents: 'none', zIndex: 9999,
      opacity: opacity, transition: 'opacity 0.5s ease-out'
    }}>
      <Canvas 
        camera={{ position: [0, 0, 13], fov: 35 }} 
        style={{ pointerEvents: 'none' }}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <ResponsiveCamera />
        <ambientLight intensity={1} />
        <Physics interpolate gravity={[0, -10, 0]} timeStep="vary">
          <Suspense fallback={null}>
            <SwingingCard />
          </Suspense>
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
