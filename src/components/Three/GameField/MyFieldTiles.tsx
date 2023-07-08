import { Tile, PlayerContent, PlayerTile } from '@prisma/client'
import { Float, Html } from '@react-three/drei'
import _ from 'lodash'
import { Island } from '../Models/Island'
import { degreesToRadians } from '../util/util'
import BuildingConnector from './TileConnetors/BuildingConnector'
import PipeConnector from './TileConnetors/PipeConnector'
import RobotConnector from './TileConnetors/RobotConnector'
import WindowConnector from './TileConnetors/WindowConnector'
import GameTile from './GameTile'
import { useControls } from 'leva'


const SQRT3 = Math.sqrt(3)
const SQRT2 = Math.sqrt(2)
const TILES_SPACING = 1.5
const TILES_X_MULTIPLIER = SQRT3
const TILES_Y_MULTIPLIER = 1.5

type Connection = {
    from: (PlayerTile & {
        tile: Tile;
        playerContents: PlayerContent[];
    }),
    to: string,
    type: 'pipe' | 'building' | 'robot' | 'window'
}

type Props = {
    playerTiles: (PlayerTile & {
        tile: Tile;
        playerContents: PlayerContent[];
    })[]
    centerCoordinates: [number, number]
}
export function MyFieldTiles(props: Props) {
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

    // const { rot } = useControls('tiles', { rot: { value: 0, min: -180, max: 180, step: 1 } })
    return <group rotation={degreesToRadians([0, 175, 0])}>
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
                return <GameTile key={i}

                    offset={props.centerCoordinates}
                    playerTile={ptile}
                    position={[(x[0] - props.centerCoordinates[0] - (x[1] % 2 == 0 ? 0.5 : 0)) * TILES_SPACING * TILES_X_MULTIPLIER, -0.16, (x[1] - props.centerCoordinates[1]) * TILES_SPACING * TILES_Y_MULTIPLIER]}
                    connectedTo={_.compact([...ptile.hardConnectedTo, ...ptile.tile.connectedTo].map(x => props.playerTiles.find(y => y.tileId == x)))}
                />

            })
        }
    </group >
}
