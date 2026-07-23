import { useGLTF } from '@react-three/drei'
import { useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useConfiguratorStore } from '../../store/configuratorStore'

const MATERIAL_PROPS = {
  leather: { roughness: 0.4, metalness: 0.1, envMapIntensity: 0.8 },
  suede:   { roughness: 0.9, metalness: 0.0, envMapIntensity: 0.3 },
  mesh:    { roughness: 0.3, metalness: 0.3, envMapIntensity: 1.0 },
  canvas:  { roughness: 0.8, metalness: 0.0, envMapIntensity: 0.4 },
  patent:  { roughness: 0.1, metalness: 0.6, envMapIntensity: 1.5 },
  knit:    { roughness: 0.5, metalness: 0.0, envMapIntensity: 0.5 },
}

// Helper to calculate true bounding box ignoring hidden background meshes
function computeVisibleBox(scene) {
  const box = new THREE.Box3()
  box.makeEmpty()
  scene.updateMatrixWorld(true)
  scene.traverse((child) => {
    if (child.isMesh && child.visible) {
      if (!child.geometry.boundingBox) child.geometry.computeBoundingBox()
      const childBox = child.geometry.boundingBox.clone()
      childBox.applyMatrix4(child.matrixWorld)
      box.union(childBox)
    }
  })
  return box
}

export function ShoeModel({ modelPath }) {
  const primaryGLTF = useGLTF(modelPath)
  const dracoGLTF = useGLTF('/models/shoes/shoe-draco.glb')
  
  const { colorZones, selectedMaterial, accessories } = useConfiguratorStore()
  const materialsRef = useRef({})
  const assignedMaterials = useRef({}) // Maps original material UUIDs for SkinnedMeshes

  const scene = primaryGLTF?.scene;

  // Determine if the primary shoe model is fully paintable/split
  // If it has <= 2 meshes, it's a merged single-mesh model which cannot be configured separately.
  let meshCount = 0;
  if (scene) {
    scene.traverse((child) => {
      if (child.isMesh && child.visible) {
        meshCount++;
      }
    });
  }
  const isMergedModel = meshCount <= 2;

  // Robust mathematical normalization: calculate scale and offset to perfectly center ANY model
  const { scale, offset } = useMemo(() => {
    if (!scene) return { scale: 1.5, offset: [0, 0, 0] }
    
    // Ensure scene is at default transform to measure raw geometry
    scene.scale.set(1, 1, 1)
    scene.position.set(0, 0, 0)
    scene.rotation.set(0, 0, 0)

    // Pre-hide environment garbage (backdrops, floors, studio lights) before calculating scale
    scene.traverse((child) => {
      if (child.isMesh) {
        const lowerName = (child.name || '').toLowerCase()
        if (lowerName.includes('backdrop') || lowerName.includes('floor') || lowerName.includes('ground') || lowerName.includes('light') || lowerName.includes('studio') || lowerName.includes('environment')) {
          child.visible = false
        }
      }
    })

    const box = computeVisibleBox(scene)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    
    if (size.length() === 0) return { scale: 1.5, offset: [0, 0, 0] }

    const maxDim = Math.max(size.x, size.y, size.z)
    const optimalScale = maxDim > 0 ? 2.2 / maxDim : 1.5

    return {
      scale: optimalScale,
      offset: [
        -center.x * optimalScale,
        -box.min.y * optimalScale, // Align bottom to Y=0
        -center.z * optimalScale
      ]
    }
  }, [scene])

  const zoneKeys = ['Toe', 'Sole', 'Tongue', 'Heel', 'Laces']

  useEffect(() => {
    if (!scene || isMergedModel) return
    const matProps = MATERIAL_PROPS[selectedMaterial] || MATERIAL_PROPS.leather

    let sequentialIndex = 0

    // Compute overall bounds for spatial heuristic mapping, ignoring the hidden environment
    const sceneBox = computeVisibleBox(scene)
    const sceneSize = sceneBox.getSize(new THREE.Vector3())
    const lengthAxis = sceneSize.z > sceneSize.x ? 'z' : 'x'

    scene.traverse((child) => {
      if (!child.isMesh || !child.visible) return

      // Handle visibility of accessory meshes
      const lowerName = (child.name || '').toLowerCase()
      if (lowerName.includes('logo')) child.visible = !!accessories.logo
      if (lowerName.includes('strap')) child.visible = !!accessories.ankleStrap
      if (lowerName.includes('reflective')) child.visible = !!accessories.reflectiveStrip

      // Determine explicit zone from mesh name
      const checkKeywords = (name) => {
        if (!name) return null;
        const n = name.toLowerCase();
        if (n.includes('sole') || n.includes('bottom')) return 'Sole';
        if (n.includes('lace')) return 'Laces';
        if (n.includes('tongue')) return 'Tongue';
        if (n.includes('heel') || n.includes('back')) return 'Heel';
        if (n.includes('toe') || n.includes('front')) return 'Toe';
        return null;
      };

      let explicitZone = null;
      if (colorZones[child.name]) explicitZone = child.name;
      else explicitZone = checkKeywords(child.name);

      const applyColorToMaterial = (originalMat, arrayIndex = null) => {
        if (!originalMat) return originalMat;

        let assignedZone = null;
        
        // 1. Try material name keywords FIRST (most specific for sub-materials inside a mesh)
        if (originalMat.name) {
            assignedZone = checkKeywords(originalMat.name);
        }
        
        // 2. Try mesh name keywords SECOND
        if (!assignedZone) {
            assignedZone = explicitZone;
        }
        
        // 3. Fallback for material arrays on a single consolidated mesh (distribute them sequentially)
        if (!assignedZone && arrayIndex !== null && Array.isArray(child.material)) {
            assignedZone = zoneKeys[arrayIndex % zoneKeys.length];
        }
        
        // 4. SKINNED MESH FALLBACK:
        // SkinnedMeshes have invalid Box3 geometry at rest. We must use sequential grouping by material UUID.
        if (!assignedZone && child.isSkinnedMesh) {
          if (assignedMaterials.current[originalMat.uuid]) {
            assignedZone = assignedMaterials.current[originalMat.uuid];
          } else {
            assignedZone = zoneKeys[sequentialIndex % zoneKeys.length];
            assignedMaterials.current[originalMat.uuid] = assignedZone;
            sequentialIndex++;
          }
        }
        
        // 5. ADVANCED SPATIAL HEURISTIC MAPPING FOR REGULAR MESHES:
        // Breaks apart meshes that share a single material based on their physical location.
        if (!assignedZone && !child.isSkinnedMesh) {
            const meshBox = new THREE.Box3().setFromObject(child);
            const meshCenter = meshBox.getCenter(new THREE.Vector3());
            
            // Calculate relative position of this specific mesh inside the overall shoe (0.0 to 1.0)
            const relY = sceneSize.y > 0 ? (meshCenter.y - sceneBox.min.y) / sceneSize.y : 0.5;
            const relL = sceneSize[lengthAxis] > 0 ? (meshCenter[lengthAxis] - sceneBox.min[lengthAxis]) / sceneSize[lengthAxis] : 0.5;
            
            if (relY < 0.3) {
                assignedZone = 'Sole';
            } else if (relY > 0.7) {
                assignedZone = 'Laces';
            } else if (relL > 0.6) {
                assignedZone = 'Toe';
            } else if (relL < 0.4) {
                assignedZone = 'Heel';
            } else {
                assignedZone = 'Tongue';
            }
        }

        // Final failsafe
        if (!assignedZone) {
            assignedZone = 'Tongue';
        }

        const color = colorZones[assignedZone];
        if (!color) return originalMat;

        // Use a unique key for the cloned material per mesh to avoid sharing mutated clones
        const matKey = child.uuid + (arrayIndex !== null ? `_${arrayIndex}` : '');
        
        if (!materialsRef.current[matKey]) {
          materialsRef.current[matKey] = originalMat.clone();
        }
        
        const mat = materialsRef.current[matKey];
        mat.color.set(new THREE.Color(color));
        
        mat.map = null;
        mat.emissiveMap = null;
        mat.vertexColors = false; // Bypass baked vertex colors to support direct UI customizer coloring
        if (mat.emissive) mat.emissive.setHex(0x000000);

        mat.roughness = matProps.roughness;
        mat.metalness = matProps.metalness;
        mat.envMapIntensity = matProps.envMapIntensity;
        mat.needsUpdate = true;
        
        return mat;
      }

      if (Array.isArray(child.material)) {
        child.material = child.material.map((m, i) => applyColorToMaterial(m, i));
      } else {
        child.material = applyColorToMaterial(child.material);
      }
      
      child.castShadow = true
      child.receiveShadow = true
    })
  }, [colorZones, selectedMaterial, accessories, scene, isMergedModel])

  // ─── DYNAMIC SWAP FALLBACK FOR MERGED MODELS ───
  // If the model is not split into customizable parts, render the high-fidelity split Draco model
  // to guarantee the user is able to customize Laces, Sole, Tongue, Upper, Heel separately!
  if (isMergedModel && dracoGLTF) {
    const { nodes } = dracoGLTF;
    const matProps = MATERIAL_PROPS[selectedMaterial] || MATERIAL_PROPS.leather;
    
    const soleColor   = colorZones.Sole   || '#1A1A2E';
    const upperColor  = colorZones.Toe    || '#F0F0F0';
    const tongueColor = colorZones.Tongue || '#5233C8';
    const heelColor   = colorZones.Heel   || '#E85D26';
    const lacesColor  = colorZones.Laces  || '#D8D0B8';

    return (
      <group position={[0, -0.465, 0]}>
        <group rotation={[0, Math.PI / 6, 0]} scale={[1.4, 1.4, 1.4]} position={[0, 0.45, 0]}>
          <mesh geometry={nodes.shoe.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={lacesColor} roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh geometry={nodes.shoe_1.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={upperColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
          <mesh geometry={nodes.shoe_2.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={upperColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
          <mesh geometry={nodes.shoe_3.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={tongueColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
          <mesh geometry={nodes.shoe_4.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={soleColor} roughness={0.8} metalness={0.1} />
          </mesh>
          <mesh geometry={nodes.shoe_5.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={heelColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
          <mesh geometry={nodes.shoe_6.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={tongueColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
          <mesh geometry={nodes.shoe_7.geometry} castShadow receiveShadow>
            <meshStandardMaterial color={heelColor} roughness={matProps.roughness} metalness={matProps.metalness} envMapIntensity={matProps.envMapIntensity} />
          </mesh>
        </group>
      </group>
    );
  }

  // Render primary split model
  return (
    <group position={[0, -0.465, 0]}>
      <group rotation={[0, Math.PI / 6, 0]}>
        <group position={offset}>
          <primitive object={scene} scale={scale} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/shoes/shoe-draco.glb')
