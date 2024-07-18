import s from './location_chip.module.css'


function location_chip(props){

    const isSelected= props.location === props.selectedLocation ? true : false;
    const handlelocation= () => {props.handleLocationSelect(props.location)}

    return(
        <button className={isSelected? s.button_on : s.button_off} onClick={handlelocation}> {props.location}</button>
    )


}

export default location_chip

