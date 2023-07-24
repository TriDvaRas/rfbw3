import { type NextPage } from "next";
import Head from "next/head";
import GameCanvas from "../components/Three/GameCanvas";
import { Button } from "react-daisyui";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { BsCloudPlus } from "react-icons/bs";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "../utils/api";
import { toast } from "react-toastify";
import { TileDetailsShowMode } from "../types/common";
import { useLocalStorage } from "usehooks-ts";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import SidebarPlayersList from "../components/gaming/SidebarPlayersList";
const GameField: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()
  const { data: me, status: meStatus } = api.players.getMyPlayer.useQuery()
  const ctx = api.useContext()

  const { mutate: createMyPlayerInitialFields, isLoading } = api.playerContent.createPlayerInitialTiles.useMutation({
    onSuccess: () => {
      toast.success('Success!')
      ctx.playerContent.getMy.invalidate()
      ctx.players.getMyPlayer.invalidate()
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
  const [tileDetailsShowMode, setTileDetailsShowMode] = useLocalStorage<TileDetailsShowMode>('tileDetailsShowMode', 'simple')
  const [showLeftSidebar, setShowLeftSidebar] = useLocalStorage<boolean>('showLeftSidebar', true)
  const [showRightSidebar, setShowRightSidebar] = useLocalStorage<boolean>('showRightSidebar', true)

  if (status === 'unauthenticated')
    router.push('/')
  if (status === 'loading' || meStatus === 'loading')
    return null
  if (meStatus === 'error' || (meStatus === 'success' && !me))
    router.push('/register')
  if (!me)
    return <>What...</>
  return (
    <>
      <Head>
        <title>RFBW - Остров {me.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <GameCanvas />



        {/* SIDEBARS */}
        {/* LEFT */}
        <div className={`fixed top-0 left-0 h-full z-40  transition-all duration-300 ${showLeftSidebar ? 'w-[340px]' : 'w-0'}`}>
          {/* outer buttons */}
          <div className="relative left-full flex flex-col gap-1 p-2 mt-2">
            <Link href={'/home'} className="z-50">
              <Button color="secondary" size="sm" shape="circle">
                <AiFillHome className="text-md" />
              </Button>
            </Link>
            <Button className=" z-50" color="ghost" size="sm" shape="circle" onClick={() => setShowLeftSidebar(!showLeftSidebar)}>
              <label className={`swap ${showLeftSidebar ? 'swap-active' : ''} `}>
                <div className="swap-off"><MdVisibility size={21} /></div>
                <div className="swap-on"><MdVisibilityOff size={21} /></div>
              </label>
            </Button>
          </div>
        </div>
        <div className={`fixed top-0 left-0 h-screen max-h-full gap-1 ps-2 py-2 z-40 overflow-hidden transition-all duration-300 flex flex-col ${showLeftSidebar ? 'w-[340px]' : 'w-0'}`}>
          {/* inner Content */}
          <div className="flex-6 flex-grow h-0">
            <SidebarPlayersList />
          </div>
          <div className="flex-4 flex-grow h-0">
            {/* <PlayersList /> */}
          </div>


          {/* <div className="grid grid-rows-12 gap-2 p-2 h-full max-h-full ">
            <div className="row-span-8  overflow-hidden">
              <PlayersList />
            </div>
            <div className="row-span-4  overflow-hidden ">
              <ContentList />
            </div>
            <div className="row-span-3  overflow-hidden ">
              <ControlsList />
            </div>
          </div> */}
        </div>
        {/* RIGHT */}
        <div className={`fixed top-0 right-0  h-full  z-40 bg-slate-400 bg-opacity-20 transition-all duration-300 ${showRightSidebar ? 'w-[340px]' : 'w-0'}`}>
          {/* outer buttons */}
          <div className="relative right-16 flex flex-col gap-1 p-2">
            <Button className="z-50" color="ghost" size="md" shape="circle" onClick={() => setShowRightSidebar(!showRightSidebar)}>
              <label className={`swap ${showRightSidebar ? 'swap-active' : ''} `}>
                <div className="swap-off"><MdVisibility size={24} /></div>
                <div className="swap-on"><MdVisibilityOff size={24} /></div>
              </label>
            </Button>
          </div>
          {/* inner Content */}

        </div>


        {/* GLOB */}

        <Button className="fixed right-4 bottom-4 z-50" size="sm" color="secondary" shape="circle" onClick={() => {
          if (tileDetailsShowMode === 'none') {
            setTileDetailsShowMode('full')
          } else {
            setTileDetailsShowMode('none')
          }
        }}>
          <label className={`swap ${tileDetailsShowMode !== 'none' ? 'swap-active' : ''} `}>
            <div className="swap-on"><MdVisibility size={24} /></div>
            <div className="swap-off"><MdVisibilityOff size={24} /></div>
          </label>
          {/* <Swap
            offElement={}
            onElement={}
            active={tileDetailsShowMode !== 'none'}
            rotate
            onClick={() => {
              if (tileDetailsShowMode === 'none') {
                setTileDetailsShowMode('full')
              } else {
                setTileDetailsShowMode('none')
              }
            }}
          /> */}
        </Button>
        <Button className="fixed right-4 bottom-16 mb-2 z-50" color="secondary" shape="circle" loading={isLoading} onClick={() => {
          createMyPlayerInitialFields({
            playerId: me.id
          })
        }}>
          <BsCloudPlus className="text-xl" />
        </Button>
      </main>
    </>
  );
};

export default GameField;

