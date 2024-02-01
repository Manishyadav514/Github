import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import useTranslation from "@libHooks/useTranslation";

import PDPLabel from "@libComponents/PDP/PDPLabel";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import WidgetLabel from "./WidgetLabel";
import clsx from "clsx";

const PhotoSlurpModal = dynamic(
  () => import(/* webpackChunkName: "PhotoSlurpModal" */ "@libComponents/PopupModal/PhotoSlurpModal"),
  { ssr: false }
);

interface slurpWidget {
  item: any;
  productSku?: string;
  isNewDesign?: boolean;
}

const PhotoSlurp = ({ item, productSku, isNewDesign = false }: slurpWidget) => {
  const router = useRouter();
  const { t } = useTranslation();

  const isProductPage = router.asPath.includes("/product/");

  const [allPhotoSlurpInfo, setAllPhotoSlurpInfo] = React.useState({
    page: 1,
    isLoading: false,
    hasMore: true,
    data: [],
  });
  const defaultActiveSlurpData = {
    show: false,
    activeSlurpIndex: undefined,
  };
  const [activeSlurpData, setActiveSlurpData] = useState(defaultActiveSlurpData);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      getPhotoSlurp();
    });
  }, [productSku]);


  /* Opening PhotoSlurp Detail Modal based on Click */
  const handleClick = (index: number) => {
    const activeSlurpDataTemp = JSON.parse(JSON.stringify(activeSlurpData));
    activeSlurpDataTemp.show = true;
    activeSlurpDataTemp.activeSlurpIndex = index;
    setActiveSlurpData(activeSlurpDataTemp);
  };

  /* Get Call for PhotoSlurp and pagination */
  const getPhotoSlurp = () => {
    if (allPhotoSlurpInfo.hasMore) {
      const allPhotoSlurpInfoTemp = JSON.parse(JSON.stringify(allPhotoSlurpInfo));
      allPhotoSlurpInfoTemp.isLoading = false;
      setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
      /* Passing Product SKU for getting photoslurp at Product Level(PDP) */
      let { widgetMeta } = item.meta || {};
      if (productSku) {
        // in v2 on pdp also adding sku in params is optional
        if (widgetMeta.includes("type=v2")) {
          widgetMeta = widgetMeta.replace("{product_id}", productSku);
        } else {
          widgetMeta = `${widgetMeta}&product_id=${productSku}`;
        }
      }

      /* Evaluating the limit from Meta for Show More Logic */
      const pageLimit = parseInt(new URLSearchParams(widgetMeta).get("page_limit") || "9", 10);

      const widgetApi = new WidgetAPI();
      widgetApi
        .getPhotoSlurp(widgetMeta, allPhotoSlurpInfo.page)
        .then(({ data: res }) => {
          if (res.data?.results?.length) {
            const allPhotoSlurpInfoTemp: any = { ...allPhotoSlurpInfo };
            if (isNewDesign) {
              allPhotoSlurpInfoTemp.hasMore = false;
            }
            allPhotoSlurpInfoTemp.data = [...allPhotoSlurpInfo.data, ...res.data.results];
            allPhotoSlurpInfoTemp.page = allPhotoSlurpInfoTemp.page + 1;
            setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
          }
          if (!res.data?.results?.length || (res.data?.results?.length < pageLimit && !isNewDesign)) {
            const allPhotoSlurpInfoTemp: any = { ...allPhotoSlurpInfo };
            allPhotoSlurpInfoTemp.page = 1;
            allPhotoSlurpInfoTemp.hasMore = false;
            allPhotoSlurpInfoTemp.isLoading = false;
            setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
          }
        })
        .catch(() => {
          const allPhotoSlurpInfoTemp = JSON.parse(JSON.stringify(allPhotoSlurpInfo));
          allPhotoSlurpInfoTemp.isLoading = false;
          setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
        });
    }
  };

  if (allPhotoSlurpInfo?.data?.length) {
    return (
      <ErrorBoundary>
        <section
          className={isNewDesign ? "PhotoSlurp-Widget py-5 bg-white border-b-4 border-themeGray" : "PhotoSlurp-Widget py-3 my-2"}
          role="banner"
        >
          {isProductPage && !isNewDesign ? (
            <PDPLabel label={item.commonDetails.title} />
          ) : isNewDesign ? (
            <p className="font-bold text-15 m-0 px-4 pb-4">
              {item.commonDetails.title || t("fromBeautyExperts") || "From Our beauty experts"}
            </p>
          ) : (
            <WidgetLabel title={item.commonDetails.title} />
          )}

          <ul
            className={clsx(
              isNewDesign ? "grid grid-flow-col overflow-x-scroll list-none mb-0.5 px-4" : "flex pl-3 list-none flex-wrap"
            )}
            dir="ltr"
            style={{
              scrollSnapType: "x mandatory",
            }}
          >
            {allPhotoSlurpInfo?.data?.map((slurp: any, index) => (
              <li
                key={slurp.id}
                role="presentation"
                className={clsx("pr-3 relative", !isNewDesign && "pb-3")}
                style={{ height: isNewDesign ? "163px" : "128px", width: isNewDesign ? "140px" : "33.3333%" }}
                onClick={() => handleClick(index)}
              >
                <ImageComponent
                  alt={slurp.title}
                  src={slurp.images?.small?.url}
                  className="rounded-md !object-cover"
                  style={{ height: isNewDesign ? "163px" : "116px", width: isNewDesign ? "140px" : "104px" }}
                />
                {!isNewDesign && (
                  <img
                    alt="Bag"
                    className="absolute bottom-5 left-2"
                    src="https://files.myglamm.com/site-images/original/vector-smart-object-copy-4.png"
                  />
                )}

                {slurp.videos?.standard?.url && (
                  <img
                    alt="Play Button"
                    className="absolute inset-0 right-2 bottom-2 m-auto w-6 h-6"
                    src={
                      isNewDesign
                        ? "https://files.myglamm.com/site-images/original/playbutton.png"
                        : "https://files.myglamm.com/site-images/original/playVideo.png"
                    }
                  />
                )}
              </li>
            ))}
          </ul>

          {allPhotoSlurpInfo.hasMore && !isNewDesign ? (
            <div className="text-center">
              <button
                type="button"
                disabled={allPhotoSlurpInfo.isLoading}
                onClick={getPhotoSlurp}
                className="font-semibold text-sm p-2 relative uppercase"
              >
                {allPhotoSlurpInfo.isLoading && <LoadSpinner className="w-6 absolute m-auto inset-0" />}
                {t("showMore")}
              </button>
            </div>
          ) : null}

          {activeSlurpData.activeSlurpIndex !== undefined && (
            <PhotoSlurpModal
              show={activeSlurpData.show}
              photoSlurpData={allPhotoSlurpInfo.data}
              activeSlurpIndex={activeSlurpData.activeSlurpIndex}
              getPhotoSlurp={getPhotoSlurp}
              hide={() => setActiveSlurpData(defaultActiveSlurpData)}
            />
          )}
        </section>
      </ErrorBoundary>
    );
  }
  return null;
};

export default React.memo(PhotoSlurp);
