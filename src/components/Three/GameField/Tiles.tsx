import { Float, Html, Line, Shadow } from '@react-three/drei'
import { Tile } from '../Models/Tile'
import { degreesToRadians } from '../util/util'
import { Island } from '../Models/Island'
import { MazeNode } from '../../../server/extra/util/graph'
import { PlayerContent, PlayerTile, Tile as GameTile } from '@prisma/client'


const SQRT3 = Math.sqrt(3)
const SQRT2 = Math.sqrt(2)
const TILES_SPACING = 1.5
const TILES_X_MULTIPLIER = SQRT3
const TILES_Y_MULTIPLIER = 1.5
type Props = {
    playerTiles: (PlayerTile & {
        tile: GameTile;
        playerContents: PlayerContent[];
    })[]
    centerCoordinates: [number, number]
}
export function Tiles(props: Props) {
    return <group rotation={degreesToRadians([0, 180, 0])}>
        {
            props.playerTiles.filter(x => x.type == 'field').map((ptile, i) => {
                const x = ptile.tileId.split(',').map(x => parseInt(x)) as [number, number]
                return <group key={i}>
                    {ptile.tile.connectedTo.map((edge, j) => {
                        const y = edge.split(',').map(x => parseInt(x)) as [number, number]
                        return <Line key={j} lineWidth={2} color={'lime'} points={[
                            [(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER],
                            [(y[0] - props.centerCoordinates[0] - (y[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (y[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                        ]} />
                    })}
                    {ptile.tile.buildings.map((edge, j) => {
                        const y = edge.split(',').map(x => parseInt(x)) as [number, number]
                        return <Line key={j} lineWidth={2} color={'orange'} points={[
                            [(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER],
                            [(y[0] - props.centerCoordinates[0] - (y[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (y[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                        ]} />
                    })}
                    {ptile.tile.windows.map((edge, j) => {
                        const y = edge.split(',').map(x => parseInt(x)) as [number, number]
                        return <Line key={j} lineWidth={2} color={'red'} points={[
                            [(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER],
                            [(y[0] - props.centerCoordinates[0] - (y[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (y[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                        ]} />
                    })}
                    {ptile.tile.robots.map((edge, j) => {
                        const y = edge.split(',').map(x => parseInt(x)) as [number, number]
                        return <Line key={j} lineWidth={2} color={'purple'} points={[
                            [(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER],
                            [(y[0] - props.centerCoordinates[0] - (y[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (y[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                        ]} />
                    })}

                    <Html position={[(x[0] - props.centerCoordinates[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 1.2, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}>
                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-clip-text bg-slate-500 text-red-500">{x.join(' ')}</div>
                    </Html>
                    <Float
                        speed={1} // Animation speed, defaults to 1
                        rotationIntensity={.1} // XYZ rotation intensity, defaults to 1
                        floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                        floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                    >
                        <Island
                            color={ptile.type == 'border' ? 'red' : ptile.type == 'field' ? 'green' : 'blue'}
                            scale={2.3}
                            position={[(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, -0.16, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}
                            rotation={degreesToRadians([0, 60 * (i % 12) + 15, 0])}
                        />
                        {/* <Tile position={[(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 0, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]} rotation={degreesToRadians([0, 60 * (i % 6) + 30, 0])} scale={1} /> */}
                    </Float>
                </group>
            })
        }
    </group >
}
