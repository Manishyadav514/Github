import { useState } from 'react'
import s from './card.module.css'
import { PowerIcon } from '@heroicons/react/24/solid'


function card (props){
    
    
    const handleClick = () => {
       props.handleDevices(props.device._id)
    }

    return(
        <div className={s.card}>
            <img src={props.device.image} className={s.img} alt={props.device.name}></img>
            <div className={s.device_info}>
            <p className={s.device_text}>{props.device.name}</p>
            <button type='button' onClick={handleClick} className={props.device.state ? s.device_iconon : s.device_iconoff}>
            <PowerIcon width={36} height={36}/> 
            </button>
            </div>
        </div>
    )
}

export default card