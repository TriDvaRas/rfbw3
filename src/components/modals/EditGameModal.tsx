import { zodResolver } from '@hookform/resolvers/zod';
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Button, Card, Collapse, FileInput, Form, Input, Modal, Swap, Textarea } from "react-daisyui";
import { Controller, useForm } from 'react-hook-form';
import { BiCollapseVertical } from 'react-icons/bi';
import { MdDeleteForever } from "react-icons/md";
import { RiPencilFill } from 'react-icons/ri';
import Select from 'react-select';
import { toast } from 'react-toastify';
import globalConfig from "../../globalConfig";
import { useFileUpload } from "../../hooks/useFileUpload";
import reactSelectDarkTheme from "../../styles/reactSelectDarkTheme";
import { api } from "../../utils/api";
import { GenreId, genreIdToName } from "../../utils/genres";
import ContentPreview from '../previews/ContentPreview';
import Avatar from "../util/Avatar";
import { GameDLCSchema, GameFormSchema, gameFormSchema } from './CreateGameModal';



const gameGenres = Array.from(genreIdToName.entries())
const gameGenresOptions = _.orderBy(gameGenres.filter(x => globalConfig.genres.games.includes(x[1])).map(([id, name]) => ({ value: id, label: name })), 'id', 'asc')

interface Props {
  gameId: string
  onSuccess: (data: GameFormSchema) => void
  onClose: () => void
  open: boolean
  closeOnBackdropClick?: boolean
  defaultValues: GameFormSchema
}

const EditGameModal: React.FC<Props> = (props) => {
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const { data: me } = api.players.getMyPlayer.useQuery()
  const [collapsedDlcs, setCollapsedDlcs] = useState<number[]>([])

  const { mutate: updateGameContentMutation, isLoading: isSaving } = api.content.updateGameContent.useMutation({
    onSuccess() {
      props.onSuccess(getGameValues())
      resetForm()
    },
    onError(err) {
      toast.error(`${err.message}`)
    }
  })

  const methods = useForm<GameFormSchema>({
    defaultValues: props.defaultValues,
    resolver: zodResolver(gameFormSchema),
  });
  const {
    register: registerGame,
    handleSubmit: handleGameSubmit,
    getValues: getGameValues,
    setValue: setGameValue,
    reset: resetGame,
    watch: watchGame,
    trigger: triggerGame,
    formState: { errors, isValid },
  } = methods
  const gameData = watchGame()
  const { fullname, imageURL, label, comments, genres, hours, dlcs } = gameData

  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    imageMinResolution:[320, 480],
    onSuccess(url) {
      setGameValue('imageURL', url)
      triggerGame('imageURL')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })
  function save() {
    updateGameContentMutation({
      id: props.gameId,
      data: gameData,
    })
  }
  function updateDLC(position: number, data: Partial<GameDLCSchema>) {
    const newData = [...dlcs]
    newData[position] = {
      ...newData[position],
      ...data,
    } as GameDLCSchema
    setGameValue('dlcs', newData)
    triggerGame('dlcs')
  }
  function addDLC() {
    const newData = [...dlcs]
    newData.push({
      hours: undefined as unknown as number,
      label: '',
      endCondition:'',
      position: dlcs.length,
      title: '',
    })
    setGameValue('dlcs', newData)
    triggerGame('dlcs')
  }
  function removeDlc(position: number) {
    const newData = [...dlcs]
    newData.splice(position, 1)
    setCollapsedDlcs(collapsedDlcs.filter(x => x !== position).map(x => x > position ? x - 1 : x))
    const resorted = newData.map((x, i) => ({ ...x, position: i }))
    setGameValue('dlcs', resorted)
    showValidationErrors && triggerGame('dlcs')
  }
  function toggleDlc(position: number) {
    if (collapsedDlcs.includes(position)) {
      setCollapsedDlcs(collapsedDlcs.filter(x => x !== position))
    } else {
      setCollapsedDlcs([...collapsedDlcs, position])
    }
  }
  function resetForm() {
    resetGame()
    setCollapsedDlcs([])
    setShowValidationErrors(false)
  }
  return (
    <>
      <Modal open={props.open} onClickBackdrop={() => props.closeOnBackdropClick && props.onClose()} className="w-11/12 max-w-7xl ">

        <Modal.Body className="flex flex-row w-full max-h-full">

          {/* //! 1 */}
          <div className="w-1/3 max-h-full">
            <Modal.Header className="mb-2">Редактирование Кино</Modal.Header>
            <Form onSubmit={(e) => { e.preventDefault(); }}>
              <div className="flex flex-row gap-2">
                <div className="w-7/12 relative">
                  <Form.Label title="Название" />
                  <Input  {...registerGame('label')} maxLength={16} className="w-full" color={errors.label ? 'error' : undefined} />
                  {errors.label && (
                    <span className=" label-text-alt text-error block mt-0.5 ms-3">
                      {errors.label.message}
                    </span>
                  )}
                </div>
                <div className="w-5/12">
                  <Form.Label title="Длительность" className="mx-1" />
                  <Input  {...registerGame('hours')} type='number' placeholder="(в часах)" min={0.1} step={0.1} max={98} className="w-full" color={errors.hours ? 'error' : undefined} />
                  {errors.hours && (
                    <span className=" label-text-alt text-error block mt-0.5">
                      {errors.hours.message}
                    </span>
                  )}
                </div>

              </div>
              <Form.Label title="Полное Название" />
              <Input  {...registerGame('fullname')} className="w-full" color={errors.fullname ? 'error' : undefined} />
              {errors.fullname && (
                <span className=" label-text-alt text-error block mt-0.5 ms-3">
                  {errors.fullname.message}
                </span>
              )}

              <Form.Label title="Картинка" />
              <FileInput
                bordered
                onChange={(e) => {
                  e.preventDefault()
                  const file = (e.currentTarget.files ?? [])[0]
                  if (file) {
                    startUpload(file)
                  }
                }}
                color={errors.imageURL ? 'error' : undefined}
              />
              {errors.imageURL && (
                <span className=" label-text-alt text-error block mt-0.5 ms-3">
                  {errors.imageURL.message}
                </span>
              )}
              <div className="flex flex-row justify-between items-center">
                <Form.Label title="Жанры" />
                <span className="label-text-alt px-1 py-1 text-slate-500">Не больше 3</span >
              </div>
              <Controller
                control={methods.control}
                defaultValue={[]}
                // rules=''
                name="genres"
                render={({ field, formState, fieldState }) => (
                  <div>
                    <Select
                      {...field}
                      {...reactSelectDarkTheme}
                      className={`w-full ${fieldState.error ? 'ring-error ring-1 ring-offset-0 ring-offset-slate-900' : undefined}`}
                      isMulti
                      placeholder='Star...'
                      // isDisabled={isSaving}
                      // isLoading={isCustomerListLoading}
                      isClearable={false}
                      isSearchable={false}
                      backspaceRemovesValue
                      value={(field.value || []).map(x => ({ value: x, label: genreIdToName.get(x)! }))}
                      options={gameGenresOptions}
                      menuPosition="absolute"
                      // menuIsOpen
                      menuPlacement="top"
                      onChange={val => {
                        val.length > 3 || setGameValue('genres', val.map(x => x.value as GenreId))
                        showValidationErrors && triggerGame('genres')
                      }}
                    />
                    {fieldState.error && (
                      <span className=" label-text-alt text-error block mt-0.5 ms-3">
                        {fieldState.error.message}
                      </span>
                    )}
                  </div>
                )}
              />

              <Form.Label title="Комментарии" />
              <Textarea className="resize-none h-32"  {...registerGame('comments')} />

            </Form>
          </div>
          {/* */}
          <div className="divider divider-horizontal"></div>
          {/* //! 2 */}
          <div className="w-1/3 max-h-full">
            <Form className="h-full max-h-full" onSubmit={(e) => { e.preventDefault(); }}>
              <Modal.Header className="mb-2">Дополнительные части/сезоны</Modal.Header>
              <div className="flex flex-col h-full  justify-center items-center">

                {dlcs.length == 0 && <span className="label-text-alt text-slate-400 block ">Тут пока ничего нет...</span>}
                {dlcs.length > 0 && <div className='max-h-[552px] overflow-x-clip overflow-y-auto  flex flex-col gap-1 -m-2 p-2 w-full'>
                  {dlcs.map((dlc, i) => (
                    // collapsedDlcs.includes(dlc.position) ?
                    //   <Card key={dlc.position} className="bg-slate-800 w-full p-2 py-1 flex flex-row items-center">
                    //     <div className='flex-grow'>
                    //       {dlc.label}
                    //     </div>
                    //     <div className='flex flex-row'>
                    //       <BsClockHistory /> {dlc.hours}
                    //     </div>
                    //     <Button onClick={() => removeDlc(dlc.position)} shape="circle" size={'sm'} color="ghost" className=""><RiPencilFill className="text-slate-400 text-2xl" /></Button>
                    //     <Button onClick={() => removeDlc(dlc.position)} shape="circle" size={'sm'} color="ghost" className=""><MdDeleteForever className="text-error text-2xl" /></Button>
                    //   </Card>
                    //   : 
                    <Card key={dlc.position} className={`bg-slate-800 w-full p-2 py-0 ${showValidationErrors && errors.dlcs && errors.dlcs[i] && collapsedDlcs.includes(i) ? 'ring-2 ring-error' : ''} `}>
                      <div className={`collapse  ${collapsedDlcs.includes(i) ? `collapse-closed` : `collapse-open`}`}  >
                        <Collapse.Title className="flex flex-row items-center justify-between p-0 ps-2 -my-2 " onClick={() => toggleDlc(dlc.position)}>
                          <div className='flex-grow'>
                            {dlc.label || "Sample Яйц"}
                          </div>
                          <Button shape="circle" size={'sm'} color="ghost" className=" ">
                            <Swap
                              active={collapsedDlcs.includes(i)}
                              onElement={<RiPencilFill className="text-slate-400 text-2xl" />}
                              offElement={<BiCollapseVertical className="text-slate-400 text-2xl" />}
                            />
                          </Button>
                          <Button onClick={() => removeDlc(dlc.position)} shape="circle" size={'sm'} color="ghost" className=" z-50"><MdDeleteForever className="text-error text-2xl " /></Button>
                        </Collapse.Title>
                        <Collapse.Content className='p-0 ' >
                          <div className="flex flex-row gap-1 w-full">
                            <div className="w-8/12 ">
                              <Form.Label title="Название" className=" py-1" />
                              <Input size='sm' maxLength={16} className="w-full" onChange={(e) => updateDLC(dlc.position, { label: e.target.value })}
                                color={showValidationErrors && errors.dlcs && errors.dlcs[i]?.label ? 'error' : undefined} value={dlc.label} />
                            </div>
                            <div className="w-4/12">
                              <Form.Label title="Длительность" className="py-1" />
                              <Input size='sm' type='number' placeholder="(в часах)" min={0.1} step={0.1} max={98} className="w-full" onChange={(e) => updateDLC(dlc.position, { hours: +e.target.value })}
                                color={showValidationErrors && errors.dlcs && errors.dlcs[i]?.hours ? 'error' : undefined} value={dlc.hours} />
                            </div>
                          </div>
                          <Form.Label title="Полное Название" className='py-1 w-full' />
                          <Input size='sm' className="w-full mb-2" onChange={(e) => updateDLC(dlc.position, { title: e.target.value })}
                            color={showValidationErrors && errors.dlcs && errors.dlcs[i]?.title ? 'error' : undefined} value={dlc.title} />
                        </Collapse.Content>
                      </div>
                    </Card>
                  ))}
                </div>}
                <div className={`min-h-16  flex justify-center items-center ${dlcs.length == 0 ? '' : 'grow'}`}>
                  <Button color="ghost" className="w-100" onClick={(e) => {
                    e.preventDefault(); e.stopPropagation(); addDLC()
                  }}>Добавить Часть 🪑</Button>
                </div>
              </div>
            </Form>
          </div>
          {/*  */}
          <div className="divider divider-horizontal"></div>
          {/* //! 3 */}
          <div className="w-1/3 flex flex-col  items-center justify-center max-h-full">
            <div className="flex flex-col  items-center justify-center">
              <ContentPreview
                type="game"
                label={label}
                // imageUrl={`https://tdr-starlight-my-ass-98.s3.eu-central-1.amazonaws.com/rfbw/TheRat(Not)Bot/ef74b073-82d0-4b5a-a7ea-01fc9486b58c-1IV-UI1mQ20.jpg`}
                imageUrl={imageURL}
                authorImageUrl={me?.imageUrl as string}
                isUploading={isUploading}
                progress={progress}
              />
              <div className="flex flex-row gap-5 justify-center items-center" >
                <Avatar size={75} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={50} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={25} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={10} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
              </div>
              <Modal.Actions>
                <Button color="secondary" disabled={isSaving} onClick={() => { resetForm(); props.onClose() }}>Отмена</Button>
                <Button color="primary" loading={isSaving} disabled={showValidationErrors && !isValid} className={`${showValidationErrors && !isValid ? 'ring-error ring-2' : ''} `} onClick={() => { handleGameSubmit(save, (err) => { setShowValidationErrors(true); setCollapsedDlcs(dlcs.filter(x => err.dlcs && !err.dlcs[x.position]).map(x => x.position)) })() }}>Сохранить</Button>
              </Modal.Actions>
            </div>
          </div>

        </Modal.Body >


      </Modal >

    </>
  );
};

export default EditGameModal;

