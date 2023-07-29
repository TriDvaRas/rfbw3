import React, { useEffect, useRef } from 'react'
import { api } from '../../utils/api'
import { GridLoader } from 'react-spinners'
import { Content, Coop, Player, Event } from '@prisma/client'
import Avatar from '../util/Avatar'
import { Popover } from 'react-tiny-popover'
import { useHover, useIntersectionObserver } from 'usehooks-ts'
import { GiAbstract064, GiCheckMark, GiCrossMark, GiCycle, GiPointyHat, GiRollingDices } from 'react-icons/gi'
import { LiaCoinsSolid } from 'react-icons/lia'
import moment from 'moment';
import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import ru from 'timeago.js/lib/lang/ru';
import { useAtom } from 'jotai'
import { contentFullInfoModalContentAtom, showContentFullInfoModalAtom } from '../../utils/atoms'
timeago.register('ru', ru);

function SidebarFeed({ }) {
    const { data, fetchNextPage, isInitialLoading, error } = api.game.feed.getFeed.useInfiniteQuery({
        limit: 12,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })

    const ref = useRef<HTMLDivElement>(null!)
    const entry = useIntersectionObserver(ref, {
        threshold: 1
    })
    const lastPage = data?.pages[data.pages.length - 1]
    useEffect(() => {
        if (entry?.isIntersecting && lastPage?.nextCursor && !isInitialLoading) {
            fetchNextPage()
        }
    }, [entry?.isIntersecting, fetchNextPage, isInitialLoading, lastPage?.nextCursor])


    if (isInitialLoading)
        return <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-2xl rounded-scollable-2xl w-full h-full flex items-center justify-center overflow-auto'>
            <GridLoader color="#36d7b7" />
        </div >
    const feed = data?.pages.flat().map(x => x.items).flat() ?? []
    return <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-2xl rounded-scollable-2xl w-full h-full    p-2 overflow-auto'>
        <div className='text-3xl text-center -mt-1'>{'𝕏'}</div>
        {error && <div className='text-red-500 text-center text-xl'>{error.message}</div>}
        {data && !isInitialLoading && feed.length == 0 ?
            <div className='flex items-center justify-center mt-3'>Тут будет 🤤</div>
            :
            <div className='flex flex-col gap-1 justify-center '>
                {feed.map((item, i) => <FeedItem key={i} feedItem={item} />)}
            </div>}
        <div ref={ref}> {lastPage?.nextCursor && <GridLoader color="rgb(8 51 68)" />}</div>
    </div>
}
type FeedItemProps = {
    feedItem: (Event & {
        coop: Coop | null;
        sourcePlayer: Player | null;
        targetPlayer: Player | null;
        sourceContent: Content | null;
        targetContent: Content | null;
    })
}
function FeedItem({ feedItem }: FeedItemProps) {
    return <div className='flex flex-row justify-center items-center gap-2 w-full bg-slate-950 bg-opacity-20 p-2 rounded-3xl'>
        <FeedItemLeft feedItem={feedItem} />
        <FeedItemCenter feedItem={feedItem} />
        <FeedItemRight feedItem={feedItem} />
    </div>

}

function FeedItemLeft({ feedItem }: FeedItemProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isHovered = useHover(ref)
    let left = <div />
    switch (feedItem.type) {
        case 'contentDropped':
        case 'contentFinished':
        case 'contentRerolled':
        case 'contentRolled':
            left = <Popover
                containerClassName='z-50'
                isOpen={isHovered}
                positions={['top']}
                padding={5}
                content={<div className={`flex flex-col gap-1 px-2  text-center rounded-full  mx-1.5 text-slate-950 bg-info`}>
                    {feedItem.sourcePlayer!.name}
                </div>}
            >
                <Avatar src={feedItem.sourcePlayer!.imageUrl} size={56} />
            </Popover>

    }
    return <div ref={ref} className='flex '>
        {left}
    </div>
}

function FeedItemRight({ feedItem }: FeedItemProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isHovered = useHover(ref)
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [content, setContent] = useAtom(contentFullInfoModalContentAtom)

    let right = <div />
    switch (feedItem.type) {
        case 'contentDropped':
        case 'contentFinished':
        case 'contentRerolled':
        case 'contentRolled':
            right = <Popover
                containerClassName='z-50'
                isOpen={isHovered}
                positions={['top']}
                padding={5}
                content={<div className={`flex flex-col gap-1 px-2  text-center rounded-full  mx-1.5 text-slate-100 ${feedItem.targetContent!.type == 'game' ? 'bg-green-500' : feedItem.targetContent!.type == 'movie' ? 'bg-amber-500' : 'bg-pink-500'}`}>
                    {feedItem.targetContent!.label || 'ЯЙЦА'}
                </div>}
            >
                <Avatar src={feedItem.targetContent!.imageId} size={56} onClick={() => {
                    setContent(feedItem.targetContent)
                    setShowContentFullInfo(true)
                }} />
            </Popover>

    }
    return <div ref={ref} className='flex'>
        {right}
    </div>
}

function FeedItemCenter({ feedItem }: FeedItemProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isHovered = useHover(ref)
    let cent
    const deltas = <div className='flex flex-row justify-center items-center gap-1 text-sm'>
        {/* pointsDelta */}
        {!!feedItem.pointsDelta && <div className='' title='Очки' >{feedItem.pointsDelta > 0 && '+'}{feedItem.pointsDelta}</div>}
        {!!feedItem.pointsDelta && <GiPointyHat title='Очки' className='text-blue-400 drop-shadow' />}
        {/* moneyDelta */}
        {!!feedItem.moneyDelta && <div className='' title='Дублоны' >{feedItem.moneyDelta > 0 && '+'}{feedItem.moneyDelta}</div>}
        {!!feedItem.moneyDelta && <LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' />}
        {/* entropyDelta */}
        {!!feedItem.entropyDelta && <div className='' title='Энтропия' >{feedItem.entropyDelta > 0 && '+'}{feedItem.entropyDelta}</div>}
        {!!feedItem.entropyDelta && <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' />}
    </div>
    const time = <TimeAgo className='text-sm' datetime={feedItem.createdAt} locale='ru' title={`${moment(feedItem.createdAt).format('DD.MM.YYYY HH:mm:ss')}`} />
    switch (feedItem.type) {
        case 'contentDropped':
            cent = <div className='flex flex-col justify-center items-center h-full w-full'>
                <div className='flex gap-1 justify-center items-center '><GiCrossMark className='text-red-400 text-lg' />Дроп<GiCrossMark className='text-red-400 text-lg' /></div>
                {deltas}
                {time}
            </div>
            break;
        case 'contentFinished':
            cent = <div className='flex flex-col justify-center items-center h-full w-full'>
                <div className='flex gap-1 justify-center items-center '><GiCheckMark className='text-lime-300 text-lg' />Завершение<GiCheckMark className='text-lime-300 text-lg' /></div>
                {deltas}
                {time}
            </div>
            break;
        case 'contentRerolled':
            cent = <div className='flex flex-col justify-center items-center h-full w-full'>
                <div className='flex gap-1 justify-center items-center '><GiCycle className='text-amber-300 text-lg' />Реролл<GiCycle className='text-amber-300 text-lg' /></div>
                {deltas}
                {time}
            </div>
            break;
        case 'contentRolled':
            cent = <div className='flex flex-col justify-center items-center h-full w-full'>
                <div className='flex gap-1 justify-center items-center '><GiRollingDices className='text-green-300 text-lg' />Получение<GiRollingDices className='text-green-300 text-lg' /></div>
                {time}
            </div>
            break;
        default:
            cent = <div className='flex flex-col justify-center items-center h-full w-full' >
                <div className='text-fuchsia-600'>{feedItem.sourcePlayer!.name}</div>
                {time}
            </div>
            break;
    }

    return <div ref={ref} className='flex-grow flex justify-center items-center h-full w-full -py-1'>
        <Popover
            containerClassName='z-50'
            isOpen={isHovered}
            positions={['top']}
            padding={5}
            content={<div className='flex flex-col gap-1 text-sm bg-info bg-opacity-100 text-center rounded-full px-2 mx-1.5 text-slate-950'>
                {feedItem.altText}
            </div>}
        >
            {cent}
        </Popover>
    </div>
}
export default SidebarFeed