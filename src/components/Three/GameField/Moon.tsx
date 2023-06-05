import { useFrame } from '@react-three/fiber';
import Gradient from 'javascript-color-gradient';
import { useControls } from 'leva';
import React, { useRef } from 'react';
import * as THREE from 'three';

// const dayColor = new THREE.Color(1.0, 1.0, 1.0);
// const nightColor = new THREE.Color(0.25, 0.25, 0.6);
const moonLightColors = new Gradient()
    .setColorGradient('#C0C0C0', '#888888')
    .setMidpoint(150)
    .getColors()

const getMoonColor = (height: number): THREE.Color => {
    // Define the gradient colors for the daytime
    const color = moonLightColors[Math.floor(Math.max(height * moonLightColors.length, 0.0))]

    // Return the color at the calculated index
    return new THREE.Color(color);
};

const Moon: React.FC = () => {
    // const lightRef = useRef<THREE.PointLight>(null!);
    const moonRef = useRef<THREE.Mesh>(null!);

    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() / 2;
        const radius = 30;
        const y = Math.abs(Math.sin(t) * 15);
        // lightRef.current.color = getMoonColor(Math.sin(t));
        // lightRef.current.intensity = 0.4
        moonRef.current.position.set(-Math.cos(t) * radius, y, -Math.sin(t) * radius);
        // lightRef.current.position.set(-Math.cos(t) * radius, y, -Math.sin(t) * radius);
    });
    // useControls('Moon', {
    //     visible: {
    //         value: true,
    //         onChange: (v) => {
    //             lightRef.current.visible = v;
    //             moonRef.current.visible = v;
    //         }
    //     },
    //     color: {
    //         value: 'white',
    //         onChange: (v) => {
    //             lightRef.current.color = new THREE.Color(v);
    //         },
    //     },
    //     intensity: {
    //         value: 1,
    //         onChange: (v) => {
    //             lightRef.current.intensity = v
    //         },
    //     },
    // })
    return (
        <group>
            {/* <pointLight ref={lightRef} castShadow visible={false} /> */}
            <mesh ref={moonRef}>
                <torusKnotGeometry args={[1, 0.1, 96, 100]} />
                {/* <sphereGeometry args={[1, 32, 32]} /> */}
                <meshBasicMaterial color="#5f4848" />
            </mesh>
        </group>
    );
};

export default Moon;




