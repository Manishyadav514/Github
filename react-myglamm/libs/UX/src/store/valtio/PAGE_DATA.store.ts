import { proxy, useSnapshot } from "valtio";

import Router, { useRouter } from "next/router";

type PAGE_STATE = { state: { [char: string]: any } };

export const PAGE_CONSTANT: PAGE_STATE = proxy({ state: {} });

/* Page Store Manipulations */
export const SET_PAGE_DATA = (states: any) => {
  const path = Router.asPath.split("?")[0];

  /* Garbage Collection */
  const cleanupTimer = setInterval(() => {
    if (location.pathname?.split("?")[0] !== path) {
      CLEAR_PAGE_DATA(path);
      clearInterval(cleanupTimer);
    }
  }, 300000);

  PAGE_CONSTANT.state = { ...PAGE_CONSTANT.state, [path]: states };
};

export const CLEAR_PAGE_DATA = (path?: string) => {
  if (path) {
    return (PAGE_CONSTANT.state[path] = undefined);
  }

  PAGE_CONSTANT.state = {};
};

/* Page Store Data Retireval */
export const PAGE_DATA = (path?: string) => useSnapshot(PAGE_CONSTANT).state[path || useRouter().asPath.split("?")[0]]; // gives updated data in relatime like hook

export const PAGE_CONSTANT_DATA = (path?: string) => PAGE_CONSTANT.state[path || Router.asPath.split("?")[0]];
