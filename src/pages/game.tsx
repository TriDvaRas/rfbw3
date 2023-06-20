import { type NextPage } from "next";
import Head from "next/head";
import MainUILayer from "../components/MainUILayer";
import GameCanvas from "../components/Three/GameCanvas";
import { Button } from "react-daisyui";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
const GameField: NextPage = () => {

  return (
    <>
      <Head>
        <title>RFBW - Поле</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <GameCanvas />


        <Link href={'/home'} className="absolute left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl"/>
          </Button>
        </Link>
      </main>
    </>
  );
};

export default GameField;

