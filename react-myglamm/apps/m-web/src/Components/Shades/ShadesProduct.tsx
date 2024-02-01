import React, { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import useAddtoBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import { formatPrice } from "@libUtils/format/formatPrice";

import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

function ShadesProduct({ productContent, Product, getProductData }: any) {
  const [loading, setLoading] = useState(false);
  const RefArray: any[] = [];
  const router = useRouter();

  const { t } = useTranslation();

  const [product] = Product?.data || [];
  const { isPreOrder } = product?.productMeta || {};

  const { addProductToCart } = useAddtoBag(Product?.relationalData);

  useEffect(() => {
    if (RefArray.length > 0) {
      RefArray[0].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [Product]);

  const [CTA, setCTA] = useState<string>();

  useEffect(() => {
    if (!CTA) {
      setCTA(isPreOrder ? t("preOrderNow") : t("addToBag"));
    }
  }, [t]);

  const addToBag = () => {
    if (CTA === t("goToBag")) {
      router.push("/shopping-bag");
    } else {
      setLoading(true);
      addProductToCart(product, isPreOrder ? 3 : 1).then((res: boolean) => {
        if (res) {
          setLoading(false);
          setCTA(t("goToBag"));
        } else {
          setLoading(false);
        }
      });
    }
  };

  return (
    <React.Fragment>
      <div
        className={`border-2 border-white text-center py-10 uppercase font-semibold tracking-wide text-base
          ${Product?.slug === productContent.slug && "border-4 border-gray-900 opacity-50"}`}
        style={{
          height: "6.68rem",
          background: `url(${productContent.thumbnail})`,
        }}
        aria-hidden="true"
        data-slug={productContent.slug}
        onClick={getProductData}
      >
        {productContent.label}
      </div>
      {product?.urlManager?.url === productContent.slug && (
        <div
          className="w-screen bg-white px-8 py-8 text-center text-black uppercase tracking-tight leading-relaxed absolute left-0 opacity-100 block"
          ref={(r: any) => RefArray.push(r)}
        >
          <Link href={product.urlManager.url} aria-label={product.cms[0]?.name}>
            <img
              src={product.assets?.filter((asset: any) => asset.type === "image")[0]?.imageUrl["400x400"] || DEFAULT_IMG_PATH()}
              alt="Product"
              className="px-6"
            />
            <div className="mb-6 px-2">
              <p className="text-sm">{product.cms[0]?.name}</p>
              <p className="font-extrabold text-base">{product.cms[0]?.content.name}</p>
              <p className="opacity-50 text-xs">{product.cms[0]?.content.subtitle}</p>
              <p className="font-extrabold text-lg tracking-normal">{formatPrice(product.price, true)}</p>
            </div>
          </Link>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addToBag}
              className="rounded-sm border bg-white text-black text-4 uppercase px-8 py-2 h-12 font-semibold inline-block leading-tight w-40"
            >
              {loading ? <LoadSpinner className="w-6 h-6 mx-auto" /> : CTA}
            </button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default ShadesProduct;
