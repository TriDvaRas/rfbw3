import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { Button, ButtonGroup, Select } from "react-daisyui";
import { api } from "../../utils/api";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { useState } from "react";
import { GridLoader } from "react-spinners";
import Avatar from "../../components/util/Avatar";
import TimeAgo from "timeago-react";
import { useAtom } from "jotai";
import { contentApprovalAssistantNextContentIndexAtom, contentFullInfoModalContentAtom, showContentApprovalAssistantAtom, showContentFullInfoModalAtom, contentApprovalAssistantContentListAtom } from "../../utils/atoms";


const Admin: NextPage = () => {
  const router = useRouter()
  const [isApproved, setIsApproved] = useState<boolean | undefined>(false)
  const [isDeclined, setIsDeclined] = useState<boolean | undefined>(false)
  const [types, setTypes] = useState<('game' | 'anime' | 'movie')[]>(['game', 'anime', 'movie'])


  const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
  const [contentFullContent, setContentFullContent] = useAtom(contentFullInfoModalContentAtom)
  const [showApproveAssistant, setShowApproveAssistant] = useAtom(showContentApprovalAssistantAtom)
  const [assistantNextContentIndex, setAssistantNextContentIndex] = useAtom(contentApprovalAssistantNextContentIndexAtom)
  const [contentApprovalAssistantContentList, setContentApprovalAssistantContentList] = useAtom(contentApprovalAssistantContentListAtom)


  const { data, isLoading } = api.admin.getContentList.useQuery({
    isApproved,
    isDeclined,
    types
  })
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
              <Button wide color="info" onClick={() => router.push('/admin/content')}>Content Approval</Button>
              <Button wide variant="outline" color="info" onClick={() => router.push('/admin/players')}>Player Management</Button>
              <Button variant="outline" color="info" onClick={() => router.push('/admin/shop')}>Shop</Button>
              <Button variant="outline" color="info" onClick={() => router.push('/admin/truth')}>Truth</Button>
            </ButtonGroup>
          </div>
          <div className="flex flex-row gap-2 justify-center items-center">
            <Select multiple value={types} onChange={(e) => setTypes(Array.from(e.target.selectedOptions).map(x => x.value) as ('game' | 'anime' | 'movie')[])}>
              <option value="game">Game</option>
              <option value="anime">Anime</option>
              <option value="movie">Movie</option>
            </Select>
            <Select value={`${isApproved}`} onChange={(e) => setIsApproved(e.target.value == 'true' ? true : e.target.value == 'false' ? false : undefined)}>
              <option value="undefined">any</option>
              <option value="false">isNotApproved</option>
              <option value="true">isApproved</option>
            </Select>
            <Select value={`${isDeclined}`} onChange={(e) => setIsDeclined(e.target.value == 'true' ? true : e.target.value == 'false' ? false : undefined)}>
              <option value="undefined">any</option>
              <option value="false">isNotDeclined</option>
              <option value="true">isDeclined</option>
            </Select>
            <Button color="success" disabled={!data} onClick={() => {
              if (data && data[0]) {
                setShowApproveAssistant(true)
                setAssistantNextContentIndex(1)
                setContentFullContent(data[0])
                setShowContentFullInfo(true)
                setContentApprovalAssistantContentList(data)
              }
            }}>Approve Assistant ({data?.length || ''})</Button>
          </div>

          {isLoading && <div className="flex justify-center items-center"><GridLoader color="#10B981" size={15} /></div>}
          {data && <div className="flex flex-col gap-2">
            {data.map(x => <div key={x.id} className="flex flex-row gap-2 bg-sky-950 rounded-xl items-center p-2">
              <div className="flex flex-col gap-0.5 w-64">
                <div className="text-lg">{x.label}</div>
                <div className="text-sm">{x.title}</div>
                <div className={`text-sm ${x.type == 'game' ? 'text-green-500' : x.type == 'anime' ? 'text-pink-500' : 'text-amber-500'} `} >{x.type}</div>
              </div>
              <Avatar src={x.imageId} size={64} />
              <div className="flex flex-col gap-0.5 text-sm">
                <div>Last updated:</div>
                <TimeAgo datetime={x.updatedAt} />
                <div>{new Date(x.updatedAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-center text-sm">
                <div>Added by:</div>
                <Avatar src={x.addedBy.imageUrl} size={56} />
                <div>{x.addedBy.name}</div>
              </div>
              <div className="flex flex-col items-center text-sm">
                <div>Owned by:</div>
                <Avatar src={x.owner.imageUrl} size={56} />
                <div>{x.owner.name}</div>
              </div>
              <div className="flex flex-col flex-grow items-center text-sm gap-1 ">
                <div>Quality:</div>
                <div className='text-4xl'>{x.qualityScore ?? '?'}</div>
              </div>
              <div className="flex flex-col flex-grow items-center text-sm gap-1 ">
                <div>DeclineCounter:</div>
                <div className='text-4xl'>{x.declinedCounter}</div>
              </div>
              <div className="flex flex-col items-center text-sm gap-1 ">
                <Button size="xs" color='info' onClick={() => {
                  setContentFullContent(x)
                  setShowContentFullInfo(true)
                  setShowApproveAssistant(true)
                }}>Revue</Button>
                <Button size="xs" color='info' disabled>Edit</Button>
                {/* <Button size="xs" color='info' disabled>Info</Button> */}
              </div>
              {/* <div className="flex flex-col gap-1">
                <Button color="success" onClick={() => api.admin.approveContent.mutate(x.id)}>Approve</Button>
                <Button color="error" onClick={() => api.admin.declineContent.mutate(x.id)}>Decline</Button>
              </div> */}
            </div>)}
          </div>}

        </div>
      </main>
    </>
  );
};


export default Admin;

