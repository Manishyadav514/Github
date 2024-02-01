import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Adobe from "@libUtils/analytics/adobe";

function useDsAdobe(data: any) {
  const { ref, inView } = useInView({ threshold: data.title === "cartupsell_tworows" ? 0.5 : data.threshold || 1 });

  useEffect(() => {
    /**
     * Check if its a DS Widget or Normal/Default Widget
     * Call the adobeDsEvent only when its a DS Widget
     */

    let clearTimer: any;

    if (inView && data.dsWidgetType && data.dsWidgetType !== "defaultWidget" && data.products) {
      clearTimer = setTimeout(() => {
        Adobe.adobeDSEvent(data.title, data.dsWidgetType, data?.sku, data?.variantValue, data?.evarName, data.products);
      }, 300);
    }

    return () => clearTimeout(clearTimer);
  }, [inView, data.dsWidgetType, data.products]);

  return { dsWidgetRef: ref };
}

export default useDsAdobe;
