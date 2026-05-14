import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
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

export function PlaceholderShoe(props) {
  const { nodes, materials } = useGLTF('/models/shoes/shoe-draco.glb')
  const { colorZones, selectedMaterial } = useConfiguratorStore()
  
  const matProps = MATERIAL_PROPS[selectedMaterial] || MATERIAL_PROPS.leather

  const soleColor   = colorZones.Sole   || '#1A1A2E'
  const upperColor  = colorZones.Toe    || '#F0F0F0'
  const tongueColor = colorZones.Tongue || '#5233C8'
  const heelColor   = colorZones.Heel   || '#E85D26'
  const lacesColor  = colorZones.Laces  || '#D8D0B8'

  // Apply colors to the existing materials
  // We don't want to mutate the global loaded materials directly on every render in a way that breaks,
  // but since we are overriding their color property entirely, it's fine.
  // A safer React Three Fiber way is to clone them or just assign colors.
  
  const applyProps = (colorStr, applyMatProps = true) => ({
    color: new THREE.Color(colorStr),
    ...(applyMatProps ? matProps : { roughness: 0.8, metalness: 0.1 })
  })

  return (
    <group {...props} dispose={null} position={[0, 0.4, 0]} rotation={[0, -Math.PI / 4, 0]} scale={[0.7, 0.7, 0.7]}>
      <mesh geometry={nodes.shoe.geometry} material-color={lacesColor} />
      <mesh geometry={nodes.shoe_1.geometry} material-color={upperColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
      <mesh geometry={nodes.shoe_2.geometry} material-color={upperColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
      <mesh geometry={nodes.shoe_3.geometry} material-color={tongueColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
      <mesh geometry={nodes.shoe_4.geometry} material-color={soleColor} material-roughness={0.8} material-metalness={0.1} />
      <mesh geometry={nodes.shoe_5.geometry} material-color={heelColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
      <mesh geometry={nodes.shoe_6.geometry} material-color={tongueColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
      <mesh geometry={nodes.shoe_7.geometry} material-color={heelColor} material-roughness={matProps.roughness} material-metalness={matProps.metalness} />
    </group>
  )
}

useGLTF.preload('/models/shoes/shoe-draco.glb')
