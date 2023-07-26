import { Loader, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer, HueSaturation, Noise, Vignette } from '@react-three/postprocessing';
import { useControls } from "leva";
import { BlendFunction, KernelSize } from 'postprocessing';
import { useRef } from 'react';
import { degToRad } from "three/src/math/MathUtils";
import { useLocalStorage } from "usehooks-ts";
import { api } from "../../utils/api";
import Lights from "./GameField/Lights";
import Moon from "./GameField/Moon";
import { MyFieldTiles } from "./GameField/MyFieldTiles";
import PlayerSphere from "./GameField/PlayerSphere";
import { SandPlane } from "./GameField/SandPlane";
import Sun from "./GameField/Sun";
import { WaterPlane } from "./GameField/WaterPlane";
import { HomeIsland } from "./Models/HomeIsland";
import { TreeStump } from "./Models/TreeStump";
import { TileDetailsShowMode } from "../../types/common";
import { Button, Swap } from "react-daisyui";
import { AiFillHome } from "react-icons/ai";
import { MdVisibilityOff, MdVisibility } from 'react-icons/md'
const DEFAULT_CAMERA_HEIGHT = 15

const GameCanvas = () => {
  const ref = useRef<any>(null!)
  const { data: me, status: meStatus } = api.players.getMyPlayer.useQuery()
  const { data: myTiles } = api.playerContent.getMy.useQuery()
  const [cameraHeight, setCameraHeight] = useLocalStorage('cameraHeight', DEFAULT_CAMERA_HEIGHT)
  const mazeRoot: [number, number] = me?.fieldRoot.split(',').map(x => +x) as [number, number] || [0, 0]
  const [zoom, setZoom] = useLocalStorage('fov', 1)

  // const { azimuthAngle, polarAngle } = useControls({
  //   azimuthAngle: {
  //     value: -120,
  //     min: -180,
  //     max: 180,
  //     step: 1,
  //   },
  //   polarAngle: {
  //     value: 40,
  //     min: -180,
  //     max: 180,
  //     step: 1,
  //   },
  // })
  const polarAngle = 40
  const azimuthAngle = -120
  // const {saturation} = useControls("effects", {
  //   saturation: {
  //     value: 0,
  //     min: -1,
  //     max: 1,
  //     step: 0.01,
  //   },
  // })
  // const CanvasWithTRPC = api.withTRPC(() => )

  return (
    <div className="min-h-screen min-w-full ">
      <Canvas className="min-h-screen min-w-full"
        shadows
        camera={{ position: [0, cameraHeight, 0], fov: 60, near: 0.1, far: 1000 }}
        style={{ height: '100vh' }}
        onWheel={(e) => {
          //increase or decrease camera height
          const y = Math.min(Math.max(0.8, zoom - 0.1 * Math.sign(e.deltaY)), 3)
          // console.log('y', y);
          // console.log('ref.current', ref.current);
          ref.current.object.zoom = y
          setZoom(y)
          // setCameraHeight(y)
          // canvasRef.current.camera.zoom = y
          // ref.current.object.position.y = cameraHeight
        }}>
        {/* <CanvasWithTRPC /> */}
        <group>
          {/* <PerspectiveCamera makeDefault position={[0, 0, 0]} fov={fov} /> */}
          {/* <Environment preset="forest"  /> */}
          <PlayerSphere />
          {myTiles && <MyFieldTiles playerTiles={myTiles} centerCoordinates={mazeRoot} />}
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
          <OrbitControls ref={ref} makeDefault
            enableRotate={true}
            enableZoom={false}
            minPolarAngle={degToRad(polarAngle)}
            maxPolarAngle={degToRad(polarAngle)}
            onChange={() => {
              ref.current.target.y = 0
              ref.current.object.position.y = cameraHeight
            }}
            minAzimuthAngle={degToRad(azimuthAngle)}
            maxAzimuthAngle={degToRad(azimuthAngle)}
          />
          <Sun />
          <Moon />
          <Lights />
          <WaterPlane />
          <SandPlane />
          {/* <axesHelper scale={5} position={[0, 1.1, 0]} /> */}
          <Stats />
        </group>
        <EffectComposer>
          <Bloom
            blendFunction={BlendFunction.COLOR_DODGE} // blend mode
            kernelSize={KernelSize.SMALL} // kernel size
            luminanceThreshold={0.52} // luminance threshold
            luminanceSmoothing={0.55} // luminance smoothing
            height={400} // resolution scale factor
            intensity={1}
          />

          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.05} darkness={0.9} />
          <HueSaturation blendFunction={BlendFunction.NORMAL} saturation={0.15} />
        </EffectComposer>
      </Canvas>
      <Loader />
    </div >

  );
}
export default GameCanvas;