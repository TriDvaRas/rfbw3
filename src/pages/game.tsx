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
const GameField: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()
  const { data: me, status: meStatus } = api.players.getMyPlayer.useQuery()

  const { mutate: createMyPlayerInitialFields, isLoading } = api.fieldNodes.createPlayerInitialTiles.useMutation({
    onSuccess: () => {
      toast.success('Success!')
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

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
        <title>RFBW - Поле</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <GameCanvas />



        <Button color="secondary" shape="circle" loading={isLoading} className="fixed right-4 bottom-4" onClick={() => {
          createMyPlayerInitialFields({
            playerId: me.id
          })
        }}>
          <BsCloudPlus className="text-xl" />
        </Button>
        <Link href={'/home'} className="fixed left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
      </main>
    </>
  );
};

export default GameField;

