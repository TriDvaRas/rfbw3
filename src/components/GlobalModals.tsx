import { useAtom } from 'jotai'
import React from 'react'
import { canRollNewContentAtom, contentFullInfoModalContentAtom, playerContentFinishModalContentAtom, showContentFullInfoModalAtom, showPlayerContentFinishModalAtom } from '../utils/atoms';
import { Badge, Button, Modal } from 'react-daisyui';
import { Content, ContentDLC, PlayerContent } from '@prisma/client';
import ContentPreview from './previews/ContentPreview';
import LazyImage from './util/LazyImage';
import { BiInfinite, BiSolidLockAlt } from 'react-icons/bi';
import Avatar from './util/Avatar';
import { api } from '../utils/api';
import { Popover } from 'react-tiny-popover';
import { useHover } from 'usehooks-ts';
import { GridLoader } from 'react-spinners';
import { GiAbstract064, GiCheckMark, GiCrossMark, GiCycle, GiPointyHat } from 'react-icons/gi';
import { LiaCoinsSolid } from 'react-icons/lia';
import { toast } from 'react-toastify';
import { Collapse } from 'react-collapse';

// type Props = {}
//! GLOBAL MODALS
function GlobalModals({ }) {
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [contentFullContent, setContentFullContent] = useAtom(contentFullInfoModalContentAtom)

    const [showContentFinishModal, setShowContentFinishModal] = useAtom(showPlayerContentFinishModalAtom)
    const [finishModalPlayerContent, setFinishModalPlayerContent] = useAtom(playerContentFinishModalContentAtom)

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
            {finishModalPlayerContent &&
                <ContentFinishModal
                    playerContent={finishModalPlayerContent}
                    show={showContentFinishModal}
                    onClickBackdrop={() => setShowContentFinishModal(false)}
                />
            }

        </div>
    )
}
//! ---

//! CONTENT FULL INFO MODAL
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
//! ---

//! CONTENT FINISH MODAL
function ContentFinishModal({ playerContent: pc, show, onClickBackdrop }: {
    playerContent: PlayerContent & {
        content: Content & {
            DLCs: ContentDLC[];
        };
    }
    show: boolean
    onClickBackdrop: () => void
}) {
    const [showResultSelector, setShowResultSelector] = React.useState(false)
    const [isCompleteSaving, setIsCompleteSaving] = React.useState(false)
    const [isRerollSaving, setIsRerollSaving] = React.useState(false)
    const [isDropSaving, setIsDropSaving] = React.useState(false)
    const [selectedDLCIds, setSelectedDLCIds] = React.useState<string[]>([])

    const [canRollNewContent, setCanRollNewContent] = useAtom(canRollNewContentAtom)
    const ctx = api.useContext()
    const { mutate: endContent, isLoading: finishContentIsLoading } = api.game.content.completeContent.useMutation({
        onMutate: () => {
            setCanRollNewContent(false)
        },
        onSuccess(data, variables, context) {
            toast.success('Контент окончен')
            Promise.all([
                ctx.playerContent.getMy.invalidate(),
                ctx.players.getPlayerDetails.invalidate(),
                ctx.players.getAllWithEntropy.invalidate(),
                ctx.game.feed.getFeed.invalidate(),
            ]).then(() => {
                setCanRollNewContent(true)
                setIsCompleteSaving(false)
                setIsRerollSaving(false)
                setIsDropSaving(false)
                onClose()
            })
        },
        onError: (err) => {
            toast.error(err.message)
            setCanRollNewContent(true)
            setIsCompleteSaving(false)
            setIsRerollSaving(false)
            setIsDropSaving(false)
        }
    })
    const handleCompleteWithDLCsClick = () => {
        setIsCompleteSaving(true)
        endContent({
            playerTileId: pc.playerTileId!,
            type: 'completed',
            DLCIds: selectedDLCIds,
        })
    }
    const handleCompleteClick = () => {
        if (pc.content.DLCs.length > 0) {
            setShowResultSelector(true)
            setIsCompleteSaving(true)
            setTimeout(() => {
                setIsCompleteSaving(false)
            }, 700);
        } else {
            setIsCompleteSaving(true)
            endContent({
                playerTileId: pc.playerTileId!,
                type: 'completed',
            })
        }
    }
    const handleRerollClick = () => {
        setIsRerollSaving(true)
        endContent({
            playerTileId: pc.playerTileId!,
            type: 'rerolled',
        })
    }
    const handleDropClick = () => {
        setIsDropSaving(true)
        endContent({
            playerTileId: pc.playerTileId!,
            type: 'dropped',
        })
    }

    const onClose = () => {
        setShowResultSelector(false)
        onClickBackdrop()
    }

    return <Modal
        // open={true}
        open={show}
        className='w-11/12 max-w-2xl'
        onClickBackdrop={onClose}
    >
        <Modal.Body>
            <div className='flex flex-col gap-2 '>
                <div className='text-center text-2xl mb-2 -mt-1'>Окончание <b>{pc.content.label}</b></div>
                <Collapse isOpened={!showResultSelector} >

                    <div className='grid grid-cols-3 grid-rows-1 gap-1'>
                        <div className='bg-slate-800 rounded-2xl flex flex-col p-1'>
                            <div className='flex-grow flex flex-col items-start justify-center w-full mb-2 px-2'>
                                <div className='text-center w-full'>За окончание:</div>
                                <ul>
                                    <li className='flex items-center gap-0.5'><div>+</div>{+pc.content.hours * 10}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /><div className='text-xs'>+DLC?</div></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>{+pc.content.hours * 10}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /><div className='text-xs'>+DLC?</div></li>
                                    {/* <li className='flex items-center gap-0.5'><div>+HRS</div><Badge color='secondary' size='sm'>x10</Badge>Очков<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                <li className='flex items-center gap-0.5'><div>+HRS</div><Badge color='secondary' size='sm'>x10</Badge>Дублонов<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li> */}
                                    <li className='flex items-center gap-0.5'><div>+</div>Немного <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                </ul>
                                <div className='text-center w-full'>За арбуз:</div>
                                <ul>
                                    <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 20}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /><div className='text-xs'>+DLC?</div></li>
                                    <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 20}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /><div className='text-xs'>+DLC?</div></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>Много <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                </ul>
                            </div>
                            <Collapse isOpened={!showResultSelector} >
                                <Button color='success' size='sm' fullWidth onClick={handleCompleteClick} disabled={isDropSaving || isRerollSaving} loading={isCompleteSaving}>Завершить<GiCheckMark className='ms-0.5 text-lg -mt-0.5' /></Button>
                            </Collapse>
                        </div>
                        <div className='bg-slate-800  rounded-2xl flex flex-col p-1'>
                            <div className='flex-grow flex flex-col items-start justify-center w-full mb-2 px-2'>
                                <div className='text-center w-full'>За окончание:</div>
                                <ul>
                                    <li className='flex items-center gap-0.5'><div>+</div>{0}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>{0}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>Немного <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                </ul>
                                <div className='text-center w-full'>За арбуз:</div>
                                <ul>
                                    <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 10}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                    <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 10}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>Много <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                </ul>
                            </div>
                            <Button color='warning' size='sm' onClick={handleRerollClick} disabled={isDropSaving || isCompleteSaving} loading={isRerollSaving}>Реролл<GiCycle className='ms-0.5 text-lg -mt-0.5' /></Button>
                        </div>
                        <div className='bg-slate-800 rounded-2xl flex flex-col p-1'>
                            <div className='flex-grow flex items-center justify-center'>
                                <div className='flex-grow flex flex-col items-start justify-center w-full mb-2 px-2'>
                                    <div className='text-center w-full'>За окончание:</div>
                                    <ul>
                                        <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 10}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                        <li className='flex items-center gap-0.5'><div>-</div>{+pc.content.hours * 10}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li>
                                        <li className='flex items-center gap-0.5'><div>+</div>Побольше <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                    </ul>
                                </div>
                            </div>
                            <Button color='error' size='sm' onClick={handleDropClick} disabled={isCompleteSaving || isRerollSaving} loading={isDropSaving}>Дроп<GiCrossMark className='ms-0.5 text-lg -mt-0.5' /></Button>
                        </div>
                    </div>
                </Collapse>
                <Collapse isOpened={showResultSelector} theme={{ collapse: 'ReactCollapse--collapse ', content: 'ReactCollapse--content' }} style={{ height: '100%' }}>
                    <div className='grid grid-cols-3 grid-rows-1 gap-1'>
                        <div className='flex flex-col gap-1 col-span-2 bg-slate-800 rounded-2xl px-2 pb-2 '>
                            <div className='text-center '>Выбор завершенных Частей</div>
                            <div className='flex  flex-col gap-1 justify-center items-center  overflow-auto pe-0.5'>
                                <div className={`w-full flex flex-row justify-center items-center gap-0.5 text-sm bg-lime-500 text-slate-900 rounded-full `}>
                                    <div className='flex-grow text-center flex justify-between items-center px-1'>
                                        <BiSolidLockAlt />{pc.content.label}<BiSolidLockAlt className='opacity-0' />
                                    </div>
                                    <div className='flex flex-row justify-center items-center gap-0.5  bg-slate-700 px-3 rounded-full text-slate-300'>
                                        {'+'}
                                        <div className='' title='Очки' >{+pc.content.hours * 10}</div>
                                        <GiPointyHat title='Очки' className='text-blue-400 drop-shadow me-2' />
                                        {'+'}
                                        <div className='' title='Дублоны' >{+pc.content.hours * 10}</div>
                                        <LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow ' />
                                    </div>
                                </div>
                                {
                                    pc.content.DLCs.map((dlc, i) => <div key={i}
                                        className={`w-full flex flex-row justify-center items-center gap-0.5 text-sm ${selectedDLCIds.includes(dlc.id) ? 'bg-lime-500 text-slate-900' : 'bg-slate-900 bg-opacity-75 text-slate-300 '} rounded-full cursor-pointer`}
                                        onClick={() => setSelectedDLCIds(x => x.includes(dlc.id) ? x.filter(y => y !== dlc.id) : [...x, dlc.id])}
                                    >
                                        <div className='flex-grow text-center '>
                                            {dlc.label}
                                        </div>
                                        <div key={i} className='flex flex-row justify-center items-center gap-0.5  bg-slate-700 px-3 rounded-full text-slate-300'>
                                            {'+'}
                                            <div className='' title='Очки' >{+dlc.hours * 10}</div>
                                            <GiPointyHat title='Очки' className='text-blue-400 drop-shadow me-2' />
                                            {'+'}
                                            <div className='' title='Дублоны' >{+dlc.hours * 10}</div>
                                            <LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow ' />
                                        </div>
                                    </div>)
                                }
                            </div>
                            <div className='flex-grow'>

                            </div>
                        </div>
                        <div className='bg-slate-800 rounded-2xl flex flex-col p-1'>
                            <div className='flex-grow flex flex-col items-start justify-center w-full mb-2 px-2'>
                                <div className='text-center w-full'>За окончание:</div>
                                <ul>
                                    <li className='flex items-center gap-0.5'><div>+</div>{Math.round((selectedDLCIds.map(id => +pc.content.DLCs.find(x => x.id == id)!.hours).reduce((a, b) => a + b, +pc.content.hours)) * 10)}<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                    <li className='flex items-center gap-0.5'><div>+</div>{Math.round((selectedDLCIds.map(id => +pc.content.DLCs.find(x => x.id == id)!.hours).reduce((a, b) => a + b, +pc.content.hours)) * 10)}<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li>
                                    {/* <li className='flex items-center gap-0.5'><div>+HRS</div><Badge color='secondary' size='sm'>x10</Badge>Очков<GiPointyHat title='Очки' className='text-blue-400 drop-shadow' /></li>
                                <li className='flex items-center gap-0.5'><div>+HRS</div><Badge color='secondary' size='sm'>x10</Badge>Дублонов<LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' /></li> */}
                                    <li className='flex items-center gap-0.5'><div>+</div>Немного <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' /></li>
                                </ul>
                            </div>
                            <Button color='success' size='sm' fullWidth onClick={handleCompleteWithDLCsClick} disabled={isDropSaving || isRerollSaving} loading={isCompleteSaving}>Завершить<GiCheckMark className='ms-0.5 text-lg -mt-0.5' /></Button>
                        </div>
                    </div>

                </Collapse>

            </div>
        </Modal.Body>
    </Modal>
}
//! ---



export default GlobalModals