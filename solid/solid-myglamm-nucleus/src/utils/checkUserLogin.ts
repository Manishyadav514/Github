import { vendorDomainUrlMap } from "../constants/App.constant";
import { LOCALSTORAGE } from "../constants/Storage.constant";
import { getLocalStorageValue, setLocalStorageValue } from "./localStorage";

export function checkUserLoginStatus() {
    try {
        const currentUser = localStorage.getItem("nucleusUser") && JSON.parse(localStorage.getItem("nucleusUser") || "");
        if (currentUser) {
            return currentUser
        }
        return undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}

/**Utility to get vendorcode runtime */
export function getVendorCode() {
    const params = new URLSearchParams(window.location.search);
    const paramCountryName = params.get('countryName');
    let countryName;
    if (paramCountryName) {
        setLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME, paramCountryName)
        countryName = paramCountryName;
    } else if (getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY, true)) {
        countryName = getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME)
    } else {
        countryName = '';
    }
    let vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
    if (countryName && countryName !== 'IND' && (vendorCode === 'tmc' || vendorCode === 'srn' || vendorCode === 'orh')) {
        vendorCode = (vendorCode + '-' + countryName).toLowerCase();
    }
    return vendorCode;
}