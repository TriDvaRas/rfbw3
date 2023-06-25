import { Content } from '@prisma/client';
import React, { useRef, useState } from 'react'
import ContentPreview from './ContentPreview';

type Props = {
    content: Content[]
}

function PlayerContentListPreview({ content }: Props) {
    // const [scroll, setScroll] = useState(0)
    const isDown = useRef<boolean>(false);
    const startX = useRef<number>(0);
    const scrollLeft = useRef<number>(0);

    function startDrag(e: React.MouseEvent<HTMLDivElement>) {
        isDown.current = true;
        startX.current = e.pageX - e.currentTarget.offsetLeft;
        scrollLeft.current = e.currentTarget.scrollLeft;
    }
    function endDrag() {
        isDown.current = false;
    }
    function drag(e: React.MouseEvent<HTMLDivElement>) {
        if (!isDown.current) return;
        e.preventDefault();
        const x = e.pageX - e.currentTarget.offsetLeft;
        const walk = (x - startX.current); //scroll-fast
        e.currentTarget.scrollLeft = scrollLeft.current - walk;
    }

    return (
        <div className="w-full flex flex-row overflow-x-auto h-[355px] overflow-y-hidden "
            onMouseDown={startDrag}
            onMouseLeave={endDrag}
            onMouseUp={endDrag}
            onMouseMove={drag}
        >
            {
                content.map((content, i) => <ContentPreview key={i} approved={content.approved} className="scale-75 -my-8 m" label={content.label} type={content.type} imageUrl={content.imageId} />)
            }
        </div>
    )
}

export default PlayerContentListPreview