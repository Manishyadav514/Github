import * as React from "react";
import Link from "next/link";
import Ripples from "@libUtils/Ripples";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import { formatPrice } from "@libUtils/format/formatPrice";

const SingleProduct = ({ item, icid }: any) => {
  const product = item.commonDetails.descriptionData[0].value[0];
  const { t } = useTranslation();

  if (!product) {
    return null;
  }
  const { assets } = product;

  const Index = (i: any) => i.type === "image";

  return (
    <ErrorBoundary>
      <section className="SingleProductWidget my-5 px-3" role="banner">
        <WidgetLabel title={item.commonDetails.title} />
        <Ripples>
          <Link
            href={
              !icid
                ? `${product.urlManager.url}`
                : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_1`
            }
            prefetch={false}
            className="w-full"
            aria-label={product.cms[0]?.content.name}
          >
            <ImageComponent
              className="flex justify-center p-8"
              alt={product.cms[0]?.content.name}
              src={assets[assets.findIndex(Index)]?.imageUrl["400x400"]}
            />
            <div className="px-6">
              <h2 className="text-base text-black font-bold text-center mb-2" style={{ color: "#212529" }}>
                {product.cms[0]?.content.name}
              </h2>
              <p className="text-xs font-light text-center opacity-75" style={{ color: "#212529" }}>
                {product.cms[0]?.content.subtitle}
              </p>
            </div>
            <div className="flex justify-center items-center text-center">
              {product.offerPrice < product.price ? (
                <div className="flex">
                  <h2 className="text-lg text-center font-bold" style={{ color: "#212529" }}>
                    {formatPrice(product.offerPrice, true)}
                  </h2>
                  <h2 className="text-sm pl-2 text-gray-600 pt-1 line-through">{formatPrice(product.price, true)}</h2>
                </div>
              ) : (
                <h2 className="text-lg font-bold" style={{ color: "#212529" }}>
                  {formatPrice(product.offerPrice, true)}
                </h2>
              )}
            </div>
          </Link>
        </Ripples>
        <div className="flex justify-center items-center my-4">
          <Ripples>
            <Link
              href={`${product.urlManager.url}`}
              prefetch={false}
              className="text-center text-sm tracking-wider text-gray-900 border border-black font-semibold outline-none px-4 py-1"
              style={{
                width: "159px",
                borderRadius: "2px",
                boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.19)",
              }}
              aria-label={t("shopNow")?.toUpperCase()}
            >
              {t("shopNow")?.toUpperCase()}
            </Link>
          </Ripples>
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default SingleProduct;
