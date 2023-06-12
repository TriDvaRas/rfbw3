import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { Avatar, Button, FileInput, Form, Hero, Input, InputGroup, Steps, Textarea } from 'react-daisyui';
import { BsDiscord } from 'react-icons/bs';
import { ImExit } from "react-icons/im";
import { api } from "../utils/api";
import { useFileUpload } from "../hooks/useFileUpload";

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
      utils.users.getMe.setData(undefined, () => {
        return data
      })
    }
  })
  const { mutate: mutateMyPlayer, isLoading: isMyPlayerLoading } = api.players.createMyPlayer.useMutation({
    onSettled() {
      utils.players.getMyPlayer.invalidate()
    },
    onSuccess(data) {
      utils.players.getMyPlayer.setData(undefined, () => {
        return data
      })
    }
  })



  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    onSuccess(url) {
      setLocalImageSource(url)
    }
  })


  const [applicationMesage, setApplicationMesage] = useState<string>('')
  const [localImageSource, setLocalImageSource] = useState<string | undefined>(undefined)
  const [localPlayerName, setLocalPlayerName] = useState('')
  const [localPlayerDescription, setLocalPlayerDescription] = useState('')

  function submitApplication() {
    if (isApplicationSaving) return
    mutateApplicationMessage(applicationMesage)
  }
  return (
    <>
      <Head>
        <title>RFBW - Регистрация</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button className="absolute m-3 right-0 btn-md " shape="circle" onClick={() => signOut()}><ImExit className="-me-1" /></Button>
      <main className="flex min-h-screen flex-col items-center justify-start ">

        <Steps className="mt-3 -mb-9">
          <Steps.Step color="primary">Создание Аккаунта</Steps.Step>
          <Steps.Step color={me ? 'primary' : 'neutral'}>Подача Заявка</Steps.Step>
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
                  console.log('submit');
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
                  console.log('submit');

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
                {localImageSource ?
                  <Avatar size={256} shape={'circle'} letters={(localPlayerName || me.name).split('').filter(x => /[А-ЯA-Z]/.test(x)).filter((_, i, a) => i == 0 || i == a.length - 1).join('')} src={localImageSource} /> :
                  <Avatar size={256} shape={'circle'} letters={(localPlayerName || me.name).split('').filter(x => /[А-ЯA-Z]/.test(x)).filter((_, i, a) => i == 0 || i == a.length - 1).join('')} className="text-7xl" />}
                <h3 className="text-3xl font-bold mt-2 mb-0">{localPlayerName || me.name}</h3>
                <h5 className="text-lg font-thin mt-0 mb-5">{localPlayerDescription}</h5>
                <Form className="">
                  {/* profile image */}
                  <Form.Label title="Аватар" />
                  <FileInput
                    disabled={isMyPlayerLoading || isUploading}
                    bordered onChange={(e) => {
                      e.preventDefault()
                      const file = (e.currentTarget.files ?? [])[0]
                      if (file) {
                        startUpload(file)
                      }
                    }} />
                  {/* Player name */}
                  <Form.Label title="Имя" />
                  <Input placeholder="Имя" value={localPlayerName} onInput={(e) => setLocalPlayerName(e.currentTarget.value)} />
                  {/* Player description */}
                  <Form.Label title="Девиз" />
                  <Textarea placeholder="" className="resize-none h-24 rounded-scollable" value={localPlayerDescription} onInput={(e) => setLocalPlayerDescription(e.currentTarget.value)} />
                  <Form.Label ><span className="label-text-alt text-slate-500">Желательно что то короткое и пафосное</span></Form.Label>
                  <Button color="primary" loading={isMyPlayerLoading} disabled={isMyPlayerLoading || isUploading || localPlayerName.length == 0 || localPlayerDescription.length == 0}>Сохранить</Button>
                </Form>

              </div>
            }
          </Hero.Content>
        </Hero>
      </main>
    </>
  );
};

export default GameField;

