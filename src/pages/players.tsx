import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "react-daisyui";
import { AiFillHome } from "react-icons/ai";
import { api } from "../utils/api";
const GameField: NextPage = () => {
  const { data, fetchNextPage } = api.players.getAllPlayersWithContent.useInfiniteQuery({
    limit: 1,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })
  const players = data?.pages.flat().map(x=>x.items).flat() ?? []
  return (
    <>
      <Head>
        <title>RFBW - Галерея</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center ">
        <div className="container max-w-7xl bg-slate-700">
          <div className="my-4">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-4xl text-center">Галерея Участников</div>
              {players.map((player, i) => <>{player.name}</>)}
              {players.length}
              <Button onClick={()=>fetchNextPage()}>+</Button>
            </div>
          </div>
        </div>






        <Link href={'/home'} className="absolute left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
      </main>
    </>
  );
};

export default GameField;

