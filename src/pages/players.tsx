import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { Button } from "react-daisyui";
import { AiFillHome } from "react-icons/ai";
import { api } from "../utils/api";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";
import { GridLoader } from "react-spinners";
import PlayerPreview from "../components/util/PlayerPreview";
import ContentPreview from "../components/previews/ContentPreview";
import PlayerContentListPreview from "../components/previews/PlayerContentListPreview";
const PlayersList: NextPage = () => {
  const { data, fetchNextPage, isInitialLoading } = api.players.getAllPlayersWithContent.useInfiniteQuery({
    limit: 3,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })
  const players = data?.pages.flat().map(x => x.items).flat() ?? []
  const lastPage = data?.pages[data.pages.length - 1]
  const ref = useRef<HTMLDivElement>(null!)
  const entry = useIntersectionObserver(ref, {
    threshold: 1
  })
  useEffect(() => {
    if (entry?.isIntersecting && lastPage?.nextCursor && !isInitialLoading) {
      fetchNextPage()
    }
  }, [entry?.isIntersecting, fetchNextPage, isInitialLoading, lastPage?.nextCursor])

  console.log(entry?.isIntersecting, lastPage?.nextCursor);


  return (
    <>
      <Head>
        <title>RFBW - Галерея</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center ">
        <div className="container max-w-7xl ">
          <div className="my-4">
            <div className="flex flex-col items-center justify-center gap-1">
              <div className="text-4xl text-center">Галерея Участников</div>
              {players.map((player, i) => <div key={i} className="flex flex-row gap-2 w-full ">
                <div className="w-3/12 h-[380px]">
                  <PlayerPreview className="mt-2" motto={player.about} name={player.name} imageUrl={player.imageUrl as string} />
                </div>
                <div className="w-9/12 me-4">
                  {player.ownedContent.length > 0 ?
                    <PlayerContentListPreview content={player.ownedContent} /> :
                    <div className="text-center text-2xl h-full flex justify-center items-center pb-12">Здесь пока ничего нет...</div>}

                </div>
              </div>)}
            </div>
          </div>
        </div>

        {/* Player list extender */}
        <div ref={ref}> {lastPage?.nextCursor && <GridLoader color="rgb(8 51 68)" />}</div>





        <Link href={'/home'} className="fixed left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
      </main>
    </>
  );
};

export default PlayersList;

