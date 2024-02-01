import { useSnapshot } from "valtio";

import { ValtioStore } from "@typesLib/ValtioStore";

import { valtioReduxStore } from "@libStore/valtio/REDUX.store";

export function useSelector<_, Selected extends unknown>(func: (globalStore: ValtioStore) => Selected) {
  const store = useSnapshot(valtioReduxStore);

  // @ts-ignore
  return func(store);
}
