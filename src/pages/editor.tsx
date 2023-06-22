import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Badge, Button, ButtonGroup, Form, Input, InputGroup, Modal } from "react-daisyui";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFileUpload } from '../hooks/useFileUpload';
import CreateGameModal from "../components/modals/CreateGameModal";
import CreateMovieModal from "../components/modals/CreateMovieModal";
import CreateAnimeModal from "../components/modals/CreateAnimeModal";


const gameFormSchema = z.object({
  label: z.string().max(16, { message: 'Максимальная длина 16 символов' }),
  fullname: z.string(),
  maxPlayers: z.number().min(1, { message: 'Как у тебя может быть меньше 1 игрока?)' }),
  hasDifficulty: z.boolean(),
  endCondition: z.string().min(1, { message: 'Условие завершения не может быть пустым' }),
  imageURL: z.string().min(1, { message: 'Картинка обязательна' }),
  comments: z.string().optional(),
  genres: z.string().array().optional(),
})
type GameFormSchema = z.infer<typeof gameFormSchema>






const Editor: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()

  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [showNewMovieModal, setShowNewMovieModal] = useState(false)
  const [showNewAnimeModal, setShowNewAnimeModal] = useState(false)

  if (status === 'unauthenticated')
    router.push('/')
  if (status === 'loading')
    return <div></div>
  return (
    <>
      <Head>
        <title >RFBW - Редактор</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b ">
        {
          status === 'authenticated' && <div className="grid grid-cols-3 grid-rows-2 container max-w-4xl ">
            <div className="col-span-3 row-span-1 my-4">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="text-4xl text-center">Редактор Контента</div>
                <div className="text-center px-12">Данный элемент программного интерфейса предназначен для редактирования и добавления контента в ваш список, который пойдет в общий список контента, который будет выпадать всем игрокам во время ивента. Просим отнестись (сись) к заполнению серьезно, <s>по возможности</s> обязательно добавить везде жанр и продолжительность, спасибо!</div>
                <div className="flex flex-row justify-center items-center gap-2 my-3">
                  {/* <InputGroup>
                    <span className="bg-slate-900 -me-2">Импорт:</span>
                    <Button color="secondary" size="sm">HowLongToBeat</Button>
                    <Button color="secondary" size="sm" disabled>IMDB</Button>
                    <Button color="secondary" size="sm">Shikimori</Button>
                    <Button color="secondary" size="sm">RFBW</Button>
                  </InputGroup> */}
                  <Button color="primary" className="" size="sm" onClick={() => setShowNewGameModal(true)}>Добавить Игру</Button>
                  <Button color="primary" size="sm" onClick={() => setShowNewMovieModal(true)}>Добавить Кино</Button>
                  <Button color="primary" size="sm" onClick={() => setShowNewAnimeModal(true)}>Добавить Аниме</Button>
                </div>
              </div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">Игры<Badge size="lg" color="warning">1</Badge></div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">Кино<Badge size="lg" color="error">0</Badge></div>
            </div>
            <div className="col-span-1 row-span-1">
              <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">Аниме<Badge size="lg" color="secondary">12</Badge></div>
            </div>
          </div>
        }
        <CreateGameModal open={showNewGameModal} onClose={() => setShowNewGameModal(false)} onSuccess={() => setShowNewGameModal(false)} />
        <CreateMovieModal open={showNewMovieModal} onClose={() => setShowNewMovieModal(false)} onSuccess={() => setShowNewMovieModal(false)} />
        <CreateAnimeModal open={showNewAnimeModal} onClose={() => setShowNewAnimeModal(false)} onSuccess={() => setShowNewAnimeModal(false)} />
      </main>
    </>
  );
};

export default Editor;

