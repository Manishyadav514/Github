import { createContext,useContext,useState } from "react";

const DevicesContext = createContext()

export function DevicesProvider({children}){
    const [devices,setDevices]=useState([]);

    return(
        <DevicesContext.Provider value={{devices,setDevices}}>
            {children}
        </DevicesContext.Provider>
    )

}

export function useDevices() {
    return useContext(DevicesContext)
}