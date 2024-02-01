import React, { useEffect, useRef } from "react";
import LazyHydrate from "react-lazy-hydration";

interface PropTypes {
  id: string;
  className: string;
  adSlotData: any;
  isInterstitial?: boolean;
}

const AdSlot = (props: PropTypes) => {
  const { id, className, adSlotData, isInterstitial } = props;

  const ref = useRef(id);
  const slotRef = useRef();

  const activate = () => {
    try {
      (window as any)?.googletag?.cmd?.push(() => {
        const slot = (window as any).googletag
          ?.defineSlot(adSlotData?.slotName, adSlotData?.size, ref.current)
          ?.addService((window as any).googletag.pubads());
        slotRef.current = slot;
        (window as any).googletag.enableServices();
        (window as any).googletag.display(slot);

        // This code is only for interstitial ads
        // It works as a callback - if the Ad is loaded only then its css is made visible
        if (isInterstitial) {
          (window as any)?.googletag.pubads().addEventListener("slotRenderEnded", (event: any) => {
            if (event.slot.getSlotElementId() === id && document.getElementById(id)?.firstChild?.hasChildNodes()) {
              document.getElementById(`${id}-main`)?.classList?.remove("invisible");
            }
          });
        }
      });
    } catch (error) {
      // console.warn("hey error in ads");
    }
  };

  const didHydrate = () => {
    if ((window as any)?.googletag && (window as any)?.googletag?._loaded_ && adSlotData?.slotName) {
      activate();
    } else {
      const i = setInterval(() => {
        if ((window as any)?.googletag && (window as any)?.googletag?._loaded_ && adSlotData?.slotName) {
          activate();
          clearInterval(i);
        }
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (slotRef?.current && (window as any)?.googletag && (window as any)?.googletag?._loaded_)
        (window as any)?.googletag?.destroySlots([slotRef.current]);
    };
  }, []);

  return (
    <LazyHydrate whenVisible didHydrate={didHydrate}>
      <div id={ref.current} className={`w-full mx-auto flex justify-center relative ${className}`} />
    </LazyHydrate>
  );
};

AdSlot.defaultProps = {
  isInterstitial: false,
};

export default AdSlot;
