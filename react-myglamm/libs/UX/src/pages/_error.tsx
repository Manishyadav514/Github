import React, { useState, useEffect } from "react";

import Link from "next/link";

import { SHOP } from "@libConstants/SHOP.constant";
import { SLUG } from "@libConstants/Slug.constant";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import useTranslation from "@libHooks/useTranslation";

import NotFound from "../../public/svg/notFound.svg";
import { formatPrice } from "@libUtils/format/formatPrice";
import { NextPageContext } from "next";

interface ErrorComponentProps {
  statusCode?: number;
}

function ErrorComponent(props: ErrorComponentProps) {
  const { statusCode = 404 } = props;
  const { t } = useTranslation();

  const [recommendedProducts, setrecommendedProducts] = useState<any>();

  useEffect(() => {
    recomendedProd();
    console.error({ message: "bad girl", statusCode, location: window.location.href });
  }, []);

  const recomendedProd = async () => {
    const widgetApi = new WidgetAPI();
    const widgetResponse = await widgetApi.getWidgets({
      where: {
        slugOrId: SLUG().NO_SEARCH_EN,
      },
    });
    if (widgetResponse?.data?.data?.data?.widget?.[1]?.commonDetails?.descriptionData[0].relationalData?.products) {
      setrecommendedProducts(
        Object.values(widgetResponse?.data.data.data.widget[1].commonDetails.descriptionData[0].relationalData?.products)
      );
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {statusCode === 404 ? (
        <div style={{ textAlign: "center", margin: "40px 0 0" }}>
          <div className="flex justify-center">
            <NotFound role="img" aria-labelledby="not found" />
          </div>
          <h1 className="text-18 font-semibold" style={{ margin: " 24px 0 13px" }}>
            {t("sorry")}
          </h1>
          <p style={{ fontSize: "14px", margin: " 0 0 17px", opacity: "0.7" }}>{t("notFoundText")}</p>
          <div style={{ textAlign: "center" }}>
            <Link href="/" prefetch={false} legacyBehavior>
              <a
                className="bg-ctaImg rounded"
                style={{
                  padding: "8px 35px",
                  display: "inline-block",
                  color: "#fff",
                  fontSize: "14px",
                }}
                aria-label={t("shopNow")}
              >
                {t("shopNow")}
              </a>
            </Link>
          </div>
          {Array.isArray(recommendedProducts) && recommendedProducts.length > 0 && (
            <div className="no-results-page" style={{ marginTop: "0", height: "inherit" }}>
              <div className="recommended-products" style={{ margin: "50px 0 20px" }}>
                <h6 style={{ margin: "10px 10px", textAlign: "left" }}>Recommended Products</h6>
                <div
                  className="overflow-x-auto flex list-none"
                  dir="ltr"
                  style={{
                    scrollSnapType: "x mandatory",
                  }}
                >
                  {recommendedProducts.map((product: any) => (
                    <Link href={product.urlManager.url} key={product.id} legacyBehavior>
                      <a aria-label={product.cms[0]?.content.name}>
                        <div className="product">
                          <ImageComponent className="w-full" src={product.assets[0].url} alt="product" />
                          <h2>{product.cms[0]?.content.name}</h2>
                          <h3>{product.cms[0]?.content.subtitle}</h3>
                          <div className="price-wrapper">
                            <span className="new-price">{formatPrice(product.offerPrice, true)}</span>

                            <span className="old-price">{formatPrice(product.offerPrice, true)}</span>
                          </div>
                        </div>
                      </a>
                    </Link>
                  ))}
                </div>
                <style jsx>
                  {`
                    .recommended-products {
                      margin: 40px 0;
                      padding: 0 15px;
                    }
                    .recommended-products h6 {
                      font-size: 14px;
                      font-weight: bold;
                      color: #000;
                      margin: 10px 0;
                    }
                    .recommended-products .product {
                      width: 132px !important;
                      height: 186px !important;
                      border-radius: 4px;
                      box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.12);
                      background-color: #fff;
                      padding: 15px;
                      margin: 10px;
                    }
                    .recommended-products .product img {
                      width: 80px;
                      height: 80px;
                      margin-left: 50%;
                      transform: translateX(-50%);
                    }
                    .recommended-products .product h2 {
                      font-size: 12px;
                      font-weight: bold;
                      color: #000;
                      margin-bottom: 5px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                    .recommended-products .product h3 {
                      font-size: 11px;
                      line-height: 1.02;
                      color: #494949;
                      width: 102px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      margin-bottom: 5px;
                    }
                    .recommended-products .product h4 {
                      font-size: 10px;
                      font-weight: bold;
                      color: #949494;
                    }
                    .recommended-products .product .price-wrapper .new-price {
                      font-size: 12.8px;
                      color: #000;
                      margin-right: 3px;
                    }
                    .recommended-products .product .price-wrapper .old-price {
                      font-size: 11px;
                      color: #9b9b9b;
                      text-decoration: line-through;
                    }
                  `}
                </style>
              </div>
            </div>
          )}

          {SHOP.IS_MYGLAMM && (
            <div className="flex justify-center">
              <Link href="/refer" legacyBehavior>
                <a aria-label="refer & earn">
                  <ImageComponent
                    alt="error-400"
                    src="https://files.myglamm.com/site-images/original/refer-a-friend-for-free-makeup.png"
                  />
                </a>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center" style={{ margin: "50px 0" }}>
          <div className="flex justify-center">
            <ImageComponent alt="error-400" src="https://files.myglamm.com/images/content/400.png" />
          </div>
          <h1 style={{ fontSize: "32px", margin: "24px 0 13px" }}>
            <strong>{t("Bad Request")}</strong>
          </h1>
          <p style={{ fontSize: "19px", margin: "0 0 40px" }}>
            The page you are looking for <br />
            does not seem to exist.
          </p>
          <span>
            {t("error")?.toUpperCase()}: {statusCode}
          </span>
          <div className="text-center">
            <Link href="/" legacyBehavior>
              <a className="text-sm inline-block text-white rounded-sm py-3 px-14 bg-ctaImg" aria-label={t("goToShop")}>
                {t("goToShop")}
              </a>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

ErrorComponent.getInitialProps = (context: NextPageContext) => {
  if (context.res) {
    console.error("_error:", context.res.statusCode, context?.req?.url);
  }
  if (context.err) {
    console.error("_error", JSON.stringify(context.err));
  }
  const statusCode = context.res ? context.res.statusCode : context.err ? context.err.statusCode : 404;
  return { statusCode };
};

export default ErrorComponent;
