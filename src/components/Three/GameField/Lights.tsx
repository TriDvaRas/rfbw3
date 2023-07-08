

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.13} />
      {/* <hemisphereLight args={[0xffffff, 0x444444, .05]} /> */}
      <directionalLight position={[30, 30, 30]} intensity={1.3} castShadow />
    </>
  )
}
