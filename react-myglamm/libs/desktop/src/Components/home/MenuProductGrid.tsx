import React from "react";
import Link from "next/link";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { generateICIDlink, getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

const MenuProductGrid = ({ data, icid, widgetsCount, closeMenu }: any) => (
  <div className="justify-end flex menuProductsWidget">
    {/* <div className="w-full flex justify-end "> */}
    {data.commonDetails.descriptionData[0].value.map((product: any, index: number) => {
      // check if there are two widgets ,if two widgets then display only 3 products or else 4 products
      if ((widgetsCount > 1 && index < 3) || (widgetsCount === 1 && index < 4)) {
        return (
          <div
            key={product.id}
            className={` p-2.5 inline-block menuProducts collectionProduct outline-none mx-1.5 w-52 h-72 border border-solidborder-slate-200`}
          >
            <Link
              href={generateICIDlink(product.urlManager?.url, icid, `${product.cms?.[0]?.content?.name}_${index + 1}`)}
              onClick={closeMenu}
            >
              <LazyLoadImage
                alt={product.assets[0]?.name}
                src={getImage(product, "400x400")}
                className="mb-3.5 w-44 h-44 mx-auto"
              />
              <p className="productName font-bold text-center text-xs mb-1 truncate">{product.cms?.[0]?.content?.name}</p>
              <p className="productSubtitle text-10 text-center opacity-70 truncate mb-2.5">
                {product.cms?.[0].content.subtitle}
              </p>
              <div className="priceDetails flex justify-center text-sm my-2.5 items-center">
                <span className="offerPrice font-bold mr-2.5">{formatPrice(product?.offerPrice, true)}</span>
                {product.offerPrice < product.price && (
                  <del className="actualPrice text-xs text-slate-400">{formatPrice(product.price, true)}</del>
                )}
              </div>
            </Link>
          </div>
        );
      }
    })}
  </div>
);

export default MenuProductGrid;
