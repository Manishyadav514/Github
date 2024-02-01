import React, { useEffect, useState } from "react";

import { PDPProd } from "@typesLib/PDP";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { SLUG } from "@libConstants/Slug.constant";

import Widgets from "@libComponents/HomeWidgets/Widgets";

import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";

const PDPCustomerViewBought = ({ product }: { product: PDPProd }) => {
  const [customerViewedBoughtWidget, setCustomerViewedBoughtWidget] = useState<any[]>([]);

  useEffect(() => {
    const widgetApi = new WidgetAPI();

    widgetApi
      .getWidgets({ where: { slugOrId: SLUG().PDP_CUSTOMER_ALSO_VIEWED } })
      .then(({ data: widgetRes }) => {
        const customerAlsoViewedNBought = widgetRes?.data?.data?.widget;

        if (customerAlsoViewedNBought?.length) {
          const customerViewed = customerAlsoViewedNBought?.find((item: any) => item?.label?.toLowerCase().includes("viewed"));
          const customerBought = customerAlsoViewedNBought?.find((item: any) => item?.label?.toLowerCase().includes("bought"));
          let widgetData: any[] = [];

          switch (PDP_VARIANTS.customerAlsoViewedVariant) {
            case "2":
              widgetData = [{ ...customerViewed, productSKU: product?.sku }];
              break;
            case "1":
              widgetData = [{ ...customerBought, productSKU: product?.sku }];
              break;
            case "3":
              widgetData = [
                { ...customerViewed, productSKU: product?.sku },
                { ...customerBought, productSKU: product?.sku },
              ];
              break;
            default:
              break;
          }

          setCustomerViewedBoughtWidget(widgetData);
        }
      })
      .catch(() => null);
  }, []);

  if (customerViewedBoughtWidget.length) {
    return <Widgets widgets={customerViewedBoughtWidget} />;
  }

  return null;
};

export default PDPCustomerViewBought;
