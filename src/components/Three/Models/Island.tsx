/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -T -t -o src/components/Three/Models/Island.tsx garbage/models/Island.gltf
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    mesh_0: THREE.Mesh
    mesh_0_1: THREE.Mesh
  }
  materials: {
    Dirt: THREE.MeshStandardMaterial
    Grass: THREE.MeshStandardMaterial
  }
}

export function Island(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/Island-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null} scale={2}>
      <mesh geometry={nodes.mesh_0.geometry} material={materials.Dirt} />
      <mesh geometry={nodes.mesh_0_1.geometry} material={materials.Grass} />
    </group>
  )
}

useGLTF.preload('/Island-transformed.glb')
