import React from 'react'

type Props = {
    children?: React.ReactNode
    className?: string
    variant: 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' | 'white' | 'black'
    bgOpacity?: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
}

function UIButton({ children, className, variant = 'slate', bgOpacity = 100 }: Props) {
    return
    // return <a className={`cursor-pointer bg-slate-500 hover:bg-slate-700 bg-opacity-60 hover:bg-opacity-100 transition-all font-bold text-white border-slate-700 py-3 px-3 rounded ${className ?? ''}`}>{children}</a>
}

export default UIButton