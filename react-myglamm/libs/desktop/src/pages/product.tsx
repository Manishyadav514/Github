import React from "react";
import dynamic from "next/dynamic";
import { LazyLoadComponent } from "react-lazy-load-image-component";

import { PDPPage } from "@typesLib/PDP";

import useEffectAfterRender from "@libHooks/useEffectAfterRender";

import { getPDPIntialProps } from "@productLib/pdp/HelperFunc";

import { generatePDPBreadBrumdData } from "@productLib/pdp/pdpUtils";
import { usePDPAnalytics } from "@productLib/pdp/hooks/usePDPAnalytics";

import PDPHead from "@libComponents/PDP/PDPHead";

import { SHOP } from "@libConstants/SHOP.constant";

import { RESET_PDP_STATES } from "@libStore/valtio/PDP.store";

import PDPTabs from "../Components/PDP/PDPTabs";
import Breadcrumbs from "../Components/breadcrumb";
import PDPShades from "../Components/PDP/PDPShades";
import PDPATCWeb from "../Components/PDP/PDPATCWeb";
import PDPReviews from "../Components/PDP/PDPReviews";
import PDPInfoPrice from "../Components/PDP/PDPInfoPrice";
import PDPQuestionWeb from "../Components/PDP/PDPQuestionWeb";
import PDPImageCarousel from "../Components/PDP/PDPImageCarousel";
import PDPKitsVariantSelector from "../Components/PDP/PDPKitsVariantSelector";
import ExclusiveOffersCashback from "../Components/PDP/ExclusiveOffersCashback";

const PDPLooks = dynamic(() => import("../Components/PDP/PDPLooks"), { ssr: false });

const PDPVideos = dynamic(() => import("../Components/PDP/PDPVideos"), { ssr: false });

const PDPFrequentlyBought = dynamic(() => import("../Components/PDP/PDPFrequentlyBought"), { ssr: true });

const ProductPage = ({ PDPProduct, PDPWidgets, isBot }: PDPPage) => {
  useEffectAfterRender(() => {
    return () => {
      RESET_PDP_STATES();
    };
  }, [PDPProduct?.id]);

  usePDPAnalytics(PDPProduct);

  const { categories, cms, shades, assets } = PDPProduct;

  const pdpVideos = assets.filter(x => x.type === "video");

  return (
    <main className="bg-white">
      <PDPHead product={PDPProduct} />

      <section className="max-w-screen-xl mx-auto">
        <Breadcrumbs navData={generatePDPBreadBrumdData(categories, cms?.[0]?.content?.name)} />

        <div className="relative py-6 w-full px-10 flex justify-between border-b border-gray-200">
          <PDPImageCarousel product={PDPProduct} />

          <div className="w-3/5 pl-6">
            <PDPInfoPrice product={PDPProduct} />

            {shades?.length > 0 && <PDPShades product={PDPProduct} />}

            <PDPATCWeb product={PDPProduct} />

            <PDPKitsVariantSelector product={PDPProduct} />

            <ExclusiveOffersCashback product={PDPProduct} offers={PDPWidgets.offers} />

            <PDPTabs product={PDPProduct} />

            <PDPReviews product={PDPProduct} />

            <PDPQuestionWeb product={PDPProduct} />
          </div>
        </div>

        <LazyLoadComponent>
          {pdpVideos.length > 0 && <PDPVideos videos={pdpVideos} />}

          {SHOP.IS_MYGLAMM && <PDPLooks productId={PDPProduct.id} />}
        </LazyLoadComponent>

        {isBot ? (
          <PDPFrequentlyBought product={PDPProduct} />
        ) : (
          <LazyLoadComponent>
            <PDPFrequentlyBought product={PDPProduct} />
          </LazyLoadComponent>
        )}
      </section>
    </main>
  );
};

ProductPage.getInitialProps = getPDPIntialProps;

export default ProductPage;
