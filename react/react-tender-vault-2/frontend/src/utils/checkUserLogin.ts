
import { getLocalStorageValue, setLocalStorageValue } from "./localStorage";

export function checkUserLoginStatus() {
    try {
        const currentUser = localStorage.getItem("doctorDashboardUser") && JSON.parse(localStorage.getItem("doctorDashboardUser") || "");
        if (currentUser) {
            return currentUser
        }
        return undefined;
    } catch (err) {
        console.log(err);
        return undefined;
    }
}