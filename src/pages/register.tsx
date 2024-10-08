import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Button, FileInput, Form, Hero, Input, InputGroup, RadialProgress, Steps, Textarea } from 'react-daisyui';
import { BsDiscord } from 'react-icons/bs';
import { ImExit } from "react-icons/im";
import { api } from "../utils/api";
import { useFileUpload } from "../hooks/useFileUpload";
import Avatar from "../components/util/Avatar";
import { getNameInitials } from "../utils/text";
import Link from "next/link";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { PlayerProfileSchema, playerProfileSchema } from "./me";
import { zodResolver } from "@hookform/resolvers/zod";
import PlayerPreview from "../components/util/PlayerPreview";

const GameField: NextPage = () => {
  const utils = api.useContext()
  const { status: sessionStatus, data } = useSession();
  const { data: me } = api.users.getMe.useQuery();
  const { data: player } = api.players.getMyPlayer.useQuery()
  const { mutate: mutateApplicationMessage, isLoading: isApplicationSaving, } = api.users.updateApplicationMessage.useMutation({
    onSettled() {
      utils.users.getMe.invalidate()
    },
    onSuccess(data) {
      toast.success('Заявка отправлена')
      utils.users.getMe.setData(undefined, () => {
        return data
      })
    },
    onError(err) {
      toast.error(err.message)
    }
  })
  const { mutate: mutateMyPlayer, isLoading: isMyPlayerLoading } = api.players.createMyPlayer.useMutation({
    onSettled() {
      utils.players.getMyPlayer.invalidate()
    },
    onSuccess(data) {
      toast.success('Профиль создан')
      utils.players.getMyPlayer.setData(undefined, () => {
        return data
      })
    },
    onError(err) {
      toast.error(err.message)
    }
  })


  const playerForm = useForm<PlayerProfileSchema>({
    defaultValues: {
      imageUrl: '',
      name: '',
      motto: '',
    },
    resolver: zodResolver(playerProfileSchema),
  });
  const { imageUrl, motto, name } = playerForm.watch()

  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    onSuccess(url) {
      playerForm.setValue('imageUrl', url)
      playerForm.trigger('imageUrl')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })

  const [applicationMesage, setApplicationMesage] = useState<string>('')

  function submitApplication() {
    if (isApplicationSaving) return
    mutateApplicationMessage(applicationMesage)
  }
  if (sessionStatus === 'loading')
    return <div></div>
  return (
    <>
      <Head>
        <title>RFBW - Регистрация</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {sessionStatus == 'authenticated' && <Button className="absolute m-3 right-0 btn-md " shape="circle" onClick={() => signOut()}><ImExit className="-me-1" /></Button>}
      <main className="flex min-h-screen flex-col items-center justify-start ">

        <Steps className="mt-3 -mb-9">
          <Steps.Step color="primary">Создание Аккаунта</Steps.Step>
          <Steps.Step color={me ? 'primary' : 'neutral'}>Подача Заявки</Steps.Step>
          <Steps.Step color={me?.canBecomePlayer ? 'primary' : 'neutral'}>Создание Профиля</Steps.Step>
          <Steps.Step color={player ? 'primary' : 'neutral'}>Смерть</Steps.Step>
        </Steps>

        <Hero className="my-auto">
          <Hero.Content className="text-center">
            {/*//! STEP 1 */}
            {
              sessionStatus == 'unauthenticated' && <div className="max-w-md">
                <h1 className="text-5xl font-bold">Регистрация</h1>
                <h3 className="text-2xl font-bold mt-1">Создание Аккаунта</h3>
                <p className="py-6 -mt-1">Для начала регистрации нужно привязать аккаунт Discord</p>
                <div className="flex flex-row justify-center">
                  <button onClick={() => signIn('discord')} className="btn btn-primary btn-md bg-[#5865F2]  border-[#5865F2] hover:border-[#3b44ae]/90 hover:bg-[#3b44ae]/90 text-white">
                    <BsDiscord className="me-1 text-xl" />
                    Sign in With Discord
                  </button>
                </div>
              </div>
            }
            {/*//! STEP 2 */}
            {
              sessionStatus == 'authenticated' && !player && !me?.canBecomePlayer && typeof me?.applicationComment !== 'string' && <div className="max-w-md">
                <h1 className="text-5xl font-bold">Регистрация</h1>
                <h3 className="text-2xl font-bold mt-1">Заявка на участие</h3>
                <p className="py-6 -mt-1">Теперь опиши почему именно ты достоин в этом учавствовать.</p>
                <Form onSubmit={(e) => {
                  e.preventDefault()
                  submitApplication()
                }}>
                  <InputGroup className="flex justify-center items-center">
                    <Input placeholder="Сообщение" value={applicationMesage} onInput={(e) => setApplicationMesage(e.currentTarget.value)} />
                    <Button color="primary" type='submit' loading={isApplicationSaving} disabled={isApplicationSaving || applicationMesage.length == 0}>Отправить</Button>
                  </InputGroup>
                </Form>
              </div>
            }
            {
              sessionStatus == 'authenticated' && !player && !me?.canBecomePlayer && typeof me?.applicationComment === 'string' && <div className="max-w-md">
                <h1 className="text-5xl font-bold">Регистрация</h1>
                <h3 className="text-2xl font-bold mt-1">Заявка на участие</h3>
                <p className="py-6 -mt-1">Заявка есть✔️. Пни кого нибудь что бы приняли. Ты все еще можешь изменить текст заявки.</p>
                <Form onSubmit={(e) => {

                  e.preventDefault()
                  submitApplication()
                }}>
                  <InputGroup className="flex justify-center items-center">
                    <Input placeholder="Сообщение" value={applicationMesage || me.applicationComment} onInput={(e) => setApplicationMesage(e.currentTarget.value)} />
                    <Button color="primary" type='submit' loading={isApplicationSaving} disabled={isApplicationSaving || applicationMesage.length == 0 || applicationMesage == me.applicationComment}>Обновить</Button>
                  </InputGroup>
                </Form>
              </div>
            }
            {/*//! STEP 3 */}
            {
              sessionStatus == 'authenticated' && !player && me?.canBecomePlayer && <div className="max-w-md">
                <h1 className="text-5xl font-bold">Регистрация</h1>
                <h3 className="text-2xl font-bold mt-1 mb-5">Создание профиля игрока</h3>
                {/* <p className="py-6 -mt-1">Хуй.</p> */}
                <PlayerPreview motto={motto} name={name} imageUrl={imageUrl||'/errorAvatar.jpg'} isUploading={isUploading} progress={progress} />
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
            }
            {/*//! STEP 4 */}
            {sessionStatus == 'authenticated' && player && <div className="max-w-md">
              <Avatar size={256} shape={'circle'} letters={getNameInitials(player.name)} src={player.imageUrl} className="text-7xl" />
              <h3 className="text-3xl font-bold mt-2 mb-0">{player.name}</h3>
              <h5 className="text-lg font-thin mt-0 mb-5">{player.about}</h5>
              <h3 className="text-2xl font-bold mt-1 mb-5">Добро пожаловать :)</h3>
              <Link href={'/home'}>
                <Button className="h-32 w-32 relative" shape="circle" color="error">
                  <div style={{
                    width: '0',
                    height: '0',
                    borderBottom: '28px solid lime',
                    borderLeft: '18px solid transparent',
                    borderRight: '0px solid transparent',
                    position: 'absolute',
                    top: '-20px',
                    left: 'calc(50% - 5px)',
                    transform: 'rotate(38deg)',
                  }}></div>

                  <div style={{
                    width: '0',
                    height: '0',
                    borderBottom: '17px solid lime',
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    position: 'absolute',
                    top: '-20px',
                    left: 'calc(50% - 6px)',
                    transform: 'rotate(-7deg)',
                  }}></div>
                  <div style={{
                    width: '0',
                    height: '0',
                    borderBottom: '28px solid lime',
                    borderLeft: '0px solid transparent',
                    borderRight: '17.5px solid transparent',
                    position: 'absolute',
                    top: '-20px',
                    left: 'calc(50% - 14px)',
                    transform: 'rotate(-32deg)',
                  }}></div>
                  <h1 className="text-7xl pt-1" title="舞台少女の死">死</h1>
                </Button>
              </Link>
            </div>}
          </Hero.Content>
        </Hero>
      </main>
    </>
  );
};

export default GameField;

