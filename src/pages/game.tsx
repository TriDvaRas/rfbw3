import { type NextPage } from "next";
import Head from "next/head";
import MainUILayer from "../components/MainUILayer";
import GameCanvas from "../components/Three/GameCanvas";

const GameField: NextPage = () => {

  return (
    <>
      <Head>
        <title>RFBW - Field</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <GameCanvas />
        {/* <MainUILayer /> */}
      </main>
    </>
  );
};

export default GameField;

