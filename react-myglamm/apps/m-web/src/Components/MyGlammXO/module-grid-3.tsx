import React from "react";
import Link from "next/link";

import { formatPrice } from "@libUtils/format/formatPrice";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const ModuleGrid3 = ({ data }: any) => {
  const widgetMeta = data.meta.widgetMeta && JSON.parse(data.meta.widgetMeta);

  return (
    <div className="py-4">
      <span className="text-xs px-6 bg-white mx-auto mb-4 uppercase table" style={{ letterSpacing: "5px", lineHeight: "14px" }}>
        {data.commonDetails.title}
      </span>
      <img alt="myglammxo" className="mx-auto mb-6" src="https://files.myglamm.com/site-images/original/myGlammXO.png" />
      <div className="flex flex-wrap w-full justify-between">
        {data?.commonDetails?.descriptionData?.[0]?.value?.map((prod: any) => (
          <div key={prod.id} className="bg-white p-2 mb-1" style={{ width: "49.5%" }}>
            <Link href={prod.urlManager.url} prefetch={false} aria-label={prod.cms[0]?.content.name.substring(0, 45)}>
              <img
                src={(prod.assets[0].imageUrl && prod.assets[0].imageUrl["400x400"]) || DEFAULT_IMG_PATH()}
                alt={prod.productTag || "Image"}
                className="mb-2"
              />
              <div className="productInfo">
                <p className="font-semibold h-10 text-sm">
                  {prod.cms[0]?.content.name.substring(0, 45)}
                  {prod.cms[0]?.content.name.length > 46 && "..."}
                </p>
                <p className="opacity-50 text-xs h-10 my-2">
                  {prod.cms[0]?.content.subtitle.substring(0, 60)}
                  {prod.cms[0]?.content.subtitle.length > 61 && "..."}
                </p>

                {/* Price PlaceHolder */}
                <div className="font-semibold flex text-sm">
                  <div className="w-2/3 m-auto">
                    <span className="mr-1">{formatPrice(prod.offerPrice, true)}</span>
                    {prod.price > prod.offerPrice && <del className="text-xs opacity-25">{formatPrice(prod.price, true)}</del>}
                  </div>
                  <span className="w-1/3 rounded text-white text-center py-1" style={{ backgroundColor: "rgb(229, 35, 100)" }}>
                    BUY
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {widgetMeta?.cta && (
        <Link
          href={widgetMeta.cta.url}
          prefetch={false}
          className="underline uppercase font-semibold mx-auto table my-6 tracking-widest"
          style={{ color: "#fd7795" }}
          aria-label={widgetMeta.cta.name || "go to myglammxo"}
        >
          {widgetMeta.cta.name || "go to myglammxo"}
        </Link>
      )}
    </div>
  );
};

export default ModuleGrid3;
