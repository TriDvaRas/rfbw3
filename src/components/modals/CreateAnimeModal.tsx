import { zodResolver } from '@hookform/resolvers/zod';
import _ from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, Card, Collapse, FileInput, Form, Input, Modal, RadialProgress, Swap, Textarea } from "react-daisyui";
import { Controller, useForm } from 'react-hook-form';
import { BiCollapseVertical } from 'react-icons/bi';
import { MdDeleteForever } from "react-icons/md";
import { RiPencilFill } from 'react-icons/ri';
import Select from 'react-select';
import globalConfig from "../../globalConfig";
import { useFileUpload } from "../../hooks/useFileUpload";
import reactSelectDarkTheme from "../../styles/reactSelectDarkTheme";
import { api } from "../../utils/api";
import { GenreId, genreIdToName, genreIds } from "../../utils/genres";
import Avatar from "../util/Avatar";
import { z } from 'zod';
import { toast } from 'react-toastify';

export const animeDLCSchema = z.object({
  hours: z.coerce.number().min(0.1, { message: ':)' }).max(10, { message: 'До 10 часов' }),
  label: z.string().min(1, { message: 'А где)' }).max(16, { message: 'Максимальная длина 16 символов' }),
  title: z.string().min(1, { message: 'Заполни)' }),
  position: z.number().min(0),
})
export const animeFormSchema = z.object({
  label: z.string().min(1, { message: 'А где)' }).max(16, { message: 'Максимальная длина 16 символов' }),
  fullname: z.string().min(1, { message: 'Заполни)' }),
  hours: z.coerce.number().min(0.1, { message: ':)' }).max(98, { message: 'До 98 часов)' }),
  imageURL: z.string().min(1, { message: 'Картинка обязательна' }),
  genres: z.enum(genreIds).array().min(1, { message: 'Выбери хотя бы один жанр' }).max(3, { message: 'Как?' }),
  comments: z.string().optional(),
  dlcs: animeDLCSchema.array()
})
export type AnimeFormSchema = z.infer<typeof animeFormSchema>
export type AnimeDLCSchema = z.infer<typeof animeDLCSchema>

const animeGenres = Array.from(genreIdToName.entries())
const animeGenresOptions = _.orderBy(animeGenres.filter(x => globalConfig.genres.anime.includes(x[1])).map(([id, name]) => ({ value: id, label: name })), 'id', 'asc')

interface Props {
  onSuccess: (data: AnimeFormSchema) => void
  onClose: () => void
  open: boolean
  closeOnBackdropClick?: boolean
  defaultValues?: Partial<AnimeFormSchema>
}

const CreateAnimeModal: React.FC<Props> = (props) => {
  const { status } = useSession()
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const { data: me } = api.players.getMyPlayer.useQuery()
  const [collapsedDlcs, setCollapsedDlcs] = useState<number[]>([])

  const { mutate: createAnimeContentMutation, isLoading: isSaving } = api.content.createAnimeContent.useMutation({
    onSuccess() {
      props.onSuccess(getAnimeValues())
      resetForm()
    },
    onError(err) {
      toast.error(`${err.message}`)
    }
  })

  const methods = useForm<AnimeFormSchema>({
    defaultValues: {
      label: '',
      comments: '',
      fullname: '',
      imageURL: undefined,
      genres: [],
      dlcs: [],
      hours: undefined,
      ...props.defaultValues,
    },
    resolver: zodResolver(animeFormSchema),
  });
  const {
    register: registerAnime,
    handleSubmit: handleAnimeSubmit,
    getValues: getAnimeValues,
    setValue: setAnimeValue,
    reset: resetAnime,
    watch: watchAnime,
    trigger: triggerAnime,
    formState: { errors, isValid },
  } = methods
  const animeData = watchAnime()
  const { fullname, imageURL, label, comments, genres, hours, dlcs } = animeData

  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    onSuccess(url) {
      setAnimeValue('imageURL', url)
      triggerAnime('imageURL')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })
  function save() {
    createAnimeContentMutation(getAnimeValues())
  }
  function updateDLC(position: number, data: Partial<AnimeDLCSchema>) {
    const newData = [...dlcs]
    newData[position] = {
      ...newData[position],
      ...data,
    } as AnimeDLCSchema
    setAnimeValue('dlcs', newData)
    triggerAnime('dlcs')
  }
  function addDLC() {
    const newData = [...dlcs]
    newData.push({
      hours: undefined as unknown as number,
      label: '',
      position: dlcs.length,
      title: '',
    })
    setAnimeValue('dlcs', newData)
    triggerAnime('dlcs')
  }
  function removeDlc(position: number) {
    const newData = [...dlcs]
    newData.splice(position, 1)
    setCollapsedDlcs(collapsedDlcs.filter(x => x !== position).map(x => x > position ? x - 1 : x))
    const resorted = newData.map((x, i) => ({ ...x, position: i }))
    setAnimeValue('dlcs', resorted)
    showValidationErrors && triggerAnime('dlcs')
  }
  function toggleDlc(position: number) {
    console.log('toggle', position);
    if (collapsedDlcs.includes(position)) {
      setCollapsedDlcs(collapsedDlcs.filter(x => x !== position))
    } else {
      setCollapsedDlcs([...collapsedDlcs, position])
    }
  }
  function resetForm() {
    resetAnime()
    setCollapsedDlcs([])
    setShowValidationErrors(false)
  }
  return (
    <>
      <Modal open={props.open} onClickBackdrop={() => props.closeOnBackdropClick && props.onClose()} className="w-11/12 max-w-7xl ">

        <Modal.Body className="flex flex-row w-full max-h-full">

          {/* //! 1 */}
          <div className="w-1/3 max-h-full">
            <Modal.Header className="mb-2">Добавление Нового Аниме</Modal.Header>
            <Form onSubmit={(e) => { e.preventDefault(); }}>
              <div className="flex flex-row gap-2">
                <div className="w-7/12 relative">
                  <Form.Label title="Название" />
                  <Input  {...registerAnime('label')} maxLength={16} className="w-full" color={errors.label ? 'error' : undefined} />
                  {errors.label && (
                    <span className=" label-text-alt text-error block mt-0.5 ms-3">
                      {errors.label.message}
                    </span>
                  )}
                </div>
                <div className="w-5/12">
                  <Form.Label title="Длительность" className="mx-1" />
                  <Input  {...registerAnime('hours')} type='number' placeholder="(в часах)" min={0.1} step={0.1} max={98} className="w-full" color={errors.hours ? 'error' : undefined} />
                  {errors.hours && (
                    <span className=" label-text-alt text-error block mt-0.5">
                      {errors.hours.message}
                    </span>
                  )}
                </div>

              </div>
              <Form.Label title="Полное Название" />
              <Input  {...registerAnime('fullname')} className="w-full" color={errors.fullname ? 'error' : undefined} />
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
                      options={animeGenresOptions}
                      menuPosition="absolute"
                      // menuIsOpen
                      menuPlacement="top"
                      onChange={val => {
                        val.length > 3 || setAnimeValue('genres', val.map(x => x.value as GenreId))
                        showValidationErrors && triggerAnime('genres')
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
              <Textarea className="resize-none h-32"  {...registerAnime('comments')} />

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
              <div className="w-[260px] h-[390px] relative mb-12 bg-slate-800 ">
                <Image src={getAnimeValues().imageURL || '/errorAvatar.jpg'} layout="fill" alt="Ты не должен этого видеть. Перезалей картинку." width={300} height={450} className="object-cover rounded-lg" />
                {isUploading && <div className='absolute w-full h-full bg-slate-900 bg-opacity-80 flex justify-center items-center'><RadialProgress value={progress}>{progress}%</RadialProgress></div>}
                {me && <Avatar height={40} width={40} src={me.imageUrl || '/errorAvatar.jpg'} className='absolute right-[-16px] top-[-16px]' shape='circle' />}
                <div className={`absolute overflow-clip left-[-25px] bottom-[-30px] w-[310px] h-[80px] rounded-full bg-opacity-100 bg-pink-500 px-1 py-1  flex text-center align-middle items-center justify-center text-slate-200 ${label.length > 7 ? label.length > 12 ? label.length > 15 ? `text-3xl` : `text-4xl` : `text-5xl` : `text-6xl`}`} >{label || 'ЯЙЦА'}</div >
              </div>
              <div className="flex flex-row gap-5 justify-center items-center" >
                <Avatar height={75} width={75} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar height={50} width={50} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar height={25} width={25} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar height={10} width={10} border imageClassName="ring-pink-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
              </div>
              <Modal.Actions>
                <Button color="secondary" disabled={isSaving} onClick={() => { resetForm(); props.onClose() }}>Отмена</Button>
                <Button color="primary" loading={isSaving} disabled={showValidationErrors && !isValid} className={`${showValidationErrors && !isValid ? 'ring-error ring-2' : ''} `} onClick={() => { handleAnimeSubmit(save, (err) => { setShowValidationErrors(true); setCollapsedDlcs(dlcs.filter(x => err.dlcs && !err.dlcs[x.position]).map(x => x.position)) })() }}>Сохранить</Button>
              </Modal.Actions>
            </div>
          </div>

        </Modal.Body >


      </Modal >

    </>
  );
};

export default CreateAnimeModal;

