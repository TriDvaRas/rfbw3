import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, ButtonGroup, FileInput, Form, Input, Modal, Select, Textarea } from "react-daisyui";
import { api } from "../../utils/api";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";
import { GridLoader } from "react-spinners";
import Avatar from "../../components/util/Avatar";
import TimeAgo from "timeago-react";
import { useAtom } from "jotai";
import { contentApprovalAssistantNextContentIndexAtom, contentFullInfoModalContentAtom, showContentApprovalAssistantAtom, showContentFullInfoModalAtom, contentApprovalAssistantContentListAtom } from "../../utils/atoms";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFileUpload } from "../../hooks/useFileUpload";
import { toast } from "react-toastify";
import { ShopItemFormSchema, shopItemFormSchema } from "../../utils/forms";




const Admin: NextPage = () => {
  const router = useRouter()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data, isLoading, error } = api.admin.getShopItems.useQuery()
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
              <Button color="info" onClick={() => router.push('/admin/shop')}>Shop</Button>
              <Button variant="outline" color="info" onClick={() => router.push('/admin/truth')}>Truth</Button>

            </ButtonGroup>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Button color="success" disabled={!data} onClick={() => {
              setShowCreateModal(true)
            }}>Create</Button>
          </div>
          {isLoading && <div className="flex justify-center items-center"><GridLoader color="#10B981" size={15} /></div>}
          {data && <div className="flex flex-col gap-2">
            {data.map(x => <div key={x.id} className="flex flex-row gap-2 bg-sky-950 rounded-xl items-center p-2">
              <div className="flex flex-row gap-2 items-center ">
                <div className="flex flex-col min-w-[450px]">
                  <div className="text-lg font-bold">{x.label}</div>
                  <div>{x.description}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div>Price</div>
                  <div className="text-3xl font-bold">{x.price}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div>DefStock</div>
                  <div className="text-3xl font-bold">{x.defaultStock}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div>StockRefresh</div>
                  <div className="text-2xl font-bold">{x.stockRefreshRule}</div>
                </div>
                <div className="flex flex-col items-center">
                  <div>StockOwner</div>
                  <div className="text-2xl font-bold">{x.stockOwnershipRule}</div>
                </div>
                <Avatar src={x.imageUrl} size={64} />
              </div>
            </div>)}
          </div>}
        </div>
        <CreateShopItemModal show={showCreateModal} onClickBackdrop={() => setShowCreateModal(false)} />
      </main>
    </>
  );
};

//createShopItem modal
function CreateShopItemModal({ show, onClickBackdrop }: {
  show: boolean
  onClickBackdrop: () => void
}) {
  const methods = useForm<ShopItemFormSchema>({
    defaultValues: {
      label: '',
      description: '',
      defaultStock: 1,
      stockRefreshRule: 'days1',
      stockOwnerRule: 'shared',
      price: 1000,
      imageUrl: '',
    },
    resolver: zodResolver(shopItemFormSchema),
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
  const { startUpload, isUploading, error: uploadError, progress } = useFileUpload({
    imageMinResolution: [0, 0],
    onSuccess(url) {
      toast.success('Image Uploaded')
      setValue('imageUrl', url)
      trigger('imageUrl')
    },
    onError(err) {
      toast.error(`Ошибка загрузки: ${err}`)
    }
  })
  const ctx = api.useContext()
  const { mutate, isLoading } = api.admin.createShopItem.useMutation({
    onSuccess(data, variables, context) {
      toast.success('ShopItem Created')
      Promise.all([
        ctx.admin.getShopItems.invalidate(),
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
        <Form.Label title="Название" />
        <Input  {...register('label')} className="w-full" color={errors.label ? 'error' : undefined} />
        {errors.label && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.label.message}
          </span>
        )}


        <Form.Label title="Описание" />
        <Textarea className="resize-none h-32"  {...register('description')} />
        {errors.description && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.description.message}
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
          color={errors.imageUrl ? 'error' : undefined}
        />
        {errors.imageUrl && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.imageUrl.message}
          </span>
        )}

        <Form.Label title="Цена" />
        <Input type="number" {...register('price')} className="w-full" color={errors.price ? 'error' : undefined} />
        {errors.price && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.price.message}
          </span>
        )}

        <Form.Label title="Default Stock" />
        <Input type="number" {...register('defaultStock')} className="w-full" color={errors.defaultStock ? 'error' : undefined} />
        {errors.defaultStock && (
          <span className=" label-text-alt text-error block mt-0.5 ms-3">
            {errors.defaultStock.message}
          </span>
        )}

        <Form.Label title="Stock Refresh Rule" />
        <Select {...register('stockRefreshRule')} className="w-full" color={errors.stockRefreshRule ? 'error' : undefined}>
          <option value="never">Never</option>
          <option value="days1">Every day</option>
          <option value="days3">Every 3 days</option>
          <option value="days7">Every week</option>
          <option value="days14">Every 2 weeks</option>
        </Select>

        <Form.Label title="Stock Owner Rule" />
        <Select {...register('stockOwnerRule')} className="w-full" color={errors.stockOwnerRule ? 'error' : undefined}>
          <option value="shared">Shared</option>
          <option value="perPlayer">Per Player</option>
        </Select>

        {/* submit button */}
        <div className="flex flex-row gap-2 mt-4">
          <Button color="error" onClick={() => {
            onClickBackdrop()
          }
          }>Cancel</Button>
          <Button color="success" wide disabled={!isValid || isUploading || isLoading} onClick={() => {
            const v = getValues()
            mutate({
              label: v.label,
              description: v.description,
              defaultStock: +v.defaultStock,
              stockRefreshRule: v.stockRefreshRule,
              stockOwnerRule: v.stockOwnerRule,
              price: +v.price,
              imageUrl: v.imageUrl,
            })
          }
          }>Create</Button>

        </div>
        {JSON.stringify(errors)}

      </Form>
    </Modal.Body>
  </Modal >
}


export default Admin;

