import { useEffect } from "react";

import { setSessionStorageValue } from "@libUtils/sessionStorage";

import { SESSIONSTORAGE } from "@libConstants/Storage.constant";

const useCommunitySession = () => {
    useEffect(()=>{
        setSessionStorageValue(SESSIONSTORAGE.USER_LANDED_ON_OTHER_PAGES,"1")
    },[])
}

export default useCommunitySession