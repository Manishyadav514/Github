import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

import { isClient } from "@libUtils/isClient";

import useEffectAfterRender from "./useEffectAfterRender";

export function useOptimize(experimentId?: string | string[], callback?: () => void) {
  const { query, asPath } = useRouter();
  const renderCheck = useRef(false);

  const { layout } = query;

  const getVariant = (init = false) => {
    const MULTIPLE_IDS = Array.isArray(experimentId);

    /* onload init is true and we give undefined so that an additional chk can be made */
    const NO_VARIANT = init ? undefined : "no-variant";

    /* Set All the "1" as in active inCase query param layout is retrieved */
    if (layout) {
      // Support for multivariants through query
      const LAYOUT_VARIANT = +layout;
      if (!isNaN(LAYOUT_VARIANT)) {
        if (MULTIPLE_IDS) return experimentId.map(() => layout);

        return layout;
      }

      // fallback
      if (MULTIPLE_IDS) return experimentId.map(() => "1");

      return "1";
    }

    /* Consider Boolean value as byDefault values and incase number then directly convert to string and return */
    if (typeof experimentId === "boolean") return experimentId ? "1" : "0";

    if (typeof experimentId === "number") return (experimentId as number).toString();

    if (isClient() && (window as any).google_optimize) {
      if (MULTIPLE_IDS) {
        const tempVariants: string[] = [];
        experimentId.forEach(id => {
          if (typeof id === "boolean") {
            tempVariants.push(id ? "1" : "0");
          } else if (typeof id === "number") {
            // Considering Number as bydefault value for a A/B
            tempVariants.push((id as number).toString());
          } else {
            tempVariants.push((window as any).google_optimize.get(id) || NO_VARIANT);
          }
        });

        return tempVariants;
      }

      return (window as any).google_optimize.get(experimentId) || NO_VARIANT;
    }

    return MULTIPLE_IDS ? [] : NO_VARIANT;
  };

  /* Assigning Different Variables to avoid type errors and backward compatibitlity */
  const setVariantValue = (init = false) =>
    Array.isArray(experimentId) ? setVariants(getVariant(init)) : setVariant(getVariant(init) as string);

  const [optimizeLoaded, setOptimizeLoaded] = useState(false);
  const [variant, setVariant] = useState<string>(getVariant(true) as string);
  const [variants, setVariants] = useState<string | string[]>(getVariant(true));

  useEffect(() => {
    window.dataLayer?.push({ event: "optimize.activate" });
  }, []);

  useEffect(() => {
    let optimizeInterval: NodeJS.Timer;
    if (
      !variant ||
      variant === "no-variant" ||
      renderCheck.current ||
      (Array.isArray(variants) && (variants.filter(x => x).length !== variants.length || !variants.length)) // any one is not defined in an array
    ) {
      if (experimentId) {
        let counter = 0;
        optimizeInterval = setInterval(() => {
          counter++;
          if ((window as any).google_optimize) {
            setVariantValue();
            setOptimizeLoaded(true);
            clearInterval(optimizeInterval);

            /* Incase something needs to get triggered instantly */
            callback?.();
          } else if (counter > 50) {
            setVariantValue();
            setOptimizeLoaded(true);
            clearInterval(optimizeInterval);
          }
        }, 200);
      } else if (!experimentId || !process.env.NEXT_PUBLIC_OPT_CONTAINER_ID) {
        setVariantValue();
        setOptimizeLoaded(true);
      }
    }

    return () => clearInterval(optimizeInterval);
  }, [asPath]);

  // if we want to re initialize the useOptimize hook on the same page when we already have a variant value 1/0, then this boolean will help us
  // use case: product pages where we want to have different variant value for different slugss.
  useEffectAfterRender(() => {
    renderCheck.current = true;
  }, [asPath]);

  /**
   * Note:
   * Use "variants" for multiple ids otherwise go for default "variant"
   */

  return { variant, variants, optimizeLoaded };
}
