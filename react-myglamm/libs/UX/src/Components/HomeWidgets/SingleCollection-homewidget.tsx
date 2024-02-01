import * as React from "react";
import Link from "next/link";
import { GiForwardIco } from "@libComponents/GlammIcons";

import { SHOP } from "@libConstants/SHOP.constant";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";
import useTranslation from "@libHooks/useTranslation";
import WidgetLabel from "./WidgetLabel";
import { formatPrice } from "@libUtils/format/formatPrice";
import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

const SingleProductCard = ({ product, icid, productPosition }: any) => {
  const { assets } = product;

  const Index = (i: any) => i.type === "image";

  return (
    <div className="py-1">
      <Link
        href={
          !icid
            ? `${product.urlManager.url}`
            : `${product.urlManager.url}?icid=${icid}_${product.cms[0]?.content.name.toLowerCase()}_${productPosition}`
        }
        prefetch={false}
        className="w-full"
        aria-label={product.cms[0]?.content.name}
      >
        <ImageComponent
          className="flex justify-center my-2 pt-2 mx-auto"
          style={{
            width: "100%",
            padding: "17px 58px 12px",
            minHeight: "100px",
          }}
          alt={product.cms[0]?.content.name}
          src={assets[assets.findIndex(Index)]?.imageUrl["400x400"]}
        />
        <div className="px-2">
          <h2 className="text-base text-black font-bold" style={{ color: "#212529" }}>
            {product.cms[0]?.content.name}
          </h2>
          <p className="text-xs font-light my-1" style={{ color: "#212529" }}>
            {product.cms[0]?.content.subtitle}
          </p>
        </div>
        <div className="flex items-center px-2 mt-4">
          {product.offerPrice < product.price ? (
            <div className="flex">
              <h2 className="text-lg  font-bold" style={{ color: "#212529" }}>
                {formatPrice(product.offerPrice, true)}
              </h2>
              <h2 className="text-sm pl-1 text-gray-600 line-through" style={{ marginTop: "4px" }}>
                {formatPrice(product.price, true)}
              </h2>
            </div>
          ) : (
            <h2 className="text-lg font-bold" style={{ color: "#212529" }}>
              {formatPrice(product.price, true)}
            </h2>
          )}
        </div>
      </Link>
    </div>
  );
};

function SingleCollection({ item, icid }: any) {
  const { t } = useTranslation();

  const onShareClick = () => {
    CONFIG_REDUCER.shareModalConfig = {
      shareUrl: item?.commonDetails?.descriptionData[0]?.value[0]?.urlShortner?.shortUrl,
      productName: item?.commonDetails?.descriptionData[0]?.value[0]?.cms[0]?.content?.name,
      slug: item?.commonDetails?.descriptionData[0]?.value[0]?.urlShortner?.slug,
      module: "product",
    };
  };

  const data = Object.values(item.commonDetails.descriptionData[0].relationalData.products);

  return (
    <ErrorBoundary>
      <section className="SingleCollection mt-5 mb-1 px-3" role="banner">
        <WidgetLabel title={item.commonDetails.title} />

        {data.map((product: any, index: any) => (
          <SingleProductCard key={product.id} product={product} icid={icid} productPosition={index + 1} />
        ))}

        {SHOP.ENABLE_SHARE && (
          <div className="flex p-4">
            <button
              type="button"
              onClick={onShareClick}
              className="flex items-center justify-center w-full text-center p-3 font-bold"
              style={{
                border: "1px solid #000",
                borderRadius: "2px",
                letterSpacing: ".8px",
              }}
            >
              <span className="justify-center text-sm">
                {t("shareEarn")?.toUpperCase()} {t("CUSTOMER_PREF_GLAMMPOINTS")?.toUpperCase()}
              </span>
              <GiForwardIco
                className="absolute"
                style={{ right: "25px" }}
                width="27"
                height="27"
                viewBox="0 -50 1000 1000"
                role="img"
                aria-labelledby="share & earn"
              />
            </button>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}

export default SingleCollection;
