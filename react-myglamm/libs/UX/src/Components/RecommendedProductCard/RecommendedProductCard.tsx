import React, { useEffect, useState } from "react";
import Link from "next/link";

import PDPLabel from "@libComponents/PDP/PDPLabel";
import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import ProductAPI from "@libAPI/apis/ProductAPI";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

function RecommendedProductCard() {
  const productsIds = JSON.parse(localStorage.getItem("recentProduct")!);
  const [recentViewProducts, setRecentViewProducts] = useState<any>([]);

  useEffect(() => {
    const recentProduct = async () => {
      const where = {
        id: {
          inq: productsIds,
        },
      };
      const api = new ProductAPI();
      const viewedProduct = await api.getProduct(where);
      setRecentViewProducts(viewedProduct?.data?.data?.data);
    };
    recentProduct();
  }, []);

  return (
    <>
      <PDPLabel label="RECENTLY VIEWED PRODUCT" />
      <GoodGlammSlider>
        {recentViewProducts?.map((product: any) => (
          <div key={product.id}>
            <Link
              href={product.urlManager.url}
              prefetch={false}
              legacyBehavior
              aria-label={product.cms[0]?.content.name.substring(0, 18)}
            >
              <div
                className="mx-1 mb-2 h-full rounded-sm px-2 py-3"
                style={{
                  boxShadow: "0 0 3px 0 rgba(0,0,0,.12",
                  border: "1px solid rgba(0,0,0,.1)",
                  width: "95%",
                }}
              >
                <div className="flex justify-center">
                  <img
                    style={{ width: "80px", height: "80px" }}
                    src={product?.assets[0]?.imageUrl ? product?.assets[0]?.imageUrl["400x400"] : DEFAULT_IMG_PATH()}
                    alt={product?.assets[0]?.name}
                  />
                </div>

                <div className="px-1 h-24 text-sm">
                  <p className="text-xs font-bold py-1">{product.cms[0]?.content.name.substring(0, 18)}</p>
                  <p className="text-xs" style={{ color: "#949494" }}>
                    {product.cms[0]?.metadata.description.substring(0, 20)}
                    ...
                  </p>
                  <p className="truncate font-semibold my-2 uppercase" style={{ fontSize: "10px", color: "#949494" }}>
                    {product.cms[0]?.content.subtitle}
                  </p>
                </div>

                <div className="mx-1 mb-2">
                  <p className="text-sm mb-2 font-bold">{formatPrice(product.price, true, false)}</p>
                  <button type="button" className="text-white bg-ctaImg p-2 text-xs uppercase rounded-sm w-full">
                    Add to bag
                  </button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </GoodGlammSlider>
    </>
  );
}

export default React.memo(RecommendedProductCard);
