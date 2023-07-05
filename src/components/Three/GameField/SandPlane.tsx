import { GradientTexture, useTexture } from "@react-three/drei"
import { useControls } from "leva"

export const SandPlane = () => {
    //load texture from /public/assets/perlin.png
    const displacementMap = useTexture('/waterHeight.png')
    // const texture = useTexture({

    //     displacementMap: '/perlin.jpg',
    //     // normalMap: '/perlin.jpg',
    // })
    const { sandColor, opacity } = useControls({ sandColor: '#f4e7c2', opacity: 0.9 })
    return (
        <mesh scale={[2, 2, 1]} rotation={[-Math.PI / 2, 0, Math.PI]} receiveShadow position={[0,-0.5,0]}>
            <planeGeometry args={[100, 100, 100, 200]} />
            <meshStandardMaterial displacementMap={displacementMap} flatShading color={sandColor} transparent opacity={opacity} />
            {/* <MeshDistortMaterial ref={ref} speed={0.2} distort={0} >
                <meshPhongMaterial color="#ff0000" opacity={0.1} transparent />
            </MeshDistortMaterial> */}
        </mesh >
    )
}