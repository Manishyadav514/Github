import React, { useState } from "react";
import Link from "next/link";

import { getImage } from "@libUtils/homeUtils";
import { formatPrice } from "@libUtils/format/formatPrice";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import useAddToBag from "@libHooks/useAddToBag";
import useTranslation from "@libHooks/useTranslation";

import { SET_MINI_CART_MODAL, SET_NOTIFY_MODAL } from "@libStore/valtio/MODALS.store";

import { adobeTriggerNotifyMe } from "@libAnalytics/AddToBag.Analytics";

import StarFilled from "../../../../UX/public/svg/star-filled.svg";

const BlogInStoryProducts = ({ descriptionData, blog, relationalData, header }: any) => {
  const { t } = useTranslation();

  const [prodId, setProdId] = useState("");
  const [loader, setLoader] = useState(false);

  const { addProductToCart } = useAddToBag(relationalData);

  const addToBag = (prod: any, e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();

    setLoader(true);
    setProdId(prod.id);

    let type: number | undefined;
    if (prod.productMeta.isPreOrder) type = 3;
    else if (prod.inStock) type = 1;

    if (type) {
      addProductToCart(prod, type).then(result => {
        if (result) {
          SET_MINI_CART_MODAL({ show: true });
        }
        setLoader(false);
      });
    } else {
      setLoader(false);
      SET_NOTIFY_MODAL({ show: true });
      console.log({ relationalData, blog });

      adobeTriggerNotifyMe(blog.cms[0]?.content?.name.toLowerCase() || "", header);
    }
  };

  return (
    <>
      {descriptionData[0]?.value.map((product: any) => {
        const img = product.assets.find((a: any) => a.type === "image");
        const DISABLED_CTA = loader && prodId === product.id;

        return (
          <div className="blog-products my-4  relative w-full mx-auto" key={product.id}>
            <Link
              href={product.urlManager?.url}
              className="p-4 w-full flex justify-between items-center"
              style={{
                boxShadow: "0 0 7px 0 rgb(0 0 0 / 10%)",
              }}
            >
              <div className="w-1/4">
                <ImageComponent
                  className="mx-auto"
                  style={{ maxHeight: "130px" }}
                  src={getImage(product, "200x200")}
                  alt={img?.properties?.altText || img?.name}
                />
              </div>
              <div className="w-3/4 pl-4 pt-4">
                <div className="text-2xl leading-none  uppercase name mx-auto mb-1 font-bold truncate">
                  {product?.cms[0]?.content?.name || product.productTag}
                </div>
                <p className="text-lg  font-semibold mb-4 truncate text-gray-400">{product?.cms[0]?.content?.subtitle}</p>
                {product?.shadeLabel && (
                  <span className="text-xs font-semibold  text-gray-400 uppercase">{product.shadeLabel}</span>
                )}{" "}
                <div aria-hidden="true" className="my-2 flex items-center">
                  <span
                    className={`${
                      product.rating?.avgRating > 0 ? "" : "opacity-0"
                    } productRating border  font-semibold mb-2 px-2 flex justify-start items-center rounded `}
                  >
                    {product.rating?.avgRating}
                    <StarFilled
                      height={13}
                      width={13}
                      className="ml-1.5"
                      role="img"
                      aria-labelledby="product rating"
                      title="product rating"
                    />
                  </span>
                </div>
                <div className="flex items-center mb-1 h-3.5">
                  {product.shades?.length > 0 ? (
                    <>
                      {product.shades.slice(0, 2).map((shade: any, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} className="relative mr-1">
                          {index === 0 && <div className="h-2 w-2 rounded-full bg-white absolute m-auto inset-x-0 top-3.5" />}
                          <img src={shade.shadeImage} alt={shade.shadeLabel} className="w-7 h-7 shadesImg rounded" />
                        </div>
                      ))}
                      {product.shadeCount > 2 && (
                        <span className="text-sm  productShadesLabel ml-1 mt-1 uppercase">
                          +{product.shadeCount - 2}&nbsp;
                          {product.shadeCount - 2 === 1 ? t("shade") : t("shades") || "shades"}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm productShadesLabel uppercase">
                      {!product.shadeLabel && product.shadeLabel?.trim() === "" ? product?.subCategory : product.shadeLabel}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center justify-start text-2xl pt-4" style={{ fontSize: "16px" }}>
                    <span className="offerPrice mr-2 font-bold">{formatPrice(product.offerPrice, true)}</span>
                    {product.offerPrice < product.price && (
                      <del className="actualPrice ml-1  opacity-50">{formatPrice(product.price, true)}</del>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <div className="my-1 absolute right-4 bottom-3">
              <button
                type="button"
                disabled={DISABLED_CTA}
                onClick={e => addToBag(product, e)}
                className="p-2 rounded text- tracking-wider font-bold uppercase bg-ctaImg text-white text-sm w-32"
              >
                {product.productMeta.isPreOrder && t("preOrderCheckout")}
                {!product.productMeta.isPreOrder && (product.inStock ? t("addToBag") : t("notifyMe"))}

                {DISABLED_CTA && <LoadSpinner className="w-6 absolute inset-0 m-auto" />}
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BlogInStoryProducts;
