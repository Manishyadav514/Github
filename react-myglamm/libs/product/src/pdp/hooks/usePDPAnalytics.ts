import Router from "next/router";
import { useSnapshot } from "valtio";

import { useEffect } from "react";

import { PDPProd } from "@typesLib/PDP";

import { isClient } from "@libUtils/isClient";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getCurrency } from "@libUtils/format/formatPrice";
import { GA4Event, GAPageView } from "@libUtils/analytics/gtm";

import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { PARTNERSHIP_STATE } from "@libStore/valtio/PARTNERSHIP.store";

import { getGAPageViewObject, pdpAdobePageLoad } from "../AnalyticsHelper";

export function usePDPAnalytics(product: PDPProd) {
  const { selectedChildProducts } = useSnapshot(PDP_STATES) || {};

  useEffect(() => {
    if (product.id) {
      const pageViewobject = getGAPageViewObject(product);
      const partnershipData: any = (
        isClient() ? PARTNERSHIP_STATE.partnershipData : product?.partnerShipData
      )?.couponList?.find((data: any) => {
        return data.productId === product.id;
      });

      const mrpPriceOfDiscount: any = partnershipData?.discountAmount ? formatPrice(partnershipData?.discountAmount) : 0;

      GAPageView(Router.asPath, pageViewobject, "product");
      GA4Event([
        {
          event: "view_item",
          ecommerce: {
            currency: getCurrency(),
            value: pageViewobject.product.MRP - mrpPriceOfDiscount,
            items: [
              {
                item_id: pageViewobject.product.id,
                item_name: pageViewobject.product.name,
                discount: partnershipData?.discountAmount
                  ? formatPrice(partnershipData?.discountAmount || 0)
                  : formatPrice(product?.price - product?.offerPrice),
                ...(partnershipData?.partnershipCoupon && { coupon: partnershipData.partnershipCoupon }),
                item_brand: pageViewobject.product.brand,
                item_category: product?.categories.parentCategoryName,
                item_category_2: product?.categories.subChildCategoryName,
                item_category_3: product?.categories.childCategoryName,
                price: pageViewobject.product.MRP,
                quantity: 1,
                ...(product?.shades?.length && { item_variant: product?.cms?.[0]?.attributes?.shadeLabel || null }),
                inventory_status: product?.inStock ? "in stock" : "out of stock",
              },
            ],
          },
        },
      ]);

      setTimeout(() => pdpAdobePageLoad(product, selectedChildProducts as PDPProd[]), 1000);
    }
  }, [product?.id]);
}
