import { type NextPage } from "next";
import Head from "next/head";
import MainUILayer from "../components/MainUILayer";
import GameCanvas from "../components/Three/GameCanvas";
import { Button, Card } from "react-daisyui";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Link from "next/link";
import { GiIsland } from "react-icons/gi";
import { CiViewList } from "react-icons/ci";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Shrikhand } from "next/font/google";
import { FaUserEdit } from "react-icons/fa"

const shrikhand = Shrikhand({
  style: ['normal'],
  subsets: ['latin', 'latin-ext'],
  display: "auto",
  weight: '400',
});
const GameField: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()
  if (status === 'unauthenticated')
    router.push('/')
  return (
    <>
      <Head>
        <title >RFBW - Field</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b ">
        <h1 style={{ fontFamily: shrikhand.style.fontFamily }} className={` text-lime-100 flex flex-col items-center justify-center text-8xl -mt-24`}>RFBW 3</h1>
        <h1 style={{ fontFamily: shrikhand.style.fontFamily }} className={` text-lime-100 flex flex-col items-center justify-center text-2xl mb-8 pe-2`}>Rice Fields Bizarre Wandering</h1>
        {
          status === 'authenticated' && <div className="grid grid-cols-3 grid-rows-4 gap-4 grid-flow-col w-[46rem] h-[15rem] ">
            <HomeButton w={1} h={4} href="/game" className="under-construction border-cyan-700 hover:border-cyan-700" disabled>
              <div className="flex flex-col items-center justify-center gap-1">
                <GiIsland className="text-6xl" />
                <div className="text-2xl">Начать <br />Gaming</div>
              </div>
            </HomeButton>
            <HomeButton w={1} h={4} href="/editor" className={``}>
              <div className="flex flex-col items-center justify-center gap-1">
                <CiViewList className="text-6xl" />
                <div className="text-2xl mt-1">Редактор <br />Контента</div>
              </div>
            </HomeButton>
            <HomeButton w={1} h={1} href="/me">Мой Профиль<FaUserEdit className="ms-1 text-lg" /></HomeButton>
            <HomeButton w={1} h={1} href="/players">Участники</HomeButton>
            <HomeButton w={1} h={1} href="/rules">Читай Правила</HomeButton>
            <HomeButton w={1} h={1} onClick={() => signOut()}>Log out</HomeButton>
          </div>
        }
      </main>
    </>
  );
};
//DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
const HomeButton: React.FC<React.PropsWithChildren<{ w?: number, h?: number, href?: string, onClick?: () => void, className?: string, disabled?: boolean }>> = (props) => {
  const { children, w = 1, h = 1, href, onClick, className, disabled } = props;
  const but = <Button disabled={disabled} onClick={onClick} className={`min-h-full text-lime-100 min-w-full row-span-${h} col-span-${w} border-4 border-cyan-500 hover:border-cyan-500 rounded-3xl  bg-teal-800 hover:bg-cyan-700 bg-opacity-0 hover:bg-opacity-100 flex items-center justify-center ${className ?? ''}`}>
    {children}
  </Button>
  if (href && !disabled)
    return <Link href={href} className={`row-span-${h} col-span-${w}`}>{but}</Link>
  return but
}
export default GameField;

