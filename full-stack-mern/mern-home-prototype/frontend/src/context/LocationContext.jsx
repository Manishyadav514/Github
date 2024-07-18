import { createContext,useContext,useState } from "react";
const LocationContext = createContext()

export function LocationProvider({children}){
    const [customLocation,setcustomLocation]=useState(" ");

    return(
        <LocationContext.Provider value={{customLocation,setcustomLocation}}>
            {children}
        </LocationContext.Provider>
    )


}

export function uselocation() {
    return useContext(LocationContext)
}