import { proxy } from "valtio";

export const PLP_STATE = proxy({
  products: [],
  productCount: 0,
  historyUrl: "",
  newFilterVariant: "",
});
