import React from 'react'
import icon from '../../assets/css/icon-font/iconfont.css'

const Icon = (props) => (

    <i style={{
        fontSize: props.size ? `${props.size}px` : '12px',
        color: props.color ? `${props.color}` : '#333',
        ...props.style
    }} className={
        ['icon', 'iconfont', `icon-${props.type}`].map(item => icon[item]).join(' ')
    }></i>
)

export default Icon
