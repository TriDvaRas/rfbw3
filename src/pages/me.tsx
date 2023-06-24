import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Button, FileInput, Form, Hero, Input, InputGroup, RadialProgress, Steps, Textarea } from 'react-daisyui';
import { BsDiscord } from 'react-icons/bs';
import { ImExit } from "react-icons/im";
import { api } from "../utils/api";
import { useFileUpload } from "../hooks/useFileUpload";
import Avatar from "../components/util/Avatar";
import { getNameInitials } from "../utils/text";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiFillHome } from "react-icons/ai";
import PlayerPreview from "../components/util/PlayerPreview";

export const playerProfileSchema = z.object({
  imageUrl: z.string().min(1, { message: `I can't see` }),
  name: z.string().min(1, { message: 'А кто)' }).max(16, { message: 'Максимальная длина 16 символов' }),
  motto: z.string().min(1, { message: 'Пиши давай)' }).max(100, { message: 'Максимальная длина 100 символов' }),
})
export type PlayerProfileSchema = z.infer<typeof playerProfileSchema>

const GameField: NextPage = () => {
  const { status: sessionStatus } = useSession()
  const router = useRouter()
  const { data: player, status: meStatus } = api.players.getMyPlayer.useQuery()
  const [initialFormStateHydrated, setInitialFormStateHydrated] = useState(false)
  const playerForm = useForm<PlayerProfileSchema>({
    defaultValues: {
      imageUrl: '',
      name: '',
      motto: '',
    },
    resolver: zodResolver(playerProfileSchema),
  });
  useEffect(() => {
    if (player && !initialFormStateHydrated) {
      playerForm.reset({
        imageUrl: player.imageUrl as string,
        name: player.name,
        motto: player.about,
      })
      setInitialFormStateHydrated(true)
    }
  }, [player, initialFormStateHydrated, playerForm])

  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    onSuccess(url) {
      playerForm.setValue('imageUrl', url)
      playerForm.trigger('imageUrl')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })
  const { imageUrl, motto, name } = playerForm.watch()

  const { mutate: mutateMyPlayer, isLoading: isMyPlayerLoading } = api.players.updateMyPlayer.useMutation()

  if (sessionStatus === 'unauthenticated')
    router.push('/')
  if (sessionStatus === 'loading' || meStatus === 'loading')
    return null
  if (meStatus === 'error' || !player)
    router.push('/register')
  return (
    <>
      <Head>
        <title>RFBW - Регистрация</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-start ">

        <Hero className="my-auto">
          <Hero.Content className="text-center">
            < div className="max-w-md">
              <h3 className="text-2xl font-bold mt-1 mb-5">Изменение профиля игрока</h3>
              {/* <p className="py-6 -mt-1">Хуй.</p> */}
              <PlayerPreview motto={motto} name={name} imageUrl={imageUrl} isUploading={isUploading} progress={progress} />
              <Form className="" onSubmit={playerForm.handleSubmit((data) => {
                mutateMyPlayer(data, {
                  onSuccess() {
                    toast.success('Профиль обновлен')
                  },
                  onError(err) {
                    toast.error(`Ошибка обновления: ${err}`)
                  }
                })
              })}>
                {/* profile image */}
                <Form.Label title="Аватар" />
                <FileInput
                  color={playerForm.formState.errors.imageUrl ? 'error' : undefined}
                  disabled={isMyPlayerLoading || isUploading}
                  bordered onChange={(e) => {
                    e.preventDefault()
                    const file = (e.currentTarget.files ?? [])[0]
                    if (file) {
                      startUpload(file)
                    }
                  }} />
                {
                  playerForm.formState.errors.imageUrl && <span className=" label-text-alt text-error block mt-0.5 ms-3">{playerForm.formState.errors.imageUrl.message}</span>
                }
                {/* Player name */}
                <Form.Label title="Имя" color={playerForm.formState.errors.name ? 'error' : undefined} />
                <Input  {...playerForm.register('name')} />
                {
                  playerForm.formState.errors.name && <span className=" label-text-alt text-error block mt-0.5 ms-3">{playerForm.formState.errors.name.message}</span>
                }
                {/* Player description */}
                <Form.Label title="Девиз" color={playerForm.formState.errors.motto ? 'error' : undefined} />
                <Textarea {...playerForm.register('motto')} className="resize-none h-24 rounded-scollable" />
                {
                  playerForm.formState.errors.motto && <span className=" label-text-alt text-error block mt-0.5 ms-3">{playerForm.formState.errors.motto.message}</span>
                }

                <Form.Label ><span className="label-text-alt text-slate-500">Желательно что то короткое и пафосное</span></Form.Label>
                <Button color="primary" loading={isMyPlayerLoading} disabled={isMyPlayerLoading || isUploading || (playerForm.formState.errors && !playerForm.formState.isValid)}>Сохранить</Button>
              </Form>

            </div>

          </Hero.Content>
        </Hero>
      </main >
      <Link href={'/home'} className="absolute left-4 top-4">
        <Button color="secondary" shape="circle">
          <AiFillHome className="text-xl" />
        </Button>
      </Link>
    </>
  );
};

export default GameField;

