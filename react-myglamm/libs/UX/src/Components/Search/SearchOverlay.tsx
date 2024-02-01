import React, { useEffect } from "react";

import clsx from "clsx";
import { useSnapshot } from "valtio";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { SEARCH_STATE } from "@libStore/valtio/SEARCH.store";

import { disableBodyScroll, enableBodyScroll } from "@libUtils/bodyScroll";

// search suggestions/results overlay
const Overlay = () => {
  const snap = useSnapshot(SEARCH_STATE);

  useEffect(() => {
    disableBodyScroll();
    return enableBodyScroll;
  });

  return (
    <div
      onClick={() => {
        if (!snap.blurOverlay) {
          SEARCH_STATE.showOverlay = false;
          SEARCH_STATE.suggestions = [];
        }
      }}
      className={clsx(
        snap.blurOverlay ? "bg-white backdrop-blur-sm opacity-75" : "bg-black opacity-50",
        "absolute bottom-0 top-0 left-0 right-0 w-screen z-10 flex items-center justify-center"
      )}
    >
      {snap.blurOverlay && <LoadSpinner className="w-16 m-auto inset-0 absolute" />}
    </div>
  );
};

export default Overlay;
