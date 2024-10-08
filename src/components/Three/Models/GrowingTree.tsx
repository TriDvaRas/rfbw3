/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -T -t -o src/components/Three/Models/GrowingTree.tsx garbage/models/GrowingTree.glb
This work is based on "Polygon Tree Pack" (https://sketchfab.com/3d-models/polygon-tree-pack-36dacc2aeacb4f9f94385f63b978c3ca) by StreakByte (https://sketchfab.com/StreakByte) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object_271: THREE.Mesh
    Object_597001: THREE.Mesh
  }
  materials: {
    ['brown.004']: THREE.MeshStandardMaterial
    ['light_green.001']: THREE.MeshStandardMaterial
  }
}

export function GrowingTree(props: JSX.IntrinsicElements['group'] & { headless?: boolean, color?: string }) {
  const { nodes, materials } = useGLTF('/GrowingTree-transformed.glb') as GLTFResult
  const headMat = materials['light_green.001'].clone()
  if (props.color)
    headMat.color = new THREE.Color(props.color)
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Object_271.geometry} material={materials['brown.004']} scale={0.171} />
      <mesh geometry={nodes.Object_597001.geometry} material={headMat} position={[-0.238, -0.066, -0.001]} rotation={[-1.847, 0.95, 0.274]} scale={0.171} />
    </group>
  )
}

useGLTF.preload('/GrowingTree-transformed.glb')
