import { useRouter } from "next/router";

import useEffectAfterRender from "./useEffectAfterRender";

export function useCallonRouteChange(callback: () => void) {
  const { asPath } = useRouter();

  useEffectAfterRender(() => {
    callback();
  }, [asPath]);
}
