import { CONFIG_REDUCER } from "@libStore/valtio/REDUX.store";

export const getSelectAddressBreadcrumb = () => [
  {
    name: CONFIG_REDUCER.configV3.shoppingBag,
    slug: "/shopping-bag",
  },
  { name: CONFIG_REDUCER.configV3.selectAddress },
];
