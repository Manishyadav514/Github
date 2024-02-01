import { useEffect } from "react";

import { use_App } from "@libHooks/use_app";

const UseApp = ({ store }: { store: any }) => {
  // Window reload if userAgent is changed
  useEffect(() => {
    (window as any).currentUserAgent = navigator.userAgent;
    (window as any).onresize = () => {
      if ((window as any).currentUserAgent != navigator.userAgent) {
        (window as any).location.reload();
      }
    };
  }, []);

  use_App(store);

  return null;
};

export default UseApp;
