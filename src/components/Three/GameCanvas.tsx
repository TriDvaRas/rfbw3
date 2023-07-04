import { Loader, OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import Lights from "./GameField/Lights";
import Sun from "./GameField/Sun";
import { WaterPlane } from "./GameField/WaterPlane";
import { degreesToRadians } from "./util/util";
import { api } from "../../utils/api";
import { Tiles } from "./GameField/Tiles";
import { HomeIsland } from "./Models/HomeIsland";
import { SandPlane } from "./GameField/SandPlane";
import { degToRad } from "three/src/math/MathUtils";
import { useRef } from 'react';



const GameCanvas = () => {
  const { depth, rootY, rootX } = useControls({
    depth: {
      value: 4,
      min: 1,
      step: 1,
    },
    rootX: {
      value: 48,
      min: 2,
      step: 2,
    },
    rootY: {
      value: 48,
      min: 2,
      step: 2,
    },
  })
  const { rot } = useControls({ rot: 30 })
  const ref = useRef<any>(null!)
  const { data: me, status: meStatus } = api.players.getMyPlayer.useQuery()
  const { data: myTiles } = api.fieldNodes.getMy.useQuery()

  const mazeRoot: [number, number] = me?.fieldRoot.split(',').map(x => +x) as [number, number] || [0, 0]
  console.log("Root", me?.fieldRoot, mazeRoot);

  const { azimuthAngle, polarAngle } = useControls({
    azimuthAngle: {
      value: -120,
      min: -180,
      max: 180,
      step: 1,
    },
    polarAngle: {
      value: 40,
      min: -180,
      max: 180,
      step: 1,
    },
  })

  return (
    <div className="min-h-screen min-w-full ">
      <Canvas className="min-h-screen min-w-full" style={{ height: '100vh' }} >
        {/* <Environment preset="forest"  /> */}

        {myTiles && <Tiles playerTiles={myTiles} centerCoordinates={mazeRoot} />}
        <HomeIsland />
        {/* <Cloud position={[0, -20, 0]}
          opacity={0.5}
          speed={0.01} // Rotation speed
          width={200} // Width of the full cloud
          depthTest={true} // Disables the depthTest for the material, might be better for transparent objects
          depth={1.5} // Z-dir depth
          segments={240} // Number of particles
        /> */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls ref={ref} makeDefault enableRotate={true} minPolarAngle={degToRad(polarAngle)} maxPolarAngle={degToRad(polarAngle)} onChange={() => {
          ref.current.target.y = 0
          ref.current.object.position.y = 4.6
          console.log(ref.current.object);

        }} zoomSpeed={0.1} minZoom={1} maxZoom={2} minAzimuthAngle={degToRad(azimuthAngle)} maxAzimuthAngle={degToRad(azimuthAngle)} />
        <Sun />
        {/* <Moon /> */}
        <Lights />
        <WaterPlane />
        <SandPlane />
        <axesHelper scale={5} position={[0, 1.1, 0]} />
        {/* <Stats  /> */}
      </Canvas>
      <Loader />
    </div >

  );
}
export default GameCanvas;