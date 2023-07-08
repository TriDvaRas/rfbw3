import React, { useRef } from 'react'
import { Pipes } from '../../Models/Pipes'
import { Float, PositionalAudio } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

type Props = {
    from: [number, number, number],
    to: [number, number, number],
}

function PipeConnector({ from, to }: Props) {
    const ref = useRef<THREE.Group>(null!)
    const velocity = useRef(0);
    const height = useRef(0.065);
    const gravity = -3; // gravity acceleration
    const originalHeight = 0.065;
    // const soundRef = useRef<THREE.PositionalAudio>(null!);
    const audio = new Audio('/pipe.mp3');
    // teleport and drop
    const handleClick = () => {

        height.current = originalHeight + 3;
        velocity.current = 0;
        console.log("clicked", height.current, velocity.current);
    }

    useFrame(({ clock }, delta) => {

        if (ref.current) {
            if (height.current > originalHeight) {
                // console.log(delta);
                // falling
                velocity.current += gravity * delta;
                height.current += velocity.current * delta;
                ref.current.position.y = height.current;
            } else if (height.current < originalHeight) {
                height.current = originalHeight;
                velocity.current = 0;
                // play sound when reaching original height
                // assuming you have a function playSound()
                // playSound();
                // soundRef.current.setVolume(3);
                // soundRef.current.play();
                audio.volume = 0.8;
                audio.play();
                ref.current.position.y = height.current;
            }
        }
    });


    const midPoint = from.map((val, i) => (from[i]! + to[i]!) / 2);
    // Calculate direction vector
    const dirVec = from.map((val, i) => to[i]! - from[i]!);
    // Normalize the direction vector
    const length = Math.sqrt(dirVec[0]! ** 2 + dirVec[1]! ** 2 + dirVec[2]! ** 2);
    const normDirVec = dirVec.map(val => val / length);
    // Calculate rotation angles. 
    const rotation = [0, Math.atan2(normDirVec[0]!, normDirVec[2]!), 0];
    return (
        <group ref={ref}
            position={[midPoint[0]!, originalHeight, midPoint[2]!]}
        >
            {/* <PositionalAudio
                ref={soundRef}
                url="/pipe.mp3"
                loop={false}
                autoplay={false }
                // distance={0}
                load
            /> */}
            <Float floatIntensity={0.5} rotationIntensity={0.1}>
                <Pipes
                    scale={0.25}
                    rotation={rotation as [number, number, number]}
                    onClick={handleClick}
                />
            </Float>
        </group>
    )
}

export default PipeConnector