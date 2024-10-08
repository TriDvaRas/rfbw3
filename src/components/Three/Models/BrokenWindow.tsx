/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -T -t -o src/components/Three/Models/BrokenWindow.tsx garbage/models/BrokenWindow.glb
Broken window by Justin Randall [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/a_Q2-bs4zu9)
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    ['Node-Mesh']: THREE.Mesh
    ['Node-Mesh_1']: THREE.Mesh
  }
  materials: {
    mat24: THREE.MeshStandardMaterial
    mat20: THREE.MeshStandardMaterial
  }
}

export function BrokenWindow(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/BrokenWindow-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes['Node-Mesh'].geometry} material={materials.mat24} />
      <mesh geometry={nodes['Node-Mesh_1'].geometry} material={materials.mat20} />
    </group>
  )
}

useGLTF.preload('/BrokenWindow-transformed.glb')
