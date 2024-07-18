import s from "./cammusic.module.css"



function cammusic (){
return(

<div className={s.container}>

<div className="mt-4 border rounded-2xl relative" >
    <div className="absolute top-0 left-0 right-0 flex justify-between p-2 text-white font-semibold 
    text-opacity-80  ">
        <div className="text-sm">Cam 1</div>
        <div className="text-sm flex justify-between items-center gap-2">
            <div className="border border-red-500 rounded-full w-1 h-1 bg-red-500 opacity-80"></div>
            Live
            </div>
    </div>
<img src="https://source.unsplash.com/yFV39g6AZ5o" className="h-[300px] w-full rounded-2xl object-cover" alt=""/>
</div>
<div className=" mt-4 border rounded-2xl relative">
<div className="absolute top-0 left-0 right-0 flex justify-between p-2 text-black font-semibold 
   text-sm text-opacity-80 z-10 ">
        Music
        
    </div>
<img src="https://source.unsplash.com/anapPhJFRhM" className="h-[300px] w-full rounded-2xl object-cover
transition-transform ease-in-out duration-300 transform scale-100 hover:scale-110 " alt=""/>
</div>
</div>


)


}
export default cammusic