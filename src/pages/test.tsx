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
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import PlayerSphere from "../components/Three/GameField/PlayerSphere";
import { OrbitControls } from "@react-three/drei";


const url = 'https://tdr-starlight-my-ass-98.s3.eu-central-1.amazonaws.com/rfbw/tridvaras/7e5e637c-371b-4f18-af17-9abc66d85734-157ad33ab3ae2e1f70bd9bda8dcb4eb4.jpg'

const GameField: NextPage = () => {
  return (
    <>
      <Head>
        <title>RFBW - Поле</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <img src={url} alt="field" className="w-16 h-16" />
        <Canvas className="w-64 h-64">
          <PlayerSphere />
          <OrbitControls />
        </Canvas>
      </main>
    </>
  );
};


export default GameField;

