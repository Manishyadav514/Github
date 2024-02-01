import { useEffect } from "react";
import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";
import { PDPProd } from "@typesLib/PDP";
import { useSplit } from "@libHooks/useSplit";
import { PDP_ALL_VARIANTS_NAMES } from "../PDP.constant";

export function useVariants(product: PDPProd) {
  const SplitVariants =
    useSplit({
      experimentsList: [
        { id: "customerAlsoViewedVariant" },
        { id: "pdpMultiWidgetPopupVariant" },
        { id: "similarProductsVariant" },
        { id: "addOnProductVariant" },
        { id: "downloadCtaVariant" },
        { id: "frequentlyBroughtVariant" },
        { id: "dynamicOfferVariant" },
        { id: "widgetonAddtocart" },
        { id: "PDPConcernIngredientVariant" },
        { id: "pdpTagsFlagVariant" },
        { id: "pdpRecurringSubscriptionVariant" },
        { id: "similiarProductsTagFilterVariant" },
      ],
      deps: [product.id],
    }) || {};

  const { customerAlsoViewedVariant, pdpMultiWidgetPopupVariant, addOnProductVariant, pdpTagsFlagVariant } =
    SplitVariants || {};

  function variantValidCheck(variant?: string) {
    return variant && variant !== "no-variant";
  }

  /* Varaint Set in Valtio and Evar set for whatever cases possible */
  useEffect(() => {
    if (customerAlsoViewedVariant && pdpMultiWidgetPopupVariant) {
      PDP_ALL_VARIANTS_NAMES.forEach((varaintName, index) => {
        const currentVariantVal = SplitVariants[varaintName];
        if (currentVariantVal) {
          // @ts-ignore
          PDP_VARIANTS[varaintName] = currentVariantVal;
        }
      });
      if (variantValidCheck(customerAlsoViewedVariant)) {
        (window as any).evars.evar155 = customerAlsoViewedVariant;
      }

      if (variantValidCheck(addOnProductVariant)) {
        PDP_VARIANTS.addOnProductVariant = addOnProductVariant;
      }
    }
  }, [SplitVariants]);
}
