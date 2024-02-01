import { TRYON_REDUCER } from "@libStore/valtio/REDUX.store";

export const setTryonLocalImage = (data: any) => (TRYON_REDUCER.selectedImage = data);
export const setTryonActiveState = (data: any) => (TRYON_REDUCER.tryonActiveState = data);
