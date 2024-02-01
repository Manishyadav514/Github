import { useEffect, useRef } from "react";

/**
 * React runs this function when the key changes but it just avoid the intial render
 * i.e First Render no callback
 */

const useEffectAfterRender = (func: () => void, key: any) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      // react please run me if 'key' changes, but not on initial render
      func();
    } else {
      didMount.current = true;
    }
  }, key);
};

export default useEffectAfterRender;
