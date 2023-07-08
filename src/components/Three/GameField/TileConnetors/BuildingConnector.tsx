import React, { useRef } from 'react'
import { Pipes } from '../../Models/Pipes'
import { Float, PositionalAudio } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Robot } from '../../Models/Robot';
import { Building } from '../../Models/Building';

type Props = {
    from: [number, number, number],
    to: [number, number, number],
}

function RobotConnector({ from, to }: Props) {
    const ref = useRef<THREE.Group>(null!)
    const originalHeight = -0.1;
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
            {/* <Float floatIntensity={0.5} rotationIntensity={0.1}> */}
                <Building
                    scale={1}
                    rotation={rotation as [number, number, number]}
                />
            {/* </Float> */}
        </group>
    )
}

export default RobotConnector