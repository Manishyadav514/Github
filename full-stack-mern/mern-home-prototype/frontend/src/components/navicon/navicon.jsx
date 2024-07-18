import { NavLink } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import s from "./navicon.module.css"



function navicon (props){
    if (props.route=='home'){
        return (
            <NavLink to={"/home"}>
                {(linkprops)=>{
                    return (
                        <div
                         className= {linkprops.isActive? s.container_active: s.container} >
                            <HomeIcon width={30} height={30}/>
                        </div>
                    )
                }
                }

            </NavLink>
        )
    }

    else if (props.route=='settings'){
        return (
            <NavLink to={"/settings"}>
                {(linkprops)=>{
                    return (
                        <div
                         className= {linkprops.isActive? s.container_active: s.container} >
                            <Cog6ToothIcon width={30} height={30}/>
                        </div>
                    )
                }
                }

            </NavLink>
        )
    }

    else if (props.route=='statistics'){
        return (
            <NavLink to={"/statistics"}>
                {(linkprops)=>{
                    
                    return (
                        
                        <div
                         className= {linkprops.isActive? s.container_active: s.container} >
                            <ChartPieIcon width={30} height={30}/>
                        </div>
                    )
                   
                }
                }

            </NavLink>
        )
    }

    else if (props.route=='security'){
        
        return (
           
            <NavLink to={"/security"}>
                
                {(linkprops)=>{
                    
                    return (
                        
                        <div
                         className= {linkprops.isActive? s.container_active: s.container} >
                            <ShieldCheckIcon width={30} height={30}/>
                        </div>
                        
                    )
                
                }
                }
           

            </NavLink>

        )
    }






}
export default navicon