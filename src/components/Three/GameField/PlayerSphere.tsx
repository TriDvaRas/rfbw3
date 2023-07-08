import { Float, Html, Select, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Outline, Selection, SelectiveBloom, Vignette } from "@react-three/postprocessing";
import { useControls } from "leva";
import { BlendFunction, KernelSize } from "postprocessing";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { BiCube, BiPyramid } from "react-icons/bi";
import { TbOctahedron, TbSphere } from "react-icons/tb";
import * as THREE from "three";
import { Euler, Mesh, Vector2 } from "three";
import { api } from "../../../utils/api";
import { PlayerSphereType } from "@prisma/client";
import { toast } from "react-toastify";
import { useOnClickOutside } from "usehooks-ts";
import Trpc from "../../../pages/api/trpc/[trpc]";
import { Column } from "../Models/Column";
export default function PlayerSphere() {
  const { data: myPlayer } = api.players.getMyPlayer.useQuery()
  if (!myPlayer || !myPlayer.imageUrl) return null
  return <_PlayerSphere imageUrl={myPlayer.imageUrl} sphereType={myPlayer.sphereType} />
}

function _PlayerSphere(props: { imageUrl: string, sphereType: PlayerSphereType }) {

  const texture = useTexture(`/api/imageProxy/${encodeURIComponent(props.imageUrl)}`)
  const ref = useRef<Mesh>(null!)
  const [geometry, setGeometry] = useState<PlayerSphereType>(props.sphereType);
  const [showPopup, setShowPopup] = useState(false);

  // Mapping the geometries to their constructors
  const geometryConstructors = {
    sphere: <sphereGeometry args={[0.7, 32, 32]} />,
    pyramid: <coneGeometry args={[0.85, 0.85, 4]} />,
    octahedron: <octahedronGeometry args={[0.85, 0]} />,
    cube: <boxGeometry args={[0.92, 0.92, 0.92]} />
  };
  const defaultRotations = {
    sphere: [0, 2.57, 0.7],
    pyramid: [0, 0, 0],
    octahedron: [0, 0, 0],
    cube: [0, 0, 0],
  }
  const textures = {
    sphere: new THREE.Texture(texture.image),
    pyramid: new THREE.Texture(texture.image),
    octahedron: new THREE.Texture(texture.image),
    cube: new THREE.Texture(texture.image)
  }
  // set different offsets for each texture
  textures.sphere.offset = new Vector2(0, 0);    // customize these values
  textures.pyramid.offset = new Vector2(-1 / 7, 0.3);   // customize these values
  textures.cube.offset = new Vector2(0, 0);       // customize these values
  textures.octahedron.offset = new Vector2(-0.12, -0.08); // customize these values

  // update all textures
  for (const key in textures) {
    if (Object.prototype.hasOwnProperty.call(textures, key)) {
      //@ts-ignore
      textures[key].needsUpdate = true;
      //@ts-ignore
      textures[key].wrapS = THREE.RepeatWrapping; // Enable texture wrap in the S direction
      //@ts-ignore
      textures[key].wrapT = THREE.RepeatWrapping; // Enable texture wrap in the T direction
    }
  }



  // const { x, y } = useControls({
  //   x: { min: -1, max: 1, value: 0 },
  //   y: { min: -1, max: 1, value: 0 },
  // })
  // useEffect(() => {
  //   textures.octahedron.offset = new Vector2(x, y);
  //   textures.octahedron.needsUpdate = true;
  // }, [x, y])
  useFrame(({ clock }) => {
    if (geometry === "sphere") {
      textures['sphere'].offset.x = ((Date.now() / 10000) % 10000) * -0.3;
      textures['sphere'].offset.y = -0.07;
      // textures['sphere'].needsUpdate = true;
    }
    else {
      // ref.current.rotation.x += 0.003
      ref.current.rotation.y = ((Date.now() / 10000) % 10000) * 2.3;
      // ref.current.rotation.z -= 0.0001
    }
  })
  const { scene } = useThree()
  const PopupWithProviders = api.withTRPC(() => { return (<Popup prevGeometry={props.sphereType} geometry={geometry} close={() => setShowPopup(false)} setGeometry={setGeometry} />) as any })
  return (
    <>
      <Html position={[-0, 1.2, -0]}>
        <>
          {showPopup && <PopupWithProviders />}
        </>
      </Html>
      <Column position={[0, 0.6, 0]} scale={0.375}/>
      <Float floatIntensity={1} rotationIntensity={0.13} >
        <pointLight position={[0, 1.2, 0]} intensity={0.15} />

        <mesh scale={[0.5, .5, .5]} position={[0, 2.4, 0]} ref={ref} rotation={defaultRotations[geometry] as unknown as Euler} onClick={() => setShowPopup(true)}>
          {geometryConstructors[geometry]}


          <meshBasicMaterial attach="material" >
            <primitive attach="map" object={textures[geometry]} />
          </meshBasicMaterial >
        </mesh>
        {/* <mesh scale={0.99} position={[0, 2, 0]} ref={ref1} rotation={defaultRotations[geometry] as unknown as Euler} onClick={() => setShowPopup(true)}>
          {geometryConstructors[geometry]}
          <meshBasicMaterial attach="material"  color={'#ffffff'}/>
        </mesh> */}
      </Float>
    </>
  )
}

type Props = {
  close: () => void,
  prevGeometry: PlayerSphereType,
  geometry: PlayerSphereType,
  setGeometry: Dispatch<SetStateAction<PlayerSphereType>>
};

function Popup({ close: _close, setGeometry, prevGeometry, geometry }: Props) {
  const { mutate, isLoading } = api.players.updateMyPlayerSphereType.useMutation()

  const ref = useRef<HTMLDivElement>(null!)

  useOnClickOutside(ref, () => close(geometry))
  function close(newShape: PlayerSphereType) {

    _close()
    mutate(newShape, {
      onSuccess: () => {
        toast.success(`Форма успешно обновлена`)
        // close()
      },
      onError: (e) => {
        setGeometry(prevGeometry)
        toast.error(`Не удалось сохранить форму: ${e.message}`)
      }
    })
  }
  function onShapeChange(shape: PlayerSphereType) {
    setGeometry(shape)

  }
  return (
    <div ref={ref} className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-cyan-700 bg-opacity-70 p-3 rounded-lg shadow-lg">
        {/* <h2 className="text-lg text-center font-bold mb-4 text-white">Форма</h2> */}
        <div className="flex flex-row justify-center items-center gap-1">
          <button className="btn btn-circle btn-success" onClick={() => { onShapeChange("sphere"); }}><TbSphere /></button>
          <button className="btn btn-circle btn-success" onClick={() => { onShapeChange("pyramid"); }}><BiPyramid /></button>
          <button className="btn btn-circle btn-success" onClick={() => { onShapeChange("cube"); }}><BiCube /></button>
          <button className="btn btn-circle btn-success" onClick={() => { onShapeChange("octahedron"); }}><TbOctahedron /></button>
        </div>
      </div>
    </div>
  );
}