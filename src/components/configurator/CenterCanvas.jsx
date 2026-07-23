"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { Suspense, useState, useRef, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { ShoeModel } from './ShoeModel';
import { PlaceholderShoe } from './PlaceholderShoe';
import { useConfiguratorStore } from '@/store/configuratorStore';
import { useToastStore } from '@/store/appStore';

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-2 border-[#E5E5E5] border-t-[#E85D26] rounded-full animate-spin" />
        <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#999]">Loading Model</span>
      </div>
    </Html>
  );
}

export function CenterCanvas({ activeStep }) {
  const { shoe, autoRotate, setAutoRotate, cameraView, setMaterial, setZoneColor } = useConfiguratorStore();
  const addToast = useToastStore(s => s.addToast);
  const canvasRef = useRef();
  const controlsRef = useRef();
  const [webglError, setWebglError] = useState(false);
  const idleTimer = useRef(null);
  
  const hasModel = shoe?.model_file && 
    shoe.model_file !== '' && 
    shoe.model_file !== 'placeholder';

  // Toggle Auto-rotate
  const toggleRotate = () => {
    setAutoRotate(!autoRotate);
    addToast(autoRotate ? 'Auto-rotate Paused' : 'Auto-rotate Active', 'info');
  };

  // Toggle Camera Zoom
  const toggleZoom = () => {
    if (!controlsRef.current) return;
    const currentDist = controlsRef.current.object.position.length();
    // Toggle distance between close-up (1.8) and baseline (3.2)
    const targetDist = currentDist > 2.4 ? 1.8 : 3.2;
    
    const dir = controlsRef.current.object.position.clone().normalize();
    controlsRef.current.object.position.copy(dir.multiplyScalar(targetDist));
    controlsRef.current.update();
    addToast('Camera Zoom Adjusted', 'info');
  };

  // Save/Screenshot Design
  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) { addToast('Canvas element not found', 'error'); return; }
    try {
      const link = document.createElement('a');
      link.download = `solecraft-design-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      addToast('Design screenshot saved!', 'success');
    } catch {
      addToast('Screenshot failed', 'error');
    }
  };

  const handleUpperColor = (hex) => {
    setZoneColor("Toe", hex);
    setZoneColor("Tongue", hex);
    setZoneColor("Heel", hex);
  };

  // Check WebGL support
  useEffect(() => {
    try {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2') || c.getContext('webgl');
      if (!gl) setWebglError(true);
    } catch { setWebglError(true); }
  }, []);

  if (webglError) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-[#F5F3EF]">
        <div className="text-center font-mono">
          <div className="text-5xl mb-4">🖥️</div>
          <h3 className="font-bold tracking-wider mb-2 text-[#111]">WebGL Not Supported</h3>
          <p className="text-sm text-[#666]">Your browser doesn't support 3D rendering. Try Chrome or Firefox.</p>
        </div>
      </div>
    );
  }

  // Pre-defined colors matching screenshot
  const leatherColors = [
    { name: "OFF-WHITE", hex: "#EAE6E1" },
    { name: "BLACK", hex: "#1C1C1C" },
    { name: "TAN", hex: "#B07D53" },
    { name: "NAVY", hex: "#2B3B4C" }
  ];

  const suedeColors = [
    { name: "TAUPE", hex: "#A59D96" },
    { name: "FOREST", hex: "#3E5346" },
    { name: "BLUSH", hex: "#D5B5AD" }
  ];

  return (
    <div className="w-full h-full relative" ref={canvasRef}>
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
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color('#F5F3EF'));
        }}
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 6, 5]}
            intensity={1.8}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-5, 3, -5]} intensity={0.4} />
          <spotLight position={[0, 8, 0]} intensity={0.2} angle={0.4} penumbra={1} />

          {/* Premium Pedestal/Podium */}
          <mesh position={[0, -0.475, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.9, 0.95, 0.05, 64]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.54, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.95, 0.98, 0.08, 64]} />
            <meshStandardMaterial color="#EAEAEA" roughness={0.2} metalness={0.1} />
          </mesh>

          {/* Glowing neon accent ring */}
          <mesh position={[0, -0.445, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.88, 0.012, 16, 100]} />
            <meshBasicMaterial color="#E85D26" toneMapped={false} />
          </mesh>

          {hasModel
            ? <ShoeModel modelPath={`/models/shoes/${shoe.model_file}`} />
            : <PlaceholderShoe />
          }

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            minDistance={1.4}
            maxDistance={4.5}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 1.8}
            autoRotate={autoRotate}
            autoRotateSpeed={1.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
          <Environment preset="studio" />
          <ContactShadows
            position={[0, -0.46, 0]}
            opacity={0.4}
            scale={4}
            blur={1.5}
            far={0.6}
            resolution={512}
            color="#000000"
          />
        </Suspense>
      </Canvas>

      {/* Floating Material/Color Swatches Overlay at Bottom Center */}
      {activeStep === 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 select-none pointer-events-auto max-w-[90%] md:max-w-none">
          {/* LEATHER CARD */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E0DED7] p-4 px-5 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-[8px] tracking-[0.2em] font-bold text-[#888] mb-2.5">LEATHER</span>
            <div className="flex gap-3">
              {leatherColors.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => { setMaterial('leather'); handleUpperColor(c.hex); }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full border border-black/10 transition-transform group-hover:scale-105" style={{ backgroundColor: c.hex }} />
                  <span className="text-[7px] tracking-wider text-[#666] mt-1.5 uppercase font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SUEDE CARD */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E0DED7] p-4 px-5 rounded-2xl flex flex-col items-center shadow-lg">
            <span className="text-[8px] tracking-[0.2em] font-bold text-[#888] mb-2.5">SUEDE</span>
            <div className="flex gap-3">
              {suedeColors.map(c => (
                <button 
                  key={c.name} 
                  onClick={() => { setMaterial('suede'); handleUpperColor(c.hex); }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full border border-black/10 transition-transform group-hover:scale-105" style={{ backgroundColor: c.hex }} />
                  <span className="text-[7px] tracking-wider text-[#666] mt-1.5 uppercase font-semibold">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Control Buttons (Zoom, Rotate, Save) in Bottom Right */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-5 items-center font-mono select-none pointer-events-auto">
        {/* Zoom */}
        <button 
          onClick={toggleZoom}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
          aria-label="Zoom Camera"
        >
          <div className="w-11 h-11 bg-white border border-[#E0DED7] rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-[#666] mt-1.5 uppercase">Zoom</span>
        </button>

        {/* Rotate */}
        <button 
          onClick={toggleRotate}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
          aria-label="Toggle Rotation"
        >
          <div className={`w-11 h-11 border border-[#E0DED7] rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105 ${autoRotate ? 'bg-[#111] text-white' : 'bg-white text-[#111]'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
            </svg>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-[#666] mt-1.5 uppercase">Rotate</span>
        </button>

        {/* Save */}
        <button 
          onClick={handleScreenshot}
          className="flex flex-col items-center group cursor-pointer focus:outline-none"
          aria-label="Save Screenshot"
        >
          <div className="w-11 h-11 bg-white border border-[#E0DED7] rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
            <svg className="w-5 h-5 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </div>
          <span className="text-[8px] font-bold tracking-widest text-[#666] mt-1.5 uppercase">Save</span>
        </button>
      </div>

    </div>
  );
}
