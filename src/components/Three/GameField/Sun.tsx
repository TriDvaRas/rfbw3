import { Sky, SpotLight, SpotLightShadow } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import Gradient from 'javascript-color-gradient';
import { useControls } from 'leva';
import React, { useRef } from 'react';
import * as THREE from 'three';

// const dayColor = new THREE.Color(1.0, 1.0, 1.0);
// const nightColor = new THREE.Color(0.25, 0.25, 0.6);
const SUN_DISTANCE = 100;
const sunLightColors = new Gradient()
    .setColorGradient('#FFD760', '#FFFFFF', '#FFD760')
    .setMidpoint(150)
    .getColors()

const getSunColor = (height: number): THREE.Color => {
    // Define the gradient colors for the daytime
    const color = sunLightColors[Math.floor(Math.max(height * sunLightColors.length, 0.0))]

    // Return the color at the calculated index
    return new THREE.Color(color);
};

const Sun: React.FC = () => {
    const lightRef = useRef<THREE.PointLight>(null!);
    const sunRef = useRef<THREE.Mesh>(null!);
    const skyRef = useRef<any>(null!);
    const { t } = useControls({ t: { value: 0.07, min: 0, max: 1, step: 0.01 } })
    useFrame(({ clock }) => {
        // const t = clock.getElapsedTime() / 3;
        const radius = SUN_DISTANCE;
        // const y = Math.sin(t) * SUN_DISTANCE / 5;
        const y = 1.2;
        // lightRef.current.color = getSunColor(Math.sin(t));
        // lightRef.current.intensity = Math.max((Math.sin(t)), 0.0) * 1.0;
        sunRef.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
        lightRef.current.position.set(Math.cos(t) * radius, y, Math.sin(t) * radius);
        skyRef.current.material.uniforms.sunPosition.value = new THREE.Vector3(Math.cos(t) * radius, -y, Math.sin(t) * radius);
    });
    useControls('Sun', {
        visible: {
            value: true,
            onChange: (v) => {
                lightRef.current.visible = v;
                sunRef.current.visible = v;
            }
        },
        color: {
            value: 'white',
            onChange: (v) => {
                lightRef.current.color = new THREE.Color(v);
            },
        },
        intensity: {
            value: 1,
            onChange: (v) => {
                lightRef.current.intensity = v
            },
        },
    })
    useControls('Sky', {
        mieCoefficient: {
            value: 0.005,
            onChange: (v) => {
                skyRef.current.material.uniforms.mieCoefficient.value = v
            }
        },
        mieDirectionalG: {
            value: 0.8,
            onChange: (v) => {
                skyRef.current.material.uniforms.mieDirectionalG.value = v
            }
        },
        rayleigh: {
            value: 100,
            onChange: (v) => {
                skyRef.current.material.uniforms.rayleigh.value = v
            }
        },
        turbidity: {
            value: 10,
            onChange: (v) => {
                skyRef.current.material.uniforms.turbidity.value = v
            }
        },
        // sunPosition: {
        //     value: 'white',
        //     onChange: (v) => {
        //         skyRef.current.material.uniforms.sunPosition.value = new THREE.Vector3(v);
        //     },
        // },
    })

    return (
        <group>
            <pointLight ref={lightRef} position={[0, 0, 0]} intensity={1} />
            <Sky ref={skyRef} distance={450000} sunPosition={[0, -100, 1000]} inclination={60} azimuth={0.55} rayleigh={10} />
            <mesh ref={sunRef}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#FFD700" />
            </mesh>
        </group >
    );
};

export default Sun;




