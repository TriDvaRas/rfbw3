import { GradientTexture, useTexture } from "@react-three/drei"
import { useControls } from "leva"

export const WaterPlane = () => {
    //load texture from /public/assets/perlin.png
    const displacementMap = useTexture('/waterHeight.png')
    // const texture = useTexture({

    //     displacementMap: '/perlin.jpg',
    //     // normalMap: '/perlin.jpg',
    // })
    const { waterColor, opacity } = useControls({ waterColor: '#209ee2', opacity: 0.9 })
    return (
        <mesh scale={[2, 2, 1]} rotation={[-Math.PI / 2, 0, 0]}  position={[0,-0.1,0]}>
            <planeGeometry args={[100, 100, 100, 200]} />
            <meshStandardMaterial displacementMap={displacementMap} flatShading color={waterColor} transparent opacity={opacity} />
            {/* <MeshDistortMaterial ref={ref} speed={0.2} distort={0} >
                <meshPhongMaterial color="#ff0000" opacity={0.1} transparent />
            </MeshDistortMaterial> */}
        </mesh >
    )
}