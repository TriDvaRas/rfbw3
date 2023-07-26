import { GradientTexture, MeshDistortMaterial, useTexture } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useControls } from "leva"
import { useRef } from "react"
import { MeshPhysicalMaterial } from "three"

export const WaterPlane = () => {
    //load texture from /public/assets/perlin.png
    const displacementMap = useTexture('/waterHeight.png')
    // const texture = useTexture({

    //     displacementMap: '/perlin.jpg',
    //     // normalMap: '/perlin.jpg',
    // })
    // const { waterColor, opacity } = useControls({ waterColor: '#2ba593', opacity: 0.9 })
    const ref = useRef<MeshPhysicalMaterial>(null!)
    useFrame(({ clock }) => {
        if (ref.current) {
            ref.current.displacementScale = 0.4 + Math.sin(clock.getElapsedTime()/3) ** 2 * 0.2
        }
    })
    return (
        <mesh scale={[2, 2, 0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
            <planeGeometry args={[100, 100, 100, 200]} />
            {/* <meshBasicMaterial  displacementMap={displacementMap} flatShading color={waterColor} transparent opacity={opacity} /> */}
            <meshStandardMaterial ref={ref} displacementMap={displacementMap} flatShading color={'#2ba593'} transparent opacity={0.9} />
            {/* <meshPhongMaterial displacementMap={displacementMap} flatShading color={waterColor} transparent opacity={opacity} /> */}
            {/* <meshStandardMaterial displacementMap={displacementMap} flatShading color={waterColor} transparent opacity={opacity} /> */}
            {/* <MeshDistortMaterial  speed={0.2} distort={0} >
                <meshPhongMaterial color="#ff0000" opacity={0.1} transparent />
            </MeshDistortMaterial> */}
        </mesh >
    )
}