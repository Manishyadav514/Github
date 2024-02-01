import React from "react";
import { useSnapshot } from "valtio";
import LazyHydrate from "react-lazy-hydration";

import { PDPFreeProdData, PDPOffersWidget, PDPProd } from "@typesLib/PDP";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import PDPOverrideOfferComponent from "./PDPOverrideOfferComponent";

interface PDPOfferProps {
  Offers: PDPOffersWidget[];
  product: PDPProd;
}

const PDPOffers = ({ Offers, product }: PDPOfferProps) => {
  const { PDPFreeProductData } = useSnapshot(PDP_STATES);

  if (!Offers && PDPFreeProductData) return null;

  return (
    <div className="OfferWidget my-2">
      <div className="bg-white">
        {(PDPFreeProductData as PDPFreeProdData)?.data?.data?.length > 0 && (
          <PDPOverrideOfferComponent freeProductsListIds={product.freeProducts?.ids} FreeProducts={PDPFreeProductData} />
        )}
      </div>

      {Offers?.length > 0 && (
        <LazyHydrate key="OfferWidget" whenIdle>
          <div className="text-xs leading-tight">
            {Offers.map((item, index: number) => (
              <div className={`${Offers.length === 1 ? "w-full" : "exclusive-offer-section"}`} key={`pdpoi-${index}`}>
                <span className="flex items-center bg-white py-2 px-3  border-offer h-14 overflow-hidden">
                  <img src={item.imgSrc} alt="logo" className="w-5 h-5 mr-2" />
                  <p
                    dangerouslySetInnerHTML={{ __html: item.text }}
                    className="text-xs leading-tight hide-text-exclusive-offer"
                  />
                </span>
              </div>
            ))}
          </div>
        </LazyHydrate>
      )}
    </div>
  );
};
export default PDPOffers;
