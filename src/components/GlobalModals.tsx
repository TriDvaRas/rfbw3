import { useAtom } from 'jotai'
import React from 'react'
import { contentFullInfoModalContentAtom, showContentFullInfoModalAtom } from '../utils/atoms';
import { Button, Modal } from 'react-daisyui';
import { Content, ContentDLC } from '@prisma/client';
import ContentPreview from './previews/ContentPreview';
import LazyImage from './util/LazyImage';
import { BiInfinite } from 'react-icons/bi';
import Avatar from './util/Avatar';
import { api } from '../utils/api';
import { Popover } from 'react-tiny-popover';
import { useHover } from 'usehooks-ts';
import { GridLoader } from 'react-spinners';

// type Props = {}
//! GLOBAL MODALS
function GlobalModals({ }) {
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [contentFullContent, setContentFullContent] = useAtom(contentFullInfoModalContentAtom)
    return (
        <div>
            {/* CONTENT FULL INFO */}
            {contentFullContent &&
                <ContentFullInfoModal
                    contentId={contentFullContent.id}
                    show={showContentFullInfo}
                    onClickBackdrop={() => setShowContentFullInfo(false)}
                />
            }

        </div>
    )
}
//! ---

function ContentFullInfoModal({ contentId, show, onClickBackdrop }: {
    contentId: string
    show: boolean
    onClickBackdrop: () => void
}) {
    const { data: content, isLoading, error } = api.content.getContentWithDLCs.useQuery(contentId)
  
    return <Modal
        // open={true}
        open={show}
        className='w-11/12 max-w-2xl'
        onClickBackdrop={onClickBackdrop}
    >
        <Modal.Body>
            {isLoading && <div className='flex items-center justify-center h-20'>
                <GridLoader color="#36d7b7" />
            </div>}
            {error && <div className='flex items-center justify-center h-20'><div className='text-red-500 text-center text-xl'>{error.message}</div></div>}
            {content && content.DLCs !== undefined && <ContentInfo content={content} />}
        </Modal.Body>
    </Modal>
}

function ContentInfo({ content }: {
    content: Content & {
        DLCs: ContentDLC[];
    };
}) {
    const { data: owner } = api.players.getPlayer.useQuery(content.ownedById)
    const authorRef = React.useRef<HTMLDivElement>(null)
    const isAuthorHovered = useHover(authorRef)
    const heapRef = React.useRef<HTMLDivElement>(null)
    const heapHovered = useHover(heapRef)
    return <div className='flex flex-col gap-2 '>
        <div className='flex gap-6 items-center justify-center'>
            <div className='rounded-md overflow-hidden aspect-2/3 flex justify-center items-center text-3xl flex-shrink-0'>
                <LazyImage src={content.imageId} alt="Ты не должен этого видеть. Перезалей картинку." height={384} width={256} className="object-cover h-full" imageClassName='rounded-md' />
            </div>
            <div className='flex-grow min-h-max'>
                <div className='text-center text-4xl -mb-1 text-slate-50'>{content.label}</div>
                <div className='text-center text-xl text-slate-100'>{content.title}</div>
                {content.comments && <div className='text-center text-sm'>{content.comments}</div>}
                <div className='grid grid-cols-4 grid-rows-1 gap-2 mt-2 -mb-2'>
                    <div className='text-center text-sm'>Длина</div>
                    <div className='text-center text-sm'>Высота</div>
                    <div className='text-center text-sm'>Ширина</div>
                    <div className='text-center text-sm'>Автор</div>
                </div>
                <div className='grid grid-cols-4 grid-rows-1 gap-2 my-2 '>
                    <div className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1'>
                        <div className='text-center text-4xl'>{`${content.hours}`}</div>
                        {/* <div className='text-center text-lg'>HRS</div> */}
                    </div>
                    {
                        content.type === 'game' ?
                            <div className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1'>
                                <div className='text-center text-4xl'>{`${content.maxCoopPlayers}`}</div>
                                {/* <div className='text-center text-lg'>Coop Slot{content.maxCoopPlayers > 1 ? 's' : ''}</div> */}
                            </div> :
                            <div className='flex flex-col rounded-xl items-center bg-slate-800 bg-opacity-50 p-1'>
                                <BiInfinite className='text-center text-4xl' />
                                {/* <div className='text-center text-lg'>Coop Slots</div> */}
                            </div>
                    }
                    <div ref={heapRef} className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1 ' style={{ backgroundImage: heapHovered ? 'url(/fleshHeap.webp)' : undefined }}>
                        <div className='text-center text-4xl  '>{`${content.baseWeight}`}</div>
                        {/* <div className='text-center text-lg'>Flesh Heap</div> */}
                    </div>
                    <div className='flex flex-col items-center justify-center rounded-xl bg-slate-800 bg-opacity-50 p-1' ref={authorRef}>
                        {owner && <Popover padding={7} containerClassName='z-99999' isOpen={isAuthorHovered} positions={['bottom']} content={<div className='flex flex-col gap-1 bg-slate-800 rounded-lg p-2 max-w-[175px]'>
                            <div className='text-center text-lg text-slate-200'>{owner.name}</div>
                            <div className='text-center ' style={{ fontSize: '10%' }}>{owner.about}</div>
                        </div>}>
                            <Avatar src={owner.imageUrl} size={40} />
                        </Popover>}
                        {/* {owner && <div className='text-center text-lg'>{owner.name}</div>} */}
                    </div>
                </div>
                {content.type == 'game' && <div className='text-xl text-center'>Условие Завершения</div>}
                {content.type == 'game' &&
                    <div className='overflow-auto'>
                        <div className='text-sm text-center'>{content.endCondition}</div>
                    </div>
                }

            </div>
        </div>
        {
            content.DLCs.length > 0 &&
            <div className='flex flex-col gap-1'>
                <div className=''>
                    {
                        content.type === 'anime' ?
                            <div className='w-full h-[2px] rounded-full bg-pink-500'></div> :
                            content.type === 'game' ?
                                <div className='w-full h-[2px] rounded-full bg-lime-500'></div> :
                                <div className='w-full h-[2px] rounded-full bg-amber-500'></div>
                    }
                </div>
                <div className='text-xl text-center '>Доп. контент</div>
                {
                    content.DLCs.map((dlc, i) => <div key={i} className='flex items-center rounded-lg bg-slate-800 bg-opacity-50 p-1 px-2'>
                        <div className='flex-grow'>
                            <div className='text-lg text-slate-200'>{dlc.label}</div>
                            <div className='text-sm text-slate-200'>{dlc.title}</div>
                            {content.type === 'game' && <div className='text-sm'>{dlc.endCondition}</div>}
                        </div>
                        <div className='text-xl'>
                            {`${dlc.hours}`}h
                        </div>
                    </div>)
                }
            </div>
        }
        <div className=''>
            {
                content.type === 'anime' ?
                    <div className='w-full h-1 rounded-full bg-pink-500'></div> :
                    content.type === 'game' ?
                        <div className='w-full h-1 rounded-full bg-lime-500'></div> :
                        <div className='w-full h-1 rounded-full bg-amber-500'></div>
            }
        </div>
    </div >
}

export default GlobalModals