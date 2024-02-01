import { useEffect, useState } from "react";

import { PDPProd } from "@typesLib/PDP";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";
import PDPFrequentlyBroughtV2 from "@libComponents/PDP/PDPFrequentlyBroughtV2";

const PDPFrequentlyBoughtV2Wrapper = ({ product }: { product: PDPProd }) => {
  const [frequentlyBought, setFrequentlyBought] = useState<any[]>([]);

  useEffect(() => {
    const widgetApi = new WidgetAPI();

    widgetApi
      .getWidgets({ where: { slugOrId: SLUG().PDP_FREQUENTLY_BROUGHT } })
      .then(({ data: widgetRes }) => {
        setFrequentlyBought(widgetRes?.data?.data?.widget[0]);
      })
      .catch(() => null);
  }, []);

  if (frequentlyBought?.length) {
    return <PDPFrequentlyBroughtV2 product={product} widget={frequentlyBought} />;
  }

  return null;
};

export default PDPFrequentlyBoughtV2Wrapper;
