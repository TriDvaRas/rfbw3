import { Float, Html, Line, Shadow } from '@react-three/drei'
import { Tile } from '../Models/Tile'
import { degreesToRadians } from '../util/util'
import { Island } from '../Models/Island'
import { MazeNode } from '../../../server/extra/util/graph'


const SQRT3 = Math.sqrt(3)
const SQRT2 = Math.sqrt(2)
const TILES_SPACING = 2
const TILES_X_MULTIPLIER = SQRT3 / 2
const TILES_Y_MULTIPLIER = 1.5

type Props = {
    nodes: MazeNode[]
    offset: [number, number]
}
export function Tiles(props: Props) {
    return <group >
        {
            props.nodes.map((node, i) => {
                const x = node.key.split(',').map(x => parseInt(x)) as [number, number]
                return <group key={i}>
                    {node.childrenKeys.map((edge, j) => {
                        const y = edge.split(',').map(x => parseInt(x)) as [number, number]
                        return <Line key={j} lineWidth={2} color={'black'} points={[
                            [(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER],
                            [(y[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (y[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                        ]} />
                    })}
                    {/* <Html position={[(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 1.2, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}>
                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-clip-text bg-slate-500 text-red-500">{x.join(' ')}</div>
                    </Html> */}
                    {/* <Float
                        speed={1} // Animation speed, defaults to 1
                        rotationIntensity={.1} // XYZ rotation intensity, defaults to 1
                        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                        floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                    > */}
                    <Island
                        position={[(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, -1, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}
                        rotation={degreesToRadians([0, 60 * (i % 6) + 30, 0])}
                    />
                    {/* <Tile position={[(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 0, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]} rotation={degreesToRadians([0, 60 * (i % 6) + 30, 0])} scale={1} /> */}
                    {/* </Float> */}
                </group>
            })
        }
    </group >
}
