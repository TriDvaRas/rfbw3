import { Content, ContentDLC, Player, PlayerContent } from '@prisma/client'
import _ from 'lodash'
import { useState, useRef } from 'react';
import { Button, } from 'react-daisyui'
import { GiAbstract048, GiAbstract064, GiAbstract066, GiPointyHat } from 'react-icons/gi'
import { LiaCoinsSolid } from 'react-icons/lia'
import { MdOutlineExpandLess, MdOutlineExpandMore } from 'react-icons/md'
import { GridLoader } from 'react-spinners'
import { api } from '../../utils/api'
import Avatar from '../util/Avatar'
import { Collapse } from 'react-collapse'
import { BiLockAlt } from 'react-icons/bi'
import { BsEgg } from 'react-icons/bs'
import LazyImage from '../util/LazyImage'
import { Popover, ArrowContainer } from 'react-tiny-popover'
import { useHover } from 'usehooks-ts'
import { useAtom } from 'jotai';
import { showContentFullInfoModalAtom, contentFullInfoModalContentAtom } from '../../utils/atoms';
// type Props = {}

function SidebarPlayersList({ }) {
    const { data: players, isLoading, error } = api.players.getAllWithEntropy.useQuery()
    if (isLoading)
        return <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-lg w-full h-full flex items-center justify-center overflow-auto'>
            <GridLoader color="#36d7b7" />
        </div >
    return (
        <div className=' bg-sky-950 backdrop-blur-sm bg-opacity-70 rounded-lg w-full h-full flex  justify-center overflow-auto'>
            {/* <div className='text-xl text-center'>Игроки</div> */}
            {error && <div className='text-red-500 text-center text-xl'>{error.message}</div>}
            {players &&
                <div className='flex flex-col w-full gap-1 relative my-2'>
                    {_.orderBy([...players], 'points', 'desc')
                        .map((p, i, ps) => {
                            let plc = i
                            while (ps[plc - 1]) {
                                if (ps[plc - 1]!.points == p.points)
                                    plc--
                                else break
                            }
                            return <PlayerCard key={p.id} player={p} place={plc + 1} />
                        })}
                    <div className='text-center'>
                        #DHNWE
                    </div>
                </div >
            }
        </div >
    )
}

function PlayerCard({ player, place }: {
    player: (Player & {
        Entropy: {
            entropy: number;
        }[];
    })
    place: number
}) {
    const [showPlayerDetails, setShowPlayerDetails] = useState(false)

    return <div className="flex flex-col   bg-blue-950 bg-opacity-50 rounded-md mx-2 p-1">
        <div className="flex items-center gap-x-3   w-full  ">
            {/* <img className="h-16 w-16 rounded-full" src={player.imageUrl} alt="" /> */}
            {/* <img className="h-16 w-16 rounded-full" src={player.imageUrl} alt="" /> */}
            <div className='text-lg text-bold w-10 text-center ' style={{
                fontSize: place == 1 ? '2.3rem' :
                    place == 2 ? '2.0rem' :
                        place == 3 ? '1.8rem' : '1.2rem',
                color: place == 1 ? '#FFD700' :
                    place == 2 ? '#C0C0C0' :
                        place == 3 ? '#cd7f32' : '#fff'
            }}>#{place}</div>
            <Avatar className="mr-0" size={48} src={player.imageUrl} />
            <div className='flex-grow'>
                <h3 className="text-base  font-semibold leading-7 tracking-tight text-orange-100 drop-shadow">{player.name}</h3>
                <p className="text-sm font-semibold leading-4  flex flex-row  items-center">
                    <div className='' title='Очки' >{player.points}</div>
                    <GiPointyHat title='Очки' className='text-blue-400 drop-shadow' />
                    <div className='ms-2' title='Дублоны' >{player.money}</div>
                    <LiaCoinsSolid title='Дублоны' className='text-yellow-500 drop-shadow' />
                    <div className='ms-2' title='Энтропия' >{_.sumBy(player.Entropy, 'entropy')}</div>
                    <GiAbstract064 title='Энтропия' className='text-purple-500 drop-shadow' />
                </p>
            </div>
            <div className='-ms-12'>
                <Button shape='circle' size='md' color='ghost' onClick={() => setShowPlayerDetails(!showPlayerDetails)}>
                    <label className={`swap ${showPlayerDetails ? 'swap-active' : ''} `}>
                        <div className="swap-on"><MdOutlineExpandLess className='text-3xl' /></div>
                        <div className="swap-off"><MdOutlineExpandMore className='text-3xl' /></div>
                    </label>
                </Button>
            </div>
        </div>
        {/* DETAILS COLLAPSE */}
        <Collapse isOpened={showPlayerDetails}>
            <PlayerDetails playerId={player.id} place={place} />
        </Collapse>
    </div>
}

function PlayerDetails({ playerId, place }: {
    playerId: (Player['id'])
    place: number
}) {
    const { data, isLoading, error } = api.players.getPlayerDetails.useQuery(playerId)
    if (isLoading)
        return <div className='flex justify-center items-center py-4'>
            <GridLoader color="#36d7b7" />
        </div >
    if (error)
        return <div className='text-red-500 text-center text-xl'>{error.message}</div>
    if (!data)
        return <div className='text-red-500 text-center text-xl'>А где?)</div>
    const coops = data.playerContents.filter(c => c.coopId != null)
    const anime = data.playerContents.filter(c => c.content.type == 'anime' && c.coopId == null)
    const games = data.playerContents.filter(c => c.content.type == 'game' && c.coopId == null)
    const movies = data.playerContents.filter(c => c.content.type == 'movie' && c.coopId == null)

    return <div className='flex flex-col pt-2 gap-1'>
        {/* anime */}
        <div className='flex flex-row gap-2 px-2'>
            <div className=' w-[5px] bg-pink-500 rounded-full my-0.5'></div>
            {[0, 1, 2].map(i => <div key={i} className='w-1/3'>
                {
                    anime[i] ?
                        <PlayerDetailsContent content={anime[i]!} /> :
                        data.animeSlots > i ?
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BsEgg></BsEgg></div> :
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BiLockAlt></BiLockAlt></div>
                }
            </div>
            )}
        </div>
        <div className='flex flex-row gap-2 px-2'>
            <div className=' w-[5px] bg-lime-500 rounded-full my-0.5'></div>
            {[0, 1, 2].map(i => <div key={i} className='w-1/3'>
                {
                    games[i] ?
                        <PlayerDetailsContent content={games[i]!} /> :
                        data.gameSlots > i ?
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BsEgg></BsEgg></div> :
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BiLockAlt></BiLockAlt></div>
                }
            </div>
            )}
        </div>
        <div className='flex flex-row gap-2 px-2'>
            <div className=' w-[5px] bg-amber-500 rounded-full my-0.5'></div>
            {[0, 1, 2].map(i => <div key={i} className='w-1/3'>
                {
                    movies[i] ?
                        <PlayerDetailsContent content={movies[i]!} /> :
                        data.movieSlots > i ?
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BsEgg></BsEgg></div> :
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BiLockAlt></BiLockAlt></div>
                }
            </div>
            )}
        </div>
        <div className='flex flex-row gap-2 px-2'>
            <div className=' w-[5px] bg-blue-500 rounded-full my-0.5'></div>
            {[0, 1, 2].map(i => <div key={i} className='w-1/3'>
                {
                    coops[i] ?
                        <PlayerDetailsContent content={coops[i]!} /> :
                        data.coopSlots > i ?
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BsEgg></BsEgg></div> :
                            <div className='rounded-md bg-stone-800 bg-opacity-75 aspect-2/3 w-full flex justify-center items-center text-3xl'><BiLockAlt></BiLockAlt></div>
                }
            </div>
            )}
        </div>

    </div>
}

function PlayerDetailsContent({ content }: {
    content: (PlayerContent & {
        content: Content & {
            DLCs: ContentDLC[];
        };
    })
}) {

    const [isHover, setIsHover] = useState(false)
    const [showContentFullInfo, setShowContentFullInfo] = useAtom(showContentFullInfoModalAtom)
    const [__, setContent] = useAtom(contentFullInfoModalContentAtom)
    return <Popover
        containerClassName='z-50'
        isOpen={isHover}
        positions={['top', 'bottom', 'right']}
        padding={10}
        content={({ position, nudgedLeft, nudgedTop }) => (
            <div className='badge badge-info'>
                {content.content.label}
            </div>
        )}>
        <div className='rounded-md overflow-hidden aspect-2/3 w-full flex justify-center items-center text-3xl'
            onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
            onClick={() => {
                setShowContentFullInfo(true)
                setContent(content.content)
            }}
        >
            <LazyImage src={content.content.imageId} alt="Ты не должен этого видеть. Перезалей картинку." height={128} width={85} className="object-cover h-full" imageClassName='rounded-md' />
            {/* {`${isHover}`} */}
        </div>
    </Popover>
}
export default SidebarPlayersList