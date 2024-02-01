import DynamicRenderer from "@libComponents/Common/DynamicRenderer";
import { PDPProd } from "@typesLib/PDP";
import dynamic from "next/dynamic";
import React from "react";
import PDPATCBottom from "./PDPATCBottom";
import PDPOutOfStockBottom from "./PDPOutOfStockBottom";
import PDPStyle from "./PDPStyle";
import PDPTopSection from "./PDPTopSection";
const PDPWidgetsV2 = dynamic(() => import(/* webpackChunkName: "PDPWidgetsV2" */ "@libComponents/PDPWidgets/PDPWidgets"));

const PDPv2 = ({
  product,
  configPrice,
  showBestOffer,
  pdpOffers,
  PDPWidgets,
  addOnData,
  isBot,
  isProductsOOS,
}: {
  product: PDPProd;
  configPrice?: any;
  showBestOffer?: any;
  pdpOffers?: any;
  PDPWidgets?: any;
  addOnData?: any;
  isBot?: boolean;
  isProductsOOS?: boolean;
}) => {
  return (
    <section className="bg-white">
      <PDPTopSection
        product={product}
        configPrice={configPrice}
        showBestOffer={showBestOffer}
        pdpOffers={pdpOffers}
        addOnData={addOnData}
      />
      <DynamicRenderer isBot={isBot}>
        {/* <Widgets slugOrId={SLUG()?.PDP_V2} widgets={PDPWidgets?.newPDPWidget?.widget} product={product} /> */}
        <PDPWidgetsV2 product={product} widget={PDPWidgets?.newPDPWidget} />
      </DynamicRenderer>
      {isProductsOOS ? (
        <PDPOutOfStockBottom product={product} />
      ) : (
        <PDPATCBottom product={product} flashSaleWidgetData={PDPWidgets.flashSale} addOnData={addOnData} isNewPDP={true} />
      )}
      <PDPStyle />
    </section>
  );
};

export default PDPv2;
