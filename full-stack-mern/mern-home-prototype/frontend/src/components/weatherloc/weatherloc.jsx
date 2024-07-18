import {uselocation} from "../../context/locationcontext"
import { useState } from "react"

function weatherloc(){
    const{customLocation,setcustomLocation}=uselocation()
    const[inputlocation,setInputLocation]=useState("")
    const handleinputlocation=(e)=>{
        setInputLocation(e.target.value)
    }
    const handlelocationsubmit=(e,inputlocation)=>{
        e.preventDefault()
        
        setcustomLocation(inputlocation)
        window.scrollTo(0, 0);
    }

    const handlereset=(e)=>{
        e.preventDefault()
        setcustomLocation(" ")
        window.scrollTo(0, 0);
    }
    return(
        <>
        <form className="grid grid-cols-2 gap-2 max-w-xl m-auto mt-4" onSubmit={(e)=>(handlelocationsubmit(e,inputlocation))}>
        
        <div  className="col-span-2 text-left text-[28px]" value={inputlocation} onChange={handleinputlocation}>
    Enter custom location for weather data
    </div>

  
    <div className="col-span-2 lg:col-span-1">
      <input type="text" id="location" value={inputlocation} onChange={handleinputlocation} 
      className="border border-solid border-black rounded-[24px] px-[12px] py-[3px] md:text-[22.5px] w-full" placeholder="Enter custom location"/>
    </div>

    <div className="col-span-2 lg:col-span-1 text-right">
      <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full text-xs w-full sm:w-14 ">
        Enter
      </button>
    </div>
    
    <div className="col-span-2 text-right">
      <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded-full text-xs w-full sm:w-14 "
      onClick={handlereset}>
        Reset
      </button>
    </div>

        </form>
        
        
        </>
    )

}

export default weatherloc