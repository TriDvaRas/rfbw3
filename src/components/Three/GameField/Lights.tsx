

export default function Lights() {
  return (
    <>
    {/* <ambientLight intensity={0.5} /> */}
      <hemisphereLight args={[0xffffff, 0x444444,.6]} />
    </>
  )
}
