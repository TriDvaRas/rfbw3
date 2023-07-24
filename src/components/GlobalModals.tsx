import { useAtom } from 'jotai'
import React from 'react'
import { contentFullInfoModalContentAtom, showContentFullInfoModalAtom } from '../utils/atoms';
import { Button, Modal } from 'react-daisyui';
import { Content, ContentDLC } from '@prisma/client';
import ContentPreview from './previews/ContentPreview';
import LazyImage from './util/LazyImage';
import { BiInfinite } from 'react-icons/bi';

// type Props = {}

function GlobalModals({ }) {
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [content, setContent] = useAtom(contentFullInfoModalContentAtom)
    return (
        <div>
            {/* CONTENT FULL INFO */}
            <Modal
                // open={true}
                open={showContentFullInfo}
                className='w-11/12 max-w-2xl'
                onClickBackdrop={() => setShowContentFullInfo(false)}
            >
                <Modal.Body>
                    {content && <ContentInfo content={content} />}
                </Modal.Body>
            </Modal>

        </div>
    )
}

function ContentInfo({ content }: {
    content: Content & {
        DLCs: ContentDLC[];
    };
}) {
    return <div className='flex flex-col gap-2 '>
        <div className='flex gap-6 items-center justify-center'>
            <div className='rounded-md overflow-hidden aspect-2/3 flex justify-center items-center text-3xl flex-shrink-0'>
                <LazyImage src={content.imageId} alt="Ты не должен этого видеть. Перезалей картинку." height={384} width={256} className="object-cover h-full" imageClassName='rounded-md' />
            </div>
            <div className='flex-grow min-h-max'>
                <div className='text-center text-4xl -mb-1 text-slate-50'>{content.label}</div>
                <div className='text-center text-xl text-slate-100'>{content.title}</div>
                {content.comments && <div className='text-center text-sm'>{content.comments}</div>}
                <div className='grid grid-cols-3 grid-rows-1 gap-2 my-2 '>
                    <div className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1'>
                        <div className='text-center text-5xl'>{`${content.hours}`}</div>
                        <div className='text-center text-lg'>HRS</div>
                    </div>
                    {
                        content.type === 'game' ?
                            <div className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1'>
                                <div className='text-center text-5xl'>{`${content.maxCoopPlayers}`}</div>
                                <div className='text-center text-lg'>Coop Slot{content.maxCoopPlayers > 1 ? 's' : ''}</div>
                            </div> :
                            <div className='flex flex-col rounded-xl items-center bg-slate-800 bg-opacity-50 p-1'>
                                <BiInfinite className='text-center text-5xl' />
                                <div className='text-center text-lg'>Coop Slots</div>
                            </div>
                    }
                    <div className='flex flex-col rounded-xl bg-slate-800 bg-opacity-50 p-1'>
                        <div className='text-center text-5xl'>{`${content.baseWeight}`}</div>
                        <div className='text-center text-lg'>Flesh Heap</div>
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
            <div className='flex flex-col'>
                <div className=''>
                    {
                        content.type === 'anime' ?
                            <div className='w-full h-0.5 rounded-full bg-pink-500'></div> :
                            content.type === 'game' ?
                                <div className='w-full h-1 rounded-full bg-lime-500'></div> :
                                <div className='w-full h-1 rounded-full bg-amber-500'></div>
                    }
                </div>
                <div className='text-xl text-center'>Доп. контент</div>
                {
                    content.DLCs.map((dlc, i) => <div key={i} className='flex items-center rounded-lg bg-slate-800 bg-opacity-50 p-1 px-2'>
                        <div className='flex-grow'>
                            <div className='text-lg'>{dlc.label}</div>
                            <div className='text-sm'>{dlc.title}</div>
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
    </div>
}

export default GlobalModals