import React from "react";
import dynamic from "next/dynamic";
import { useSnapshot } from "valtio";

import { PDP_VARIANTS } from "@libStore/valtio/PDP.store";

import PDPPrice from "./PDPPrice";

const PDPSearchTags = dynamic(() => import(/* webpackChunkName: "PDPSearchTags" */ "@libComponents/PDP/PDPSearchTags"), {
  ssr: false,
});

const PDPTagFLag = dynamic(() => import(/* webpackChunkName: "PDPTagFLag" */ "@libComponents/PDP/PDPTagFLag"), {
  ssr: false,
});

function PDPTitleDesc({ product, flashSaleWidgetData }: any) {
  const { pdpTagsFlagVariant } = useSnapshot(PDP_VARIANTS);

  return (
    <>
      <div className="HeaderNDescription pt-4 bg-white" style={{ borderBottom: "solid 2px #f7f7f7" }}>
        <div className="flex p-2 w-full">
          <div className="px-2 w-4/6 flex flex-col justify-center ">
            <h1 className="font-medium leading-tight capitalize text-base mb-2">{product.cms[0]?.content?.name}</h1>
            <h2 className="text-xs text-gray-600 pr-2  leading-tight capitalize">{product.cms[0]?.content.subtitle}</h2>
          </div>
          {/*Product  Price*/}
          <PDPPrice product={product} flashSaleWidgetData={flashSaleWidgetData} />
        </div>

        {/* Product Tag Flag */}
        {pdpTagsFlagVariant === "1" && product?.productMeta?.tags?.[0]?.name && (
          <PDPTagFLag tags={product?.productMeta?.tags?.[0]} />
        )}

        {/*Product search tags*/}
        <PDPSearchTags tags={product?.productMeta?.searchText || product?.cms[0]?.content?.searchText} />
      </div>
    </>
  );
}

export default PDPTitleDesc;
