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

export function PlaceholderShoe({ clay = false, ...props }) {
  const { nodes } = useGLTF('/models/shoes/shoe-draco.glb')
  const { colorZones, selectedMaterial } = useConfiguratorStore()
  
  const matProps = MATERIAL_PROPS[selectedMaterial] || MATERIAL_PROPS.leather

  // Default color zoning or neutral clay look
  const soleColor   = clay ? '#E8E6DF' : (colorZones.Sole   || '#1A1A2E')
  const upperColor  = clay ? '#F5F3EF' : (colorZones.Toe    || '#F0F0F0')
  const tongueColor = clay ? '#F5F3EF' : (colorZones.Tongue || '#5233C8')
  const heelColor   = clay ? '#E8E6DF' : (colorZones.Heel   || '#E85D26')
  const lacesColor  = clay ? '#FFFFFF' : (colorZones.Laces  || '#D8D0B8')

  return (
    <group {...props} dispose={null} position={props.position || [0, 0.4, 0]} rotation={props.rotation || [0, -Math.PI / 4, 0]} scale={props.scale || [0.7, 0.7, 0.7]}>
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
