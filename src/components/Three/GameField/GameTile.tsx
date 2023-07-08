import { PlayerContent, PlayerTile, Tile } from '@prisma/client'
import { Float, Html } from '@react-three/drei';
import React, { useState } from 'react'
import { Island } from '../Models/Island';
import { degreesToRadians } from '../util/util';
import { Torii } from '../Models/Torii';
import { degToRad } from 'three/src/math/MathUtils';
import { GamingComputer } from '../Models/GamingComputer';
import { VideoCamera } from '../Models/VideoCamera';
import { Button, Card } from 'react-daisyui';
import { useRef } from 'react';
import { useDebounce, useHover } from 'usehooks-ts';
import _ from 'lodash';

type Props = {
    playerTile: PlayerTile & {
        tile: Tile;
        playerContents: PlayerContent[];
    }
    offset: [number, number]
    position: [number, number, number]
    connectedTo: (PlayerTile & {
        tile: Tile;
        playerContents: PlayerContent[];
    })[]
}

export default function GameTile({ playerTile, offset, position, connectedTo = [] }: Props) {

    const islandRef = useRef<THREE.Group>(null)
    const popupRef = useRef<HTMLDivElement>(null)

    const [isIslandHovered, setIsIslandHovered] = useState(false)
    const [isPopupHovered, setIsPopupHovered] = useState(false)

    const showPopup = useDebounce(isIslandHovered || isPopupHovered, 250)
    const allowedContent = _.compact(connectedTo.map(x => x.allowsContentType))
    return (
        <group position={position}>
            {/* <Html position={[0, 1, 0]}>
                        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-clip-text bg-slate-500 text-red-500">{playerTile.tileId}</div>
                    </Html> */}

            {/* FIELD ISLAND w/o content*/}
            {playerTile.type == 'field' && !playerTile.playerContents[0] && <group>
                <Html position={[0, 1, 0]}>
                    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40'>
                        {showPopup && <Card ref={popupRef} className='bg-slate-800 bg-opacity-50 border-slate-800 px-2 py-1  text-lime-100'
                            onMouseEnter={() => setIsPopupHovered(true)}
                            onMouseLeave={() => setIsPopupHovered(false)}
                        >
                            {/* <Card.Body> */}
                            <div className="text-center">
                                <div className="font-bold whitespace-nowrap mb-1">Получить контент</div>
                                {allowedContent.includes('anime') &&
                                    <Button size='sm' className='w-full'>
                                        Anime
                                    </Button>}
                                {allowedContent.includes('game') &&
                                    <Button size='sm' className='w-full'>
                                        Game
                                    </Button>}
                                {allowedContent.includes('movie') &&
                                    <Button size='sm' className='w-full'>
                                        Movie
                                    </Button>}
                            </div>
                            {/* </Card.Body> */}
                        </Card>}
                    </div>
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
                        rotation={degreesToRadians([0, 60 * (+(playerTile.id.match(/\d{1,2}/) || 0)) * 30 + 15, 0])}
                    />
                </Float>
            </group>}


            {/* FIELD ISLAND w/ content*/}




            {/* START ISLAND */}
            {playerTile.type == 'start' &&
                <Float
                    speed={1} // Animation speed, defaults to 1
                    rotationIntensity={.11} // XYZ rotation intensity, defaults to 1
                    floatIntensity={2} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                    floatingRange={[-.00, .00]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
                >
                    <Island
                        color={playerTile.allowsContentType || 'unmarked'}
                        scale={2.3}
                        rotation={degreesToRadians([0, 60 * (+(playerTile.id.match(/\d{1,2}/) || 0)) * 30 + 15, 0])}
                    />
                    {/* START DECORATIONS */}
                    {playerTile.type == 'start' && playerTile.allowsContentType == 'anime' && <group>
                        <Torii scale={0.28} position={[0, 1.1, 0]} rotation={[0, degToRad(90), 0]} />
                    </group>}
                    {playerTile.type == 'start' && playerTile.allowsContentType == 'game' && <group>
                        <GamingComputer scale={0.5} position={[-0.0, 1.0, 0.07]} rotation={[0, degToRad(-140), degToRad(-90)]} />
                    </group>}
                    {playerTile.type == 'start' && playerTile.allowsContentType == 'movie' && <group>
                        <VideoCamera scale={0.2} position={[-0.07, 0.85, +0.07]} rotation={[0, degToRad(-40), 0]} />
                    </group>}
                </Float>}
            {/*  */}




        </group>
    )
}