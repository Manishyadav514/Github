import { createContext,useContext,useState } from "react";

const CoordsContext = createContext()

export function CoordsProvider({children}){
    const [Coords,setCoords]=useState(null);
    

    return(
        <CoordsContext.Provider value={{Coords,setCoords}}>
            {children}
        </CoordsContext.Provider>
    )

}

export function useCoords() {
    return useContext(CoordsContext)
}