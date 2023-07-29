import { zodResolver } from "@hookform/resolvers/zod";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button, ButtonGroup, Form, Input, Modal, Select, Textarea } from "react-daisyui";
import { useForm } from "react-hook-form";
import { AiFillHome } from "react-icons/ai";
import { GridLoader } from "react-spinners";
import { toast } from "react-toastify";
import { api } from "../../utils/api";
import { TruthFormSchema, truthFormSchema } from "../../utils/forms";
import Avatar from "../../components/util/Avatar";

const Admin: NextPage = () => {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data, isLoading, error } = api.admin.getTruths.useQuery()

  //#region admin check
  const { data: amIAdmin, isLoading: amIAdminLoading } = api.meta.amIAdmin.useQuery()
  if (amIAdminLoading)
    return null
  if (!amIAdmin)
    router.push('/home')
  //#endregion
  return (
    <>
      <Head>
        <title>RFBW - Amen</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen flex justify-center items-center ">
        <Link href={'/home'} className="fixed left-4 top-4">
          <Button color="secondary" shape="circle">
            <AiFillHome className="text-xl" />
          </Button>
        </Link>
        <div className="h-screen max-w-5xl w-full py-4 flex flex-col gap-2">
          <div className="flex justify-center items-center">
            <ButtonGroup >
              <Button wide variant="outline" color="info" onClick={() => router.push('/admin/content')}>Content Approval</Button>
              <Button wide variant="outline" color="info" onClick={() => router.push('/admin/players')}>Player Management</Button>
              <Button variant="outline" color="info" onClick={() => router.push('/admin/shop')}>Shop</Button>
              <Button color="info" onClick={() => router.push('/admin/truth')}>Truth</Button>

            </ButtonGroup>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Button color="success" disabled={!data} onClick={() => {
              setShowCreateModal(true)
            }}>Create</Button>
          </div>

          <div className="flex flex-col gap-2">
            {isLoading && <div className="flex justify-center items-center">
              <GridLoader color="#ffffff" />
            </div>}
            {data?.map((truth, i) => <div key={i} className="flex flex-row gap-2 items-center bg-base-300 p-2 rounded-md">
              <div className="flex flex-col gap-1 w-[200px]">
                <div className="flex flex-row gap-1 items-center">
                  <span className="text-sm text-gray-400">ID:</span>
                  <span className="text-sm">{truth.id}</span>
                </div>
                {truth.lockedById && <div className="flex flex-row gap-1 items-center">
                  <span className="text-sm text-gray-400">LockedBy:</span>
                  <span className="text-sm">{truth.lockedById}</span>
                </div>}
                <div className="flex flex-row gap-1 items-center">
                  <span className="text-sm text-gray-400">Label:</span>
                  <span className="text-sm">{truth.label}</span>
                </div>

              </div>
              <div className="flex flex-col gap-2 items-center w-[300px]">
                <div className="flex flex-col gap-1 ">
                  <span className="text-sm text-gray-400">Truth:</span>
                  <span className="text-sm">{truth.truth}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 w-[200px]">
                <div className="flex flex-row gap-1 items-center">
                  <span className="text-sm text-gray-400">Category:</span>
                  <span className="text-sm">{truth.category}</span>
                </div>
                <div className="flex flex-row gap-1 items-center">
                  <span className="text-sm text-gray-400">Rarity:</span>
                  <span className="text-sm">{truth.rarity}</span>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center ">
                <div className="flex flex-col gap-1 ">
                  <span className="text-sm text-gray-400">Added By:</span>
                  <span className="text-sm ">{truth.addedBy.name}</span>
                </div>
                <Avatar src={truth.addedBy.imageUrl} size={56} />
              </div>
            </div>
            )}
          </div>
          <CreateTruthModal show={showCreateModal} onClickBackdrop={() => setShowCreateModal(false)} />
        </div>
      </main>
    </>
  );
};

//truth create modal
function CreateTruthModal({ show, onClickBackdrop }: {
  show: boolean
  onClickBackdrop: () => void
}) {
  const methods = useForm<TruthFormSchema>({
    defaultValues: {
      label: '',
      truth: '',
      lockedById: null
    },
    resolver: zodResolver(truthFormSchema),
  });
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = methods
  const ctx = api.useContext()
  const { mutate, isLoading } = api.admin.createTruth.useMutation({
    onSuccess(data, variables, context) {
      toast.success('Truth Created')
      Promise.all([
        ctx.admin.getTruths.invalidate(),
      ]).then(() => {
        onClickBackdrop()
      })
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })
  return <Modal
    // open={true}
    open={show}
    className='w-11/12 max-w-2xl'
  // onClickBackdrop={() => { }}
  >
    <Modal.Body>
      <Form onSubmit={(e) => { e.preventDefault(); }}>


        <Form.Label title="ID" />
        <Input type="number" {...register('id')} className="w-full" color={errors.id ? 'error' : undefined} />
        {errors.id && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.id.message}
          </span>
        )}
        <Form.Label title="lockedById" />
        <Input type="number" {...register('lockedById')} className="w-full" color={errors.id ? 'error' : undefined} />
        {errors.lockedById && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.lockedById.message}
          </span>
        )}

        <Form.Label title="Label" />
        <Input  {...register('label')} maxLength={16} className="w-full" color={errors.label ? 'error' : undefined} />
        {errors.label && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.label.message}
          </span>
        )}


        <Form.Label title="Правда" />
        <Textarea className="resize-none h-32"  {...register('truth')} />
        {errors.truth && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.truth.message}
          </span>
        )}


        <Form.Label title="Stock Refresh Rule" />
        <Select {...register('category')} className="w-full" color={errors.category ? 'error' : undefined}>
          <option value="entropy">Entropy</option>
          <option value="items">Items</option>
          <option value="effects">Effects</option>
          <option value="mechanics">Mechanics</option>
          <option value="random">Random</option>
        </Select>
        {errors.category && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.category.message}
          </span>
        )}

        <Form.Label title="Rarity" />
        <Select {...register('rarity')} className="w-full" color={errors.rarity ? 'error' : undefined}>
          <option value="N">N</option>
          <option value="R">R</option>
          <option value="SR">SR</option>
          <option value="SSR">SSR</option>
          <option value="UR">UR</option>
        </Select>
        {errors.rarity && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.rarity.message}
          </span>
        )}



        {/* submit button */}
        <div className="flex flex-row gap-2 mt-4">
          <Button color="error" onClick={() => {
            onClickBackdrop()
          }
          }>Cancel</Button>
          <Button color="success" wide disabled={!isValid || isLoading} onClick={() => {
            const v = getValues()
            mutate({
              id: v.id,
              label: v.label,
              truth: v.truth,
              category: v.category,
              rarity: v.rarity,
              lockedById: v.lockedById
            })
          }
          }>Create</Button>

        </div>
      </Form>
    </Modal.Body>
  </Modal >
}

export default Admin;

