import { Tile as GameTile, PlayerContent, PlayerTile } from '@prisma/client'
import { Float, Html, Line } from '@react-three/drei'
import { Island } from '../Models/Island'
import { degreesToRadians } from '../util/util'
import { Pipes } from '../Models/Pipes'
import PipeConnector from './TileConnetors/PipeConnector'
import _ from 'lodash'
import RobotConnector from './TileConnetors/RobotConnector'
import BuildingConnector from './TileConnetors/BuildingConnector'
import WindowConnector from './TileConnetors/WindowConnector'


const SQRT3 = Math.sqrt(3)
const SQRT2 = Math.sqrt(2)
const TILES_SPACING = 1.5
const TILES_X_MULTIPLIER = SQRT3
const TILES_Y_MULTIPLIER = 1.5

type Connection = {
    from: (PlayerTile & {
        tile: GameTile;
        playerContents: PlayerContent[];
    }),
    to: string,
    type: 'pipe' | 'building' | 'robot' | 'window'
}

type Props = {
    playerTiles: (PlayerTile & {
        tile: GameTile;
        playerContents: PlayerContent[];
    })[]
    centerCoordinates: [number, number]
}
export function FieldTiles(props: Props) {

    // const connections: Connection[] = []
    const pipes: Connection[] = props.playerTiles
        .filter(x => x.type === 'start' || (x.type === 'field' && x.allowsContentType))
        .flatMap(x =>
            _.uniq([...x.hardConnectedTo, ...x.tile.connectedTo])
                .filter(x => props.playerTiles.find(t => t.tileId == x)?.type === 'field')
                .map(y => ({ from: x, to: y, type: 'pipe' }))
        )
    const uniqPipes = _.uniqWith(pipes, (a, b) => a.from.tileId == b.to && a.to == b.from.tileId)

    const robots: Connection[] = props.playerTiles
        .filter(x => x.type === 'field' && x.allowsContentType)
        .flatMap(x =>
            x.tile.robots
                .filter(x => props.playerTiles.find(t => t.tileId == x)?.type === 'field')
                .map(y => ({ from: x, to: y, type: 'robot' }))
        )
        .filter(y => !uniqPipes.find(p => (p.from.tileId == y.from.tileId && p.to == y.to) || (p.from.tileId == y.to && p.to == y.from.tileId))) as Connection[]
    const uniqRobots = _.uniqWith(robots, (a, b) => a.from.tileId == b.to && a.to == b.from.tileId)

    const buildings: Connection[] = props.playerTiles
        .filter(x => x.type === 'field' && x.allowsContentType)
        .flatMap(x =>
            x.tile.buildings
                .filter(x => props.playerTiles.find(t => t.tileId == x)?.type === 'field')
                .map(y => ({ from: x, to: y, type: 'building' }))
        )
        .filter(y => !uniqPipes.find(p => (p.from.tileId == y.from.tileId && p.to == y.to) || (p.from.tileId == y.to && p.to == y.from.tileId))) as Connection[]
    const uniqBuildings = _.uniqWith(buildings, (a, b) => a.from.tileId == b.to && a.to == b.from.tileId)

    const windows: Connection[] = props.playerTiles
        .filter(x => x.type === 'field' && x.allowsContentType)
        .flatMap(x =>
            x.tile.windows
                .filter(x => props.playerTiles.find(t => t.tileId == x)?.type === 'field')
                .map(y => ({ from: x, to: y, type: 'window' }))
        )
        .filter(y => !uniqPipes.find(p => (p.from.tileId == y.from.tileId && p.to == y.to) || (p.from.tileId == y.to && p.to == y.from.tileId))) as Connection[]
    const uniqWindows = _.uniqWith(windows, (a, b) => a.from.tileId == b.to && a.to == b.from.tileId)


    return <group rotation={degreesToRadians([0, 180, 0])}>
        <axesHelper scale={5} position={[0, 1.1, 0]} />
        {/* PIPES */}
        {
            uniqPipes.map((pipe, i) => {
                const from = pipe.from.tileId.split(',').map(x => parseInt(x)) as [number, number]
                const to = pipe.to.split(',').map(x => parseInt(x)) as [number, number]
                const fromCoords = [(from[0] - props.centerCoordinates[0] - (from[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (from[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                const toCoords = [(to[0] - props.centerCoordinates[0] - (to[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.4, (to[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                return <PipeConnector key={i} from={fromCoords as any} to={toCoords as any} />
            })
        }
        {/* ROBOTS */}
        {
            uniqRobots.map((robot, i) => {
                const from = robot.from.tileId.split(',').map(x => parseInt(x)) as [number, number]
                const to = robot.to.split(',').map(x => parseInt(x)) as [number, number]
                const fromCoords = [(from[0] - props.centerCoordinates[0] - (from[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (from[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                const toCoords = [(to[0] - props.centerCoordinates[0] - (to[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (to[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                return <RobotConnector key={i} from={fromCoords as any} to={toCoords as any} />
            })
        }
        {/* BUILDINGS */}
        {
            uniqBuildings.map((building, i) => {
                const from = building.from.tileId.split(',').map(x => parseInt(x)) as [number, number]
                const to = building.to.split(',').map(x => parseInt(x)) as [number, number]
                const fromCoords = [(from[0] - props.centerCoordinates[0] - (from[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (from[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                const toCoords = [(to[0] - props.centerCoordinates[0] - (to[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (to[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                return <BuildingConnector key={i} from={fromCoords as any} to={toCoords as any} />
            })
        }
        {/* WINDOWS */}
        {
            uniqWindows.map((window, i) => {
                const from = window.from.tileId.split(',').map(x => parseInt(x)) as [number, number]
                const to = window.to.split(',').map(x => parseInt(x)) as [number, number]
                const fromCoords = [(from[0] - props.centerCoordinates[0] - (from[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (from[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                const toCoords = [(to[0] - props.centerCoordinates[0] - (to[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, 0.6, (to[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]
                return <WindowConnector key={i} from={fromCoords as any} to={toCoords as any} />
            })
        }
        {/* TILES */}
        {
            props.playerTiles.filter(x => x.type == 'field' || x.type == 'start').map((ptile, i) => {
                const x = ptile.tileId.split(',').map(x => parseInt(x)) as [number, number]
                return <group key={i}>




                    <Float
                        speed={1} // Animation speed, defaults to 1
                        rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                        floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                        floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                    >
                        <group position={[(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, -0.16, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}>
                            <Html position={[0, 1, 0]}>
                                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-clip-text bg-slate-500 text-red-500">{x.join(' ')}</div>
                            </Html>
                            <Island
                                color={ptile.type == 'field' || ptile.type == 'start' ? ptile.allowsContentType || 'unmarked' : 'border'}
                                scale={2.3}
                                rotation={degreesToRadians([0, 60 * (i % 12) + 15, 0])}
                            />
                        </group>
                        {/* <Tile position={[(x[0] - props.offset[0]) * TILES_SPACING * TILES_X_MULTIPLIER, 0, (x[1] - props.offset[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]} rotation={degreesToRadians([0, 60 * (i % 6) + 30, 0])} scale={1} /> */}
                    </Float>
                </group>
            })
        }
    </group >
}
