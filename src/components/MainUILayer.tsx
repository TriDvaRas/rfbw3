
import React from 'react'
import { AiFillHome } from 'react-icons/ai'
import { useAtom } from 'jotai'
import { showHomeMenuAtom } from '../utils/atoms'
import { Button } from 'react-daisyui'


function MainUILayer() {
    const [showHomeMenu, setShowHomeMenu] = useAtom(showHomeMenuAtom)
    return (
        // <div className='h-screen w-screen absolute -z-10'>
        [
            <div key={'lt'} className='absolute top-0 left-0 z-10 m-2' style={showHomeMenu?{left:-20}:{}}>
                <Button className="" shape='square' size='md' color='secondary'><AiFillHome className='text-xl' /></Button>
            </div>,
        ]
    )
}

export default MainUILayer