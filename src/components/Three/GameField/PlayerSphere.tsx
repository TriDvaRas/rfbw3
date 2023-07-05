import { api } from "../../../utils/api"
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Float, Html, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ImSphere } from "react-icons/im";
import { BiPyramid, BiCube } from "react-icons/bi";
import { TbOctahedron, TbSphere } from "react-icons/tb";
import { Euler, Mesh } from "three";

export default function PlayerSphere() {
  const { data: myPlayer } = api.players.getMyPlayer.useQuery()
  if (!myPlayer || !myPlayer.imageUrl) return null
  return <_PlayerSphere imageUrl={myPlayer.imageUrl} />
}

function _PlayerSphere(props: { imageUrl: string }) {

  const texture = useTexture(`/api/imageProxy/${encodeURIComponent(props.imageUrl)}`)
  const ref = useRef<Mesh>(null!)
  const [geometry, setGeometry] = useState<"sphere" | "pyramid" | "octahedron" | "cube">("pyramid");
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

  useFrame(() => {
    // ref.current.rotation.x += 0.003
    ref.current.rotation.y += 0.002
    // ref.current.rotation.z -= 0.0001
  })

  return (
    <>
      <Html>
        {showPopup && <Popup close={() => setShowPopup(false)} setGeometry={setGeometry} />}
      </Html>
      <Float floatIntensity={1} rotationIntensity={1} >
        <pointLight position={[0, 2, 0]} intensity={0.1} />
        <mesh position={[0, 2, 0]} ref={ref} rotation={defaultRotations[geometry]as unknown as Euler} onClick={() => setShowPopup(true)}>
          {geometryConstructors[geometry]}
          <meshBasicMaterial attach="material">
            <primitive attach="map" object={texture} />
          </meshBasicMaterial>
        </mesh>
      </Float>
    </>
  )
}

type Props = {
  close: () => void,
  setGeometry: Dispatch<SetStateAction<"sphere" | "pyramid" | "octahedron" | "cube">>
};

function Popup({ close, setGeometry }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-cyan-700 bg-opacity-70 p-4 rounded-lg shadow-lg">
        <h2 className="text-lg text-center font-bold mb-4 text-white">Форма</h2>
        <div className="flex flex-row justify-center items-center gap-1">

          <button className="btn btn-circle btn-success" onClick={() => { setGeometry("sphere"); close(); }}><TbSphere /></button>
          <button className="btn btn-circle btn-success" onClick={() => { setGeometry("pyramid"); close(); }}><BiPyramid /></button>
          <button className="btn btn-circle btn-success" onClick={() => { setGeometry("cube"); close(); }}><BiCube /></button>
          <button className="btn btn-circle btn-success" onClick={() => { setGeometry("octahedron"); close(); }}><TbOctahedron /></button>
        </div>
      </div>
    </div>
  );
}