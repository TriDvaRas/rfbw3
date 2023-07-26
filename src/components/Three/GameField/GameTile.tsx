import { Content, ContentDLC, ContentType, PlayerContent, PlayerTile, Tile } from '@prisma/client'
import { Float, Html, Shadow } from '@react-three/drei';
import React, { useState } from 'react'
import { Island } from '../Models/Island';
import { degreesToRadians } from '../util/util';
import { Torii } from '../Models/Torii';
import { degToRad } from 'three/src/math/MathUtils';
import { GamingComputer } from '../Models/GamingComputer';
import { VideoCamera } from '../Models/VideoCamera';
import { Button, Card } from 'react-daisyui';
import { useRef } from 'react';
import { useDebounce, useHover, useLocalStorage } from 'usehooks-ts';
import _ from 'lodash';
import { api } from '../../../utils/api';
import { toast } from 'react-toastify';
import { TreeStump } from '../Models/TreeStump';
import { useControls } from 'leva';
import { GrownTree } from '../Models/GrownTree';
import { GrowingTree } from '../Models/GrowingTree';
import Avatar from '../../util/Avatar';
import { useThree } from '@react-three/fiber';
import ContentPreview from '../../previews/ContentPreview';
import { TileDetailsShowMode } from '../../../types/common';
import { useAtom } from 'jotai';
import { showContentFullInfoModalAtom, contentFullInfoModalContentAtom, canRollNewContentAtom, newContentOpenPopupTileIdAtom } from '../../../utils/atoms';
import { PiChatTeardropFill, PiFlowerLotusFill } from 'react-icons/pi'
import { BsFillCameraVideoFill, BsPlusCircleDotted } from 'react-icons/bs';
import { ImVideoCamera } from 'react-icons/im';
import { FaGamepad } from 'react-icons/fa';

type Props = {
    playerTile: PlayerTile & {
        tile: Tile;
        playerContent: (PlayerContent & {
            content: Content & {
                DLCs: ContentDLC[];
            };
        }) | null;
    }
    offset: [number, number]
    position: [number, number, number]
    connectedTo: (PlayerTile & {
        tile: Tile;
        playerContent: (PlayerContent & {
            content: Content
        }) | null
    })[]
    freeSlots?: {
        game: number
        movie: number
        anime: number
    }
}

export default function GameTile({ playerTile, offset, position, connectedTo = [], freeSlots }: Props) {
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [fullInfoModalContent, setFullInfoModalContent] = useAtom(contentFullInfoModalContentAtom)
    const [canRollNewContent, setCanRollNewContent] = useAtom(canRollNewContentAtom)
    const [newContentOpenPopupTileId, setNewContentOpenPopupTileId] = useAtom(newContentOpenPopupTileIdAtom)

    const islandRef = useRef<THREE.Group>(null)

    const [isIslandHovered, setIsIslandHovered] = useState(false)

    const ctx = api.useContext()
    const three = useThree()

    const allowedContent = _.compact(connectedTo.map(x => x.allowsContentType))
    const [tileDetailsShowMode, setTileDetailsShowMode] = useLocalStorage<TileDetailsShowMode>('tileDetailsShowMode', 'simple')

    // const rerollUnlockTO = useRef<NodeJS.Timeout>(null)
    const { mutate: endContent, isLoading: finishContentIsLoading } = api.game.content.completeContent.useMutation({
        onMutate: () => {
            setCanRollNewContent(false)
        },
        onSuccess(data, variables, context) {
            toast.success('Контент завершен')
            Promise.all([
                ctx.playerContent.getMy.invalidate(),
                ctx.players.getPlayerDetails.invalidate(),
                ctx.players.getAllWithEntropy.invalidate(),
                ctx.game.feed.getFeed.invalidate(),
            ]).then(() => {
                setCanRollNewContent(true)
            })
        },
        onError: (err) => {
            toast.error(err.message)
            setCanRollNewContent(true)
        }
    })
    const { mutate: rollContent, isLoading } = api.game.content.rollNewContent.useMutation({
        onMutate: () => {
            setCanRollNewContent(false)
        },
        onSuccess: (data, variables, context) => {
            toast.success('Контент получен')
            setFullInfoModalContent(data.content)
            setShowContentFullInfo(true)
            
            Promise.all([
                ctx.playerContent.getMy.invalidate(),
                ctx.players.getPlayerDetails.invalidate(),
                ctx.players.getAllWithEntropy.invalidate(),
                ctx.game.feed.getFeed.invalidate(),
            ]).then(() => {
                setCanRollNewContent(true)
            })
        },
        onError: (err) => {
            toast.error(err.message)
            setCanRollNewContent(true)
        }
    })
    // const { val, col } = useControls('GameTile', {
    //     val: {
    //         value: 1,
    //         min: 0.1,
    //         max: 2,
    //         step: 0.01
    //     },
    //     col: '#e96c23'
    // })

    return (
        <group position={position}>

            {/* FIELD ISLAND w/o content*/}
            {playerTile.type == 'field' && !playerTile.playerContent && <group>
                <Html position={[0, 0.5, 0]} zIndexRange={[0, 0]}>

                    {newContentOpenPopupTileId == playerTile.id && <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 transform -translate-y-28'>
                        {/* //!------------- */}
                        <div className='bg-fuchsia-900 bg-opacity-30 p-3 rounded-full shadow-lg px-2 py-2  text-lime-100'>
                            {/* <Card.Body> */}
                            {canRollNewContent ? <div className=" flex flex-row gap-1">
                                {allowedContent.includes('anime') &&
                                    <Button size='md' shape='circle' loading={isLoading} onClick={() => {
                                        rollContent({ type: 'anime', playerTileId: playerTile.id })
                                    }}>
                                        <PiFlowerLotusFill className='text-2xl' />
                                    </Button>}
                                {allowedContent.includes('movie') &&
                                    <Button size='md' shape='circle' loading={isLoading} onClick={() => {
                                        rollContent({ type: 'movie', playerTileId: playerTile.id })
                                    }}>
                                        <BsFillCameraVideoFill className='text-2xl' />
                                    </Button>}
                                {allowedContent.includes('game') &&
                                    <Button size='md' shape='circle' loading={isLoading} onClick={() => {
                                        rollContent({ type: 'game', playerTileId: playerTile.id })
                                    }}>
                                        <FaGamepad className='text-2xl' />
                                    </Button>}
                            </div> : <div></div>}
                            {/* </Card.Body> */}
                        </div>
                        {/* //!------------- */}
                    </div>
                    }
                    {canRollNewContent && freeSlots && allowedContent.some(x => freeSlots[x] > 0) &&
                        <div className='fixed inset-0   z-30 ' onClick={() => setNewContentOpenPopupTileId(newContentOpenPopupTileId == playerTile.id ? null : playerTile.id)}>
                            <PiChatTeardropFill className="relative transform rotate-[-45deg] -translate-x-1/2 -translate-y-full text-6xl text-slate-800" />
                            <BsPlusCircleDotted className={` relative text-4xl transition-all  -translate-x-1/2 -translate-y-full ${newContentOpenPopupTileId == playerTile.id ? 'rotate-[-45deg] text-red-400' : 'text-white'}`} style={{
                                //@ts-ignore
                                '--tw-translate-y': '-304%'
                            }} />
                        </div>
                    }
                </Html>
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <Island
                        ref={islandRef}
                        onPointerEnter={() => setIsIslandHovered(true)}
                        onPointerLeave={() => setIsIslandHovered(false)}
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                    />
                </Float>
            </group>}


            {/* FIELD ISLAND w/ content*/}
            {/* dropped */}
            {playerTile.type == 'field' && playerTile.playerContent && playerTile.playerContent.status == 'dropped' && <group>
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <TreeStump position={[0, 0.66, 0]} scale={0.5} />
                    <Shadow position={[0, 0.51, 0]} scale={0.33} />
                    <Island
                        ref={islandRef}
                        onPointerEnter={() => setIsIslandHovered(true)}
                        onPointerLeave={() => setIsIslandHovered(false)}
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                    />
                </Float>
            </group>
            }
            {playerTile.type == 'field' && playerTile.playerContent && playerTile.playerContent.status == 'inProgress' && <group>
                {/* content preview circle */}
                <Html position={[0, 1.9, 0]} zIndexRange={[0, 0]} distanceFactor={3 * three.camera.zoom}>
                    {tileDetailsShowMode == 'full' ?
                        <div className='fixed inset-0 rounded-full flex items-center justify-center bg-transparent bg-opacity-40 cursor-pointer'
                            onClick={() => {
                                if (playerTile.playerContent) {
                                    setShowContentFullInfo(true)
                                    setFullInfoModalContent(playerTile.playerContent.content)
                                }
                            }}>
                            <ContentPreview label={playerTile.playerContent.content.label} type={playerTile.playerContent.content.type} imageUrl={playerTile.playerContent.content.imageId}
                                onComplete={() => {
                                    if (playerTile.playerContent)
                                        endContent({ playerTileId: playerTile.id, type: 'completed' })
                                }}
                                onDrop={() => {
                                    if (playerTile.playerContent)
                                        endContent({ playerTileId: playerTile.id, type: 'dropped' })

                                }}
                            />
                        </div> : tileDetailsShowMode == 'simple' ?
                            <div className='fixed inset-0 rounded-full flex items-center justify-center bg-transparent bg-opacity-40 cursor-pointer' onClick={() => {
                                if (playerTile.playerContent) {
                                    setShowContentFullInfo(true)
                                    setFullInfoModalContent(playerTile.playerContent.content)
                                }
                            }}>
                                <Avatar border shape='circle' borderColor={'info'} size={256} src={playerTile.playerContent.content.imageId} />
                            </div> : null}
                </Html>
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <GrowingTree position={[-0.04, 0.94, 0.1]} scale={0.6} rotation={[0, 1, 0]} color={getTreeHeadColor(playerTile.allowsContentType)} />
                    <Shadow position={[-0.07, 0.51, 0.07]} scale={0.43} opacity={0.3} />
                    <Island
                        ref={islandRef}
                        onPointerEnter={() => setIsIslandHovered(true)}
                        onPointerLeave={() => setIsIslandHovered(false)}
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                    />
                </Float>
            </group>
            }
            {playerTile.type == 'field' && playerTile.playerContent && (playerTile.playerContent.status == 'completed') && <group>
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <GrownTree position={[0, 1.28, 0]} scale={1.2} rotation={[0, .6, 0]} color={getTreeHeadColor(playerTile.allowsContentType)} />
                    <TreeStump position={[0, 0.58, 0]} scale={0.3} />
                    <Shadow position={[0, 0.51, 0]} scale={0.93} />
                    <Island
                        ref={islandRef}
                        onPointerEnter={() => setIsIslandHovered(true)}
                        onPointerLeave={() => setIsIslandHovered(false)}
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                    />
                </Float>
            </group>
            }
            {playerTile.type == 'field' && playerTile.playerContent && (playerTile.playerContent.status == 'rerolled') && <group>
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <GrownTree position={[0, 1.28, 0]} scale={1.2} rotation={[0, .6, 0]} color={getTreeHeadColor(playerTile.allowsContentType)} />
                    <TreeStump position={[0, 0.58, 0]} scale={0.3} />
                    <Shadow position={[0, 0.51, 0]} scale={0.93} />
                    <Island
                        ref={islandRef}
                        onPointerEnter={() => setIsIslandHovered(true)}
                        onPointerLeave={() => setIsIslandHovered(false)}
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                    />
                </Float>
            </group>
            }



            {/* START ISLAND */}
            {playerTile.type == 'start' && <Float
                speed={1} // Animation speed, defaults to 1
                rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
            >
                <Island
                    color={playerTile.allowsContentType || 'unmarked'}
                    scale={2.3}
                    rotation={degreesToRadians([0, 21 * ((playerTile.id.match(/\d/g) || []).slice(0, 4).map(x => +x).reduce((a, b) => a + b, 0)), 0])}
                />
                {/* START DECORATIONS */}
                {playerTile.type == 'start' && playerTile.allowsContentType == 'anime' && <group>
                    <Torii scale={0.28} position={[0, 1.1, 0]} rotation={[0, degToRad(90), 0]} />
                    <Shadow position={[0, 0.51, 0.33]} scale={0.73} />
                    <Shadow position={[0, 0.51, -0.33]} scale={0.73} />
                </group>}
                {playerTile.type == 'start' && playerTile.allowsContentType == 'game' && <group>
                    <GamingComputer scale={0.45} position={[-0.0, 1.1, 0.07]} rotation={[-0.1, degToRad(-140), degToRad(-50)]} />
                    <Shadow position={[0, 0.51, 0.07]} scale={0.82} />
                </group>}
                {playerTile.type == 'start' && playerTile.allowsContentType == 'movie' && <group>
                    <VideoCamera scale={0.2} position={[-0.07, 0.85, +0.07]} rotation={[0, degToRad(-40), 0]} />
                    <Shadow position={[0, 0.51, 0]} scale={0.73} />
                </group>}
            </Float>}
            {/*  */}




        </group>
    )
}

const getTreeHeadColor = (type: ContentType | null) => {
    switch (type) {
        case 'anime':
            return '#ff60ba'
        case 'movie':
            return '#e96c23'
        case 'game':
            return '#7AA314'
        default:
            return undefined
    }
}