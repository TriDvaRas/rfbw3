/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.3 -T -t -o src/components/Three/Models/GamingComputer.tsx garbage/models/GamingComputer.glb
Gaming Computer by Alex Safayan [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/5cN7W4ufoII)
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    mesh549538436: THREE.Mesh
    mesh549538436_1: THREE.Mesh
    mesh549538436_2: THREE.Mesh
    group706968164: THREE.Mesh
    group997898928: THREE.Mesh
    group676697694: THREE.Mesh
    group194524521: THREE.Mesh
    group1799644813: THREE.Mesh
    group1186992705: THREE.Mesh
    group1722992837: THREE.Mesh
    group1817044955: THREE.Mesh
    group1004135894: THREE.Mesh
    group1809112506: THREE.Mesh
    group1051984110: THREE.Mesh
    group833559944: THREE.Mesh
    group1754797367: THREE.Mesh
  }
  materials: {
    mat23: THREE.MeshStandardMaterial
    mat8: THREE.MeshStandardMaterial
    mat24: THREE.MeshStandardMaterial
    mat17: THREE.MeshStandardMaterial
    mat16: THREE.MeshStandardMaterial
    mat21: THREE.MeshStandardMaterial
    mat3: THREE.MeshStandardMaterial
    mat10: THREE.MeshStandardMaterial
    mat9: THREE.MeshStandardMaterial
    mat15: THREE.MeshStandardMaterial
    mat22: THREE.MeshStandardMaterial
    mat11: THREE.MeshStandardMaterial
    mat12: THREE.MeshStandardMaterial
    mat5: THREE.MeshStandardMaterial
    mat13: THREE.MeshStandardMaterial
    mat2: THREE.MeshStandardMaterial
  }
}

export function GamingComputer(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/GamingComputer-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.group706968164.geometry} material={materials.mat17} />
      <mesh geometry={nodes.group997898928.geometry} material={materials.mat16} />
      <mesh geometry={nodes.group676697694.geometry} material={materials.mat21} />
      <mesh geometry={nodes.group194524521.geometry} material={materials.mat3} />
      <mesh geometry={nodes.group1799644813.geometry} material={materials.mat10} />
      <mesh geometry={nodes.group1186992705.geometry} material={materials.mat9} />
      <mesh geometry={nodes.group1722992837.geometry} material={materials.mat15} />
      <mesh geometry={nodes.group1817044955.geometry} material={materials.mat22} />
      <mesh geometry={nodes.group1004135894.geometry} material={materials.mat11} />
      <mesh geometry={nodes.group1809112506.geometry} material={materials.mat12} />
      <mesh geometry={nodes.group1051984110.geometry} material={materials.mat5} />
      <mesh geometry={nodes.group833559944.geometry} material={materials.mat13} />
      <mesh geometry={nodes.group1754797367.geometry} material={materials.mat2} />
      <mesh geometry={nodes.mesh549538436.geometry} material={materials.mat23} />
      <mesh geometry={nodes.mesh549538436_1.geometry} material={materials.mat8} />
      <mesh geometry={nodes.mesh549538436_2.geometry} material={materials.mat24} />
    </group>
  )
}

useGLTF.preload('/GamingComputer-transformed.glb')
