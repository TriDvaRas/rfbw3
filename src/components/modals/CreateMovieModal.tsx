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
import ContentPreview from '../previews/ContentPreview';

export const movieDLCSchema = z.object({
  hours: z.coerce.number().min(0.1, { message: ':)' }).max(10, { message: 'До 10 часов' }),
  label: z.string().min(1, { message: 'А где)' }).max(16, { message: 'Максимальная длина 16 символов' }),
  title: z.string().min(1, { message: 'Заполни)' }),
  position: z.number().min(0),
})
export const movieFormSchema = z.object({
  label: z.string().min(1, { message: 'А где)' }).max(16, { message: 'Максимальная длина 16 символов' }),
  fullname: z.string().min(1, { message: 'Заполни)' }),
  hours: z.coerce.number().min(0.1, { message: ':)' }).max(98, { message: 'До 98 часов)' }),
  imageURL: z.string().min(1, { message: 'Картинка обязательна' }),
  genres: z.enum(genreIds).array().min(1, { message: 'Выбери хотя бы один жанр' }).max(3, { message: 'Как?' }),
  comments: z.string().optional(),
  dlcs: movieDLCSchema.array()
})
export type MovieFormSchema = z.infer<typeof movieFormSchema>
export type MovieDLCSchema = z.infer<typeof movieDLCSchema>

const movieGenres = Array.from(genreIdToName.entries())
const movieGenresOptions = _.orderBy(movieGenres.filter(x => globalConfig.genres.movies.includes(x[1])).map(([id, name]) => ({ value: id, label: name })), 'id', 'asc')

interface Props {
  onSuccess: (data: MovieFormSchema) => void
  onClose: () => void
  open: boolean
  closeOnBackdropClick?: boolean
  defaultValues?: Partial<MovieFormSchema>
}

const CreateMovieModal: React.FC<Props> = (props) => {
  const { status } = useSession()
  const [showValidationErrors, setShowValidationErrors] = useState(false)
  const { data: me } = api.players.getMyPlayer.useQuery()
  const [collapsedDlcs, setCollapsedDlcs] = useState<number[]>([])

  const { mutate: createMovieContentMutation, isLoading: isSaving } = api.content.createMovieContent.useMutation({
    onSuccess() {
      props.onSuccess(getMovieValues())
      resetForm()
    },
    onError(err) {
      toast.error(`${err.message}`)
    }
  })

  const methods = useForm<MovieFormSchema>({
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
    resolver: zodResolver(movieFormSchema),
  });
  const {
    register: registerMovie,
    handleSubmit: handleMovieSubmit,
    getValues: getMovieValues,
    setValue: setMovieValue,
    reset: resetMovie,
    watch: watchMovie,
    trigger: triggerMovie,
    formState: { errors, isValid },
  } = methods
  const movieData = watchMovie()
  const { fullname, imageURL, label, comments, genres, hours, dlcs } = movieData

  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    onSuccess(url) {
      setMovieValue('imageURL', url)
      triggerMovie('imageURL')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })
  function save() {
    createMovieContentMutation(getMovieValues())
  }
  function updateDLC(position: number, data: Partial<MovieDLCSchema>) {
    const newData = [...dlcs]
    newData[position] = {
      ...newData[position],
      ...data,
    } as MovieDLCSchema
    setMovieValue('dlcs', newData)
    triggerMovie('dlcs')
  }
  function addDLC() {
    const newData = [...dlcs]
    newData.push({
      hours: undefined as unknown as number,
      label: '',
      position: dlcs.length,
      title: '',
    })
    setMovieValue('dlcs', newData)
    triggerMovie('dlcs')
  }
  function removeDlc(position: number) {
    const newData = [...dlcs]
    newData.splice(position, 1)
    setCollapsedDlcs(collapsedDlcs.filter(x => x !== position).map(x => x > position ? x - 1 : x))
    const resorted = newData.map((x, i) => ({ ...x, position: i }))
    setMovieValue('dlcs', resorted)
    showValidationErrors && triggerMovie('dlcs')
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
    resetMovie()
    setCollapsedDlcs([])
    setShowValidationErrors(false)
  }
  return (
    <>
      <Modal open={props.open} onClickBackdrop={() => props.closeOnBackdropClick && props.onClose()} className="w-11/12 max-w-7xl ">

        <Modal.Body className="flex flex-row w-full max-h-full">

          {/* //! 1 */}
          <div className="w-1/3 max-h-full">
            <Modal.Header className="mb-2">Добавление Нового Кино</Modal.Header>
            <Form onSubmit={(e) => { e.preventDefault(); }}>
              <div className="flex flex-row gap-2">
                <div className="w-7/12 relative">
                  <Form.Label title="Название" />
                  <Input  {...registerMovie('label')} maxLength={16} className="w-full" color={errors.label ? 'error' : undefined} />
                  {errors.label && (
                    <span className=" label-text-alt text-error block mt-0.5 ms-3">
                      {errors.label.message}
                    </span>
                  )}
                </div>
                <div className="w-5/12">
                  <Form.Label title="Длительность" className="mx-1" />
                  <Input  {...registerMovie('hours')} type='number' placeholder="(в часах)" min={0.1} step={0.1} max={98} className="w-full" color={errors.hours ? 'error' : undefined} />
                  {errors.hours && (
                    <span className=" label-text-alt text-error block mt-0.5">
                      {errors.hours.message}
                    </span>
                  )}
                </div>

              </div>
              <Form.Label title="Полное Название" />
              <Input  {...registerMovie('fullname')} className="w-full" color={errors.fullname ? 'error' : undefined} />
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
                      options={movieGenresOptions}
                      menuPosition="absolute"
                      // menuIsOpen
                      menuPlacement="top"
                      onChange={val => {
                        val.length > 3 || setMovieValue('genres', val.map(x => x.value as GenreId))
                        showValidationErrors && triggerMovie('genres')
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
              <Textarea className="resize-none h-32"  {...registerMovie('comments')} />

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
                type="movie"
                label={label}
                imageUrl={imageURL}
                authorImageUrl={me?.imageUrl as string}
                isUploading={isUploading}
                progress={progress}
              />
              <div className="flex flex-row gap-5 justify-center items-center" >
                <Avatar size={75} border imageClassName="ring-amber-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={50} border imageClassName="ring-amber-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={25} border imageClassName="ring-amber-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
                <Avatar size={10} border imageClassName="ring-amber-600" src={imageURL || '/errorAvatar.jpg'} shape="circle" />
              </div>
              <Modal.Actions>
                <Button color="secondary" disabled={isSaving} onClick={() => { resetForm(); props.onClose() }}>Отмена</Button>
                <Button color="primary" loading={isSaving} disabled={showValidationErrors && !isValid} className={`${showValidationErrors && !isValid ? 'ring-error ring-2' : ''} `} onClick={() => { handleMovieSubmit(save, (err) => { setShowValidationErrors(true); setCollapsedDlcs(dlcs.filter(x => err.dlcs && !err.dlcs[x.position]).map(x => x.position)) })() }}>Сохранить</Button>
              </Modal.Actions>
            </div>
          </div>

        </Modal.Body >


      </Modal >

    </>
  );
};

export default CreateMovieModal;

