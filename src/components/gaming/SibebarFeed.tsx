import React from 'react'
import { api } from '../../utils/api'
import { GridLoader } from 'react-spinners'
import { Content, Coop, Player, Event } from '@prisma/client'
import Avatar from '../util/Avatar'
import { Popover } from 'react-tiny-popover'
import { useHover } from 'usehooks-ts'
import { GiAbstract064, GiPointyHat } from 'react-icons/gi'
import { LiaCoinsSolid } from 'react-icons/lia'


function SidebarFeed({ }) {
    const { data, fetchNextPage, isInitialLoading, error } = api.game.feed.getFeed.useInfiniteQuery({
        limit: 12,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor
    })
    if (isInitialLoading)
        return <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-lg w-full h-full flex items-center justify-center overflow-auto'>
            <GridLoader color="#36d7b7" />
        </div >
    const feed = data?.pages.flat().map(x => x.items).flat() ?? []
    return <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-lg w-full h-full    p-2'>
        {error && <div className='text-red-500 text-center text-xl'>{error.message}</div>}
        <div className='flex flex-col gap-1 justify-center overflow-auto'>
            {feed.map((item, i) => <FeedItem key={i} feedItem={item} />)}
        </div>
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
    switch (feedItem.type) {
        case 'contentDropped':
        case 'contentFinished':
        case 'contentRerolled':
        case 'contentRolled':
            return <div className='flex'>
                <Avatar src={feedItem.sourcePlayer!.imageUrl} size={56} />
            </div>

    }
    return <div className='flex '>

    </div>
}

function FeedItemRight({ feedItem }: FeedItemProps) {
    switch (feedItem.type) {
        case 'contentDropped':
        case 'contentFinished':
        case 'contentRerolled':
        case 'contentRolled':
            return <div className='flex'>
                <Avatar src={feedItem.targetContent!.imageId} size={56} />
            </div>

    }
    return <div className='flex'>

    </div>
}

function FeedItemCenter({ feedItem }: FeedItemProps) {
    const ref = React.useRef<HTMLDivElement>(null)
    const isHovered = useHover(ref)
    let cent
    const deltas = <div className='flex flex-row justify-center items-center gap-1'>
        {/* pointsDelta */}
        {feedItem.pointsDelta && <div className='' title='Очки' >{feedItem.pointsDelta > 0 && '+'}{feedItem.pointsDelta}</div>}
        {feedItem.pointsDelta && <GiPointyHat title='Очки' className='text-blue-400 drop-shadow' />}
        {/* moneyDelta */}
        {feedItem.moneyDelta && <div className='' title='Дублоны' >{feedItem.moneyDelta > 0 && '+'}{feedItem.moneyDelta}</div>}
        {feedItem.moneyDelta && <LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' />}
        {/* entropyDelta */}
        {feedItem.entropyDelta && <div className='' title='Энтропия' >{feedItem.entropyDelta > 0 && '+'}{feedItem.entropyDelta}</div>}
        {feedItem.entropyDelta && <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' />}
    </div>
    switch (feedItem.type) {
        case 'contentDropped':
        case 'contentFinished':
        case 'contentRerolled':
        case 'contentRolled':
            cent = <div className='flex justify-center items-center h-full w-full'>
                {deltas}
            </div>
            break;
        default:
            cent = <div className='flex justify-center items-center h-full w-full'>
                Unknown Event
            </div>
            break;
    }

    return <div ref={ref} className='flex-grow flex justify-center items-center h-full w-full py-1'>
        <Popover
            containerClassName='z-50'
            isOpen={isHovered}
            positions={['top']}
            padding={5}
            content={<div className='flex flex-col gap-1  bg-sky-950 bg-opacity-100 text-center rounded-full px-4 mx-1.5 text-slate-100'>
                {feedItem.altText}
            </div>}
        >
            {cent}
        </Popover>
    </div>
}
export default SidebarFeed