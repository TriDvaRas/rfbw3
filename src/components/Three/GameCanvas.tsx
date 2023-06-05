import { Loader, OrbitControls, Stars, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useControls } from "leva";
import useSWR from "swr";
import Lights from "./GameField/Lights";
import Sun from "./GameField/Sun";
import { Tiles } from "./GameField/Tiles";
import { WaterPlane } from "./GameField/WaterPlane";
import { degreesToRadians } from "./util/util";
import { MazeNode } from "../../server/extra/util/graph";



const GameCanvas = () => {
  const { depth, rootY,rootX } = useControls({
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
  const mazeRoot = {
    x: `${rootX}`,
    y: `${rootY}`,
    depth: `${depth}`,
  }
  const { isLoading, error, data: paths } = useSWR<MazeNode[]>(`/api/extra/tiles?${new URLSearchParams(Object.entries(mazeRoot))}`, {
    keepPreviousData: true,
    fetcher: (url) => fetch(url).then((res) => res.json()),
  })
  // const { isLoading, error, data: paths } = useQuery<MazeNode[]>({
  //   // suspense: true,
  //   queryFn: () =>
  //     fetch(`/api/extra/tiles?${new URLSearchParams(Object.entries({ ...mazeRoot, depth: `${depth}` }))}`).then(
  //       (res) => res.json(),
  //     ),
  // })
  const { rot } = useControls({ rot: 30 })
  return (
    <div className="min-h-screen min-w-full ">
      <Canvas className="min-h-screen min-w-full" style={{ height: '100vh' }} >
        {/* <Environment preset="forest"  /> */}
        <group rotation={degreesToRadians([0, rot, 0])} position={[0, -0.5, 0]}>
          {/* <Tiles tilesCoords={tilesCoords} /> */}
        </group>
        {paths && <Tiles nodes={paths} offset={[+mazeRoot.x, +mazeRoot.y]} />}
        {/* <Cloud position={[0, -20, 0]}
          opacity={0.5}
          speed={0.01} // Rotation speed
          width={200} // Width of the full cloud
          depthTest={true} // Disables the depthTest for the material, might be better for transparent objects
          depth={1.5} // Z-dir depth
          segments={240} // Number of particles
        /> */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <OrbitControls />
        <Sun />
        {/* <Moon /> */}
        <Lights />
        <WaterPlane />
        <axesHelper scale={5} position={[0, 1.1, 0]} />
        {/* <Grid infiniteGrid /> */}
        <Stats />
      </Canvas>
      <Loader />
    </div >

  );
}
export default GameCanvas;