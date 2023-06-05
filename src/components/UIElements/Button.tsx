import React from 'react'

type Props = {
    children?: React.ReactNode
    className?: string
}

function Button({ children, className }: Props) {
    return (
        <a href="#" className={`rounded-md px-3.5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${className ?? ''}`}>{children}</a>
    )
}

export default Button