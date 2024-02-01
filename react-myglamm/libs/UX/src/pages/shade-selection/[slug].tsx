import React, { useState, ReactElement } from "react";
import dynamic from "next/dynamic";

import LazyHydrate from "react-lazy-hydration";

import ErrorComponent from "@libPages/_error";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";

import { logURI } from "@libUtils/debug";

import PDPTryon from "@libComponents/PDP/PDPTryon";
import SnapCarousel from "@libComponents/PDP/SnapCarousel";
import PDPRatingsandShare from "@libComponents/PDP/PDPRatingsandShare";
import ShadePalette from "@libComponents/PDP/shadeSelection/ShadePalette";
import PriceCard from "@libComponents/CardComponents/PriceCard/PriceCard";
import CustomLayout from "@libLayouts/CustomLayout";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const FlashSaleTicker = dynamic(() => import(/* webpackChunkName: "FlashSaleTickerChunk" */ "@libComponents/FlashSaleTicker"), {
  ssr: false,
});

const Skeleton = () => <div className="h-[1800px] w-full bg-white" />;

function ShadeSelection(props: any) {
  const {
    productRes,
    categoryDetails,
    Shades,
    Ratings,
    FreeProducts,
    Reviews,
    errorCode,
    carouselSlides,
    flashSaleWidgetData,
    icid,
    videoSlides,
    priceCardStyle,
    ogImage,
    videoStyle,
    colorFamily,
    discountDetails,
  } = props;
  const [childProducts, setChildProducts] = useState<Array<any>>([]);
  const freeProductsListIds = discountDetails?.[productRes?.data?.data[0]?.id]?.discountValue?.freeProducts?.ids;

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  if (!productRes?.data?.data) {
    return null;
  }

  const carouselStyle = `
  .carousel {
    height: 190px;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
   
  }
  .carousel__item {
    height: 190px;
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  .carousel__dots{
    position:absolute;
    bottom:-15px;
  }
  .videoCarouselHeight{
    height:190px;
  }
  
`;
  return (
    <React.Fragment>
      <main className=" ShadeSelection bg-white flex flex-col" style={{ height: "calc(100vh - 3rem)" }}>
        <div className="relative">
          {flashSaleWidgetData && <FlashSaleTicker item={flashSaleWidgetData} source="product" />}

          <LazyHydrate whenIdle>
            <SnapCarousel
              title={productRes.data.data[0].cms[0]?.content?.name}
              carouselSlides={carouselSlides}
              categoryDetails={categoryDetails}
              videoStyle={videoStyle}
              carouselStyle={carouselStyle}
              dimension={190}
            />
          </LazyHydrate>
        </div>

        <LazyHydrate whenIdle>
          <div className="relative">
            <PDPTryon product={productRes?.data?.data[0]} shadeSelection />
            <PDPRatingsandShare product={{ ...(productRes?.data?.data?.[0] || {}), ratings: Ratings }} showShare={false} />
          </div>
        </LazyHydrate>

        {colorFamily.data.length === 0 && (
          <div className="flex p-4 items-center  justify-between w-full">
            <h1 className="font-semibold leading-tight capitalize text-sm">{productRes.data.data[0].cms[0]?.content?.name}</h1>
            <p className="text-gray-400 text-sm leading-none">{Array.isArray(Shades) && Shades.length}&nbsp;Shades</p>
          </div>
        )}

        {productRes.data.data[0]?.type !== 2 && (
          <LazyHydrate whenIdle>
            <ShadePalette
              productTag={productRes.data.data[0]?.productTag}
              alignShadesLeft={true}
              shadeLabel={productRes.data.data[0]?.cms[0]?.attributes?.shadeLabel}
              currentProductId={productRes.data.data[0]?.id}
              shades={Shades}
              colorFamily={colorFamily}
            />
          </LazyHydrate>
        )}
        {/* </div> */}

        <LazyHydrate whenIdle>
          <PriceCard
            priceCardStyle={priceCardStyle}
            product={productRes.data.data[0]}
            preOrder={productRes.data.data[0]?.productMeta}
            freeProduct={FreeProducts}
            relationalData={productRes.data.relationalData}
            childProducts={childProducts}
            flashSaleWidgetData={flashSaleWidgetData}
            freeProductsListIds={freeProductsListIds}
          />
        </LazyHydrate>
      </main>
    </React.Fragment>
  );
}

ShadeSelection.getLayout = (page: ReactElement) => (
  <CustomLayout header="selectShade" fallback="Select Shade">
    {page}
  </CustomLayout>
);

ShadeSelection.whyDidYouRender = true;
ShadeSelection.getInitialProps = async (ctx: any) => {
  const getCategoryDetails = (productResponse: any) => {
    try {
      const child = productResponse?.data?.data[0]?.categories.filter((category: any) => category.type === "child");

      const subChild = productResponse?.data?.data[0]?.categories.filter((category: any) => category.type === "subChild");

      const ddlchildCategory = productResponse?.data?.relationalData?.categories[child[0]?.id]?.cms[0]?.content?.name;
      const ddlSubChildCategory = productResponse?.data?.relationalData?.categories[subChild[0]?.id]?.cms[0]?.content?.name;
      return {
        child,
        subChild,
        ddlChildCategory: ddlchildCategory,
        ddlSubChildCategory,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  // log URI for help with debugging using cloudwatch logs
  // not able to get source-maps to work with console.log on the server
  // ideally we should we using something like Sentry
  // or use newrelic to log with proper tracebacks etc.
  try {
    const api = new ProductAPI();
    const widgetApi = new WidgetAPI();

    const { slug } = ctx.query;

    const where = {
      "urlManager.url": `/product/${slug.split("?")[0]}`,
    };

    const include = [
      "id",
      "price",
      "sku",
      "brand",
      "categories",
      "products",
      "productMeta",
      "offerPrice",
      "productTag",
      "type",
      "urlManager",
      "cms",
      "assets",
      "urlShortner",
      "inStock",
    ];
    const productRes = await api.getProduct(where, 0, include);

    const aggregateShadeResponse = await api.getAggregateShades(encodeURIComponent(productRes.data.data.data[0]?.productTag));

    if (productRes.data.data.count === 0) {
      logURI(ctx.asPath);

      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }

      return { errorCode: 404 };
    }

    const shadeWhere = {
      id: { nin: [productRes.data.data.data[0]?.id] },
      productTag: encodeURIComponent(productRes.data.data.data[0]?.productTag),
      "productMeta.displaySiteWide": true,
    };
    let fPwhere = {};
    const getFlashSaleOfferWhere = {
      where: {
        slugOrId: "mobile-site-flash-sale-stickers",
        name: "products",
        items: productRes.data.data.data[0]?.id,
      },
    };

    const freeProductType =
      productRes?.data.data?.discountDetails?.[productRes.data.data.data[0]?.id].discountValue?.freeProducts?.type;

    if (productRes?.data.data.discountDetails && freeProductType) {
      switch (freeProductType) {
        case "productCategory": {
          fPwhere = {
            "categories.id": {
              inq: [productRes.data.data.discountDetails.categoryId],
            },
            inStock: true,
          };
          break;
        }

        case "products": {
          fPwhere = {
            id: {
              inq: productRes?.data.data.discountDetails[productRes.data.data.data[0]?.id]?.discountValue?.freeProducts?.ids,
            },
            inStock: true,
          };
          break;
        }

        case "productTag": {
          fPwhere = {
            productTag: {
              inq: productRes?.data.data.discountDetails[productRes.data.data.data[0]?.id]?.discountValue?.freeProducts?.ids,
            },
            inStock: true,
          };
          break;
        }
        default: {
          console.info(`No Free Product`);
        }
      }
    }

    const promises = [
      api.getProductShades("IND", shadeWhere, 0, include),
      api.getAvgRatingsByProductTag(encodeURIComponent(productRes.data.data.data[0].productTag)),
    ];
    if (productRes?.data.data.discountDetails) {
      promises.push(api.getProductShades("IND", fPwhere, 0, include));
    }
    const [shadeRes, ratingsData, freeProduct] = await Promise.all(promises);

    const Shades = [productRes.data.data.data[0], ...shadeRes.data.data.data];

    const Ratings = ratingsData.data.data;
    const FreeProducts = freeProduct?.data || null;

    const flashSaleWidget = (await widgetApi.getWidgets(getFlashSaleOfferWhere, 5, 0).catch(err => {
      console.log(err);
    })) || { data: {} };
    const flashSaleWidgetData = flashSaleWidget?.data?.data?.data?.widget?.[0];

    const assets = productRes.data.data.data[0].assets;
    const carouselImages = assets
      .filter((a: any) => a.type === "image")
      .map((item: any) => ({
        type: "image",
        item,
        src: item?.imageUrl?.["200x200"] || DEFAULT_IMG_PATH(),
      }));

    const carouselVideos = assets.filter((a: any) => a.type === "video").map((item: any) => ({ type: "video", item }));

    const discountDetails = productRes?.data.data?.discountDetails;

    // insert videos after the first slide
    const carouselSlides = [...carouselImages];
    if (carouselVideos.length) {
      carouselSlides.splice(1, 0, carouselVideos[0]);
    }
    const videoSlides = productRes.data.data.data[0].assets.filter((x: any) => x.type === "video");

    const priceCardStyle = {
      boxShadow: "0 -4px 4px 0 rgba(0,0,0,.07)",
    } as React.CSSProperties;

    const videoStyle = {
      backgroundPosition: " 0 -285px",
      backgroundImage: `url(${getStaticUrl("/global/images/ico-pdp-sprite.png")})`,
      backgroundRepeat: "no-repeat",
      height: "35px",
      width: "35px",
      position: "absolute",
      top: "45%",
    } as React.CSSProperties;

    const childId = productRes.data.data.data[0].categories.find((category: any) => category.type === "child")?.id;
    const subChildId = productRes.data.data.data[0].categories.find((category: any) => category.type === "subChild")?.id;

    const categories = {
      childId,
      subChildId,
      childCategoryName: productRes.data.data.relationalData?.categories[childId]?.cms[0]?.content?.name,
      subChildCategoryName: productRes.data.data.relationalData?.categories[subChildId]?.cms[0]?.content?.name,
    };

    return {
      productRes: productRes.data,
      categoryDetails: categories,
      Shades,
      Ratings,
      videoSlides,
      FreeProducts,
      carouselSlides,
      flashSaleWidgetData,
      icid: "product_product description",
      priceCardStyle,
      colorFamily: aggregateShadeResponse.data.data,
      videoStyle,
      discountDetails,
    };
  } catch (error) {
    logURI(ctx.asPath);
    console.error(error);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default ShadeSelection;
