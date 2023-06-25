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
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { api } from "../utils/api";
import { BounceLoader, GridLoader } from "react-spinners";
import ContentPreview from "../components/previews/ContentPreview";
import { Content, ContentDLC } from "@prisma/client";
import EditAnimeModal from "../components/modals/EditAnimeModal";
import { toast } from "react-toastify";
import EditMovieModal from "../components/modals/EditMovieModal";
import EditGameModal from "../components/modals/EditGameModal";


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
  const { data: me, status: meStatus } = api.players.getMyPlayer.useQuery()
  const { data: myContent, status: myContentStatus, refetch: refetchMyContent } = api.content.getMyContent.useQuery()
  const { mutate: deleteContent } = api.content.deleteContent.useMutation({
    onSuccess: () => {
      toast.success('Удалено')
      refetchMyContent()
    },
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })
  const [showNewGameModal, setShowNewGameModal] = useState(false)
  const [showNewMovieModal, setShowNewMovieModal] = useState(false)
  const [showNewAnimeModal, setShowNewAnimeModal] = useState(false)

  const [selectedEditContent, setSelectedEditContent] = useState<Content & {
    DLCs: ContentDLC[];
  } | undefined>(undefined)

  if (status === 'unauthenticated')
    router.push('/')
  if (status === 'loading' || meStatus === 'loading')
    return null
  if (meStatus === 'error' || (meStatus === 'success' && !me))
    router.push('/register')
  const games = myContent?.filter(c => c.type === 'game') ?? []
  const movies = myContent?.filter(c => c.type === 'movie') ?? []
  const animes = myContent?.filter(c => c.type === 'anime') ?? []
  return (
    <>
      <Head>
        <title >RFBW - Редактор</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b ">
        {
          status === 'authenticated' && <div className="container max-w-5xl ">
            <div className="col-span-3 row-span-1 my-4">
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="text-4xl text-center">Редактор Контента</div>
                <div className="text-center px-16">Данный элемент программного интерфейса предназначен для редактирования и добавления контента в ваш список, который пойдет в общий список контента, который будет выпадать всем игрокам во время ивента. Просим отнестись (сись) к заполнению серьезно! Мы рекомендуем добавить хотя бы по 4 в каждой категории, по возможности обязательно добавить везде жанр и продолжительность и читать правила, спасибо!</div>
                <div className="flex flex-row justify-center items-center gap-2 my-3">
                  {/* <InputGroup>
                    <span className="bg-slate-900 -me-2">Импорт:</span>
                    <Button color="secondary" size="sm">HowLongToBeat</Button>
                    <Button color="secondary" size="sm" disabled>IMDB</Button>
                    <Button color="secondary" size="sm">Shikimori</Button>
                    <Button color="secondary" size="sm">RFBW</Button>
                  </InputGroup> */}
                  <Button color="primary" size="sm" onClick={() => setShowNewGameModal(true)}>Добавить Игру</Button>
                  <Button color="primary" size="sm" onClick={() => setShowNewMovieModal(true)}>Добавить Кино</Button>
                  <Button color="primary" size="sm" onClick={() => setShowNewAnimeModal(true)}>Добавить Аниме</Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 grid-rows-1 ">
              <div className="col-span-1 row-span-1 flex flex-col items-center gap-2">
                <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">
                  Игры
                  <Badge size="lg"
                    color={games.length > 3 ? "secondary" : games.length > 2 ? "warning" : "error"}>
                    {games.length ?? <BounceLoader size={7} />}
                  </Badge>
                </div>
                {
                  games.length > 0 && games.map(game => <ContentPreview key={game.id} label={game.label} type="game" imageUrl={game.imageId}
                    onEdit={() => setSelectedEditContent(game)}
                    onDelete={() => deleteContent(game.id)} />)
                }
              </div>
              <div className="col-span-1 row-span-1 flex flex-col items-center gap-2">
                <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">
                  Кино
                  <Badge size="lg"
                    color={movies.length > 3 ? "secondary" : movies.length > 2 ? "warning" : "error"}>
                    {movies.length ?? <BounceLoader size={7} />}
                  </Badge>
                </div>
                {
                  movies.length > 0 && movies.map(movie => <ContentPreview key={movie.id} label={movie.label} type="movie" imageUrl={movie.imageId}
                    onEdit={() => setSelectedEditContent(movie)}
                    onDelete={() => deleteContent(movie.id)} />)
                }
                {myContentStatus === 'loading' && <div className="flex items-center justify-center h-[60vh]">
                  <GridLoader color="#36d7b788" />
                </div>}
              </div>
              <div className="col-span-1 row-span-1 flex flex-col items-center gap-2">
                <div className="text-2xl text-center flex flex-row justify-center items-center gap-1">
                  Аниме
                  <Badge size="lg"
                    color={animes.length > 3 ? "secondary" : animes.length > 2 ? "warning" : "error"}>
                    {animes.length ?? <BounceLoader size={7} />}
                  </Badge>
                </div>
                {
                  animes.length > 0 && animes.map(anime => <ContentPreview key={anime.id}
                    label={anime.label}
                    type="anime"
                    imageUrl={anime.imageId}
                    onEdit={() => setSelectedEditContent(anime)}
                    onDelete={() => deleteContent(anime.id)}
                  />)
                }
              </div>
            </div>
          </div>

        }
        <CreateGameModal open={showNewGameModal} onClose={() => setShowNewGameModal(false)} onSuccess={() => { setShowNewGameModal(false); refetchMyContent() }} />
        <CreateMovieModal open={showNewMovieModal} onClose={() => setShowNewMovieModal(false)} onSuccess={() => { setShowNewMovieModal(false); refetchMyContent() }} />
        <CreateAnimeModal open={showNewAnimeModal} onClose={() => setShowNewAnimeModal(false)} onSuccess={() => { setShowNewAnimeModal(false); refetchMyContent() }} />

        {selectedEditContent?.type === 'game' &&
          <EditGameModal open={selectedEditContent?.type === 'game'} onClose={() => setSelectedEditContent(undefined)} onSuccess={() => { setSelectedEditContent(undefined); refetchMyContent() }} gameId={selectedEditContent.id} defaultValues={{
            label: selectedEditContent.label,
            imageURL: selectedEditContent.imageId,
            dlcs: selectedEditContent.DLCs.map(dlc => ({
              label: dlc.label,
              hours: +dlc.hours,
              title: dlc.title,
              endCondition: dlc.endCondition,
              position: dlc.position,
            })),
            endCondition: selectedEditContent.endCondition,
            maxPlayers: selectedEditContent.maxCoopPlayers,
            genres: selectedEditContent.genres,
            fullname: selectedEditContent.title,
            hours: +selectedEditContent.hours,
            comments: selectedEditContent.comments,
          }} />}
        {selectedEditContent?.type === 'movie' &&
          <EditMovieModal open={selectedEditContent?.type === 'movie'} onClose={() => setSelectedEditContent(undefined)} onSuccess={() => { setSelectedEditContent(undefined); refetchMyContent() }} movieId={selectedEditContent.id} defaultValues={{
            label: selectedEditContent.label,
            imageURL: selectedEditContent.imageId,
            dlcs: selectedEditContent.DLCs.map(dlc => ({
              label: dlc.label,
              hours: +dlc.hours,
              title: dlc.title,
              position: dlc.position,
            })),
            genres: selectedEditContent.genres,
            fullname: selectedEditContent.title,
            hours: +selectedEditContent.hours,
            comments: selectedEditContent.comments,
          }} />}
        {selectedEditContent?.type === 'anime' &&
          <EditAnimeModal open={selectedEditContent?.type === 'anime'} onClose={() => setSelectedEditContent(undefined)} onSuccess={() => { setSelectedEditContent(undefined); refetchMyContent() }} animeId={selectedEditContent.id} defaultValues={{
            label: selectedEditContent.label,
            imageURL: selectedEditContent.imageId,
            dlcs: selectedEditContent.DLCs.map(dlc => ({
              label: dlc.label,
              hours: +dlc.hours,
              title: dlc.title,
              position: dlc.position,
            })),
            genres: selectedEditContent.genres,
            fullname: selectedEditContent.title,
            hours: +selectedEditContent.hours,
            comments: selectedEditContent.comments,
          }} />}

        <Link href={'/home'} className="absolute left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
      </main>
    </>
  );
};

export default Editor;

