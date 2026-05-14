import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import { ShoeModel } from './ShoeModel'
import { PlaceholderShoe } from './PlaceholderShoe'
import { useConfiguratorStore } from '../../store/configuratorStore'

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-[#E5E5E5] border-t-[#E85D26] rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#999]">Loading Model</span>
      </div>
    </Html>
  )
}

export function CenterCanvas() {
  const { shoe, autoRotate, setAutoRotate, cameraView } = useConfiguratorStore()
  const canvasRef = useRef()
  const controlsRef = useRef()
  const [webglError, setWebglError] = useState(false)
  const idleTimer = useRef(null)
  
  const hasModel = shoe?.model_file && 
    shoe.model_file !== '' && 
    shoe.model_file !== 'placeholder'

  // Auto-rotate: stop on interaction, resume after 3s
  const handleInteractionStart = useCallback(() => {
    setAutoRotate(false)
    if (idleTimer.current) clearTimeout(idleTimer.current)
  }, [])

  const handleInteractionEnd = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = setTimeout(() => setAutoRotate(true), 3000)
  }, [])

  // Camera view presets
  useEffect(() => {
    if (!controlsRef.current) return
    const views = {
      front:   { pos: [ 1.5,  0.8,  3.2], target: [0, 0, 0] },
      side:    { pos: [ 3.2,  0.6,  0.5], target: [0, 0, 0] },
      top:     { pos: [ 0.2,  3.5,  1.0], target: [0, 0, 0] },
      heel:    { pos: [-2.8,  0.8, -0.5], target: [0, 0, 0] },
      default: { pos: [ 1.8,  0.8,  2.8], target: [0, 0, 0] },
    }
    const v = views[cameraView] || views.default
    // Smooth transition would require animation - for now set directly
    controlsRef.current.object.position.set(...v.pos)
    controlsRef.current.target.set(...v.target)
    controlsRef.current.update()
  }, [cameraView])

  // Check WebGL support
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') || c.getContext('webgl')
      if (!gl) setWebglError(true)
    } catch { setWebglError(true) }
  }, [])

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🖥️</div>
          <h3 className="font-bold tracking-wider mb-2" style={{ color: 'var(--color-text)' }}>WebGL Not Supported</h3>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Your browser doesn't support 3D rendering. Try Chrome or Firefox.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }} ref={canvasRef}>
      <Canvas
        camera={{ position: [1.8, 0.8, 2.8], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
          preserveDrawingBuffer: true,
        }}
        style={{ background: 'var(--color-bg, #F5F3EF)' }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#F5F3EF'))
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <spotLight position={[0, 8, 0]} intensity={0.2} angle={0.4} penumbra={1} />

          {hasModel
            ? <ShoeModel modelPath={`/models/shoes/${shoe.model_file}`} />
            : <PlaceholderShoe />
          }

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={1.5}
            maxDistance={5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enableDamping={true}
            dampingFactor={0.05}
            onStart={handleInteractionStart}
            onEnd={handleInteractionEnd}
          />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -0.465, 0]}
            opacity={0.5}
            scale={5}
            blur={1.5}
            far={0.8}
            resolution={512}
            color="#000000"
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
