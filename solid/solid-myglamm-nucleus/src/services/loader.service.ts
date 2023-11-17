import { createSignal } from "solid-js";
import { observable } from "solid-js";

const [isLoader, setIsLoader] = createSignal({ message: '', isVisible: false });
const obsv$ = observable(isLoader)

function showLoader(message: string = 'Loading...') {
    setIsLoader({ message: message, isVisible: true })
}

function hideLoader() {
    setIsLoader({ message: '', isVisible: false })
}

export { obsv$,showLoader,hideLoader }