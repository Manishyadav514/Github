import React, { useState, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Head from "next/head";

import { useSelector } from "@libHooks/useValtioSelector";
import InfiniteScroll from "react-infinite-scroll-component";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import ImageComponent from "@libComponents/Common/LazyLoadImage";

import useTranslation from "@libHooks/useTranslation";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { ADOBE } from "@libConstants/Analytics.constant";

import Adobe from "@libUtils/analytics/adobe";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PDPFreeProductModal from "@libComponents/PopupModal/PDPFreeProductModal";

import CopyCouponCode from "../Components/CopyCoupon";

import CustomLayout from "@libLayouts/CustomLayout";

import { ValtioStore } from "@typesLib/ValtioStore";

import NoOfferLogo from "../../public/svg/no-offer.svg";
import { getClientQueryParam } from "@libUtils/_apputils";

const OfferMiniPDP = dynamic(() => import(/* webpackChunkName: "MiniPDPModal" */ "@libComponents/PopupModal/OfferMiniPDP"), {
  ssr: false,
});

function Offers() {
  const { t } = useTranslation();
  const router = useRouter();

  const widgetApi = new WidgetAPI();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const [hasMore, setHasMore] = useState(true);
  const [offerCats, setOfferCats] = useState<any>();
  const [selectedCat, setSelectedCat] = useState<any>();
  const [offersData, setOffersData] = useState<any>(undefined);

  /* States for Storing selected Offer's Id respecively */
  // const [showCopied, setShowCopied] = useState<string | null>();
  const [showDescription, setShowDescription] = useState<string | null>();
  // const [offerArray, setOfferArray] = useState<any[]>([]);
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [selectedWeburl, setSelectedWeburl] = useState<any>();
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [freeProducts, setFreeProducts] = useState<any>();
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const [selectedProductTag, setSelectedProductTag] = useState<any>();
  const [detailBtnText, setDetailBtnText] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    widgetApi.getOfferCategories().then(cat => {
      const categories = cat.data.data.data;

      const all = {
        cms: [
          {
            content: { name: t("all") },
          },
        ],
      };
      const forYou = {
        cms: [
          {
            content: { name: t("forYou") },
          },
        ],
      };
      if (localStorage.getItem("memberId")) {
        categories.unshift(forYou);
      }

      categories.unshift(all);
      setOfferCats(categories);
      if (getClientQueryParam("category") === "for_you") {
        setSelectedCat(forYou);
        setLoader(true);
        widgetApi.getOfferDiscount(localStorage.getItem("memberId"), 0).then(discount => {
          setLoader(false);
          setOffersData(discount.data.data.data);
        });
      } else {
        setSelectedCat(categories[0]);
        setLoader(true);

        widgetApi.getOffers(categories[0].id, 0).then(offer => {
          setLoader(false);
          setOffersData(offer.data.data.data);
        });
      }
    });

    adobeEvent();
  }, []);

  /**
   * Making an API Call for Change in Offer Category or
   * Get More Offers if Available for that Particular Category
   * @param category {any}
   * @param catChange {boolean}
   */
  const fetchOffers = (category: any, catChange?: boolean) => {
    setSelectedCat(category);
    setLoader(true);
    if (category && category.cms[0].content.name !== "For You") {
      widgetApi.getOffers(category.id, catChange ? 0 : offersData.length).then(offer => {
        if (offer.data.data.data.length) {
          setLoader(false);
          if (catChange) {
            setHasMore(true);
            setOffersData(offer.data.data.data);
          } else {
            setOffersData([...offersData, ...offer.data.data.data]);
          }
        } else {
          setLoader(false);
          setHasMore(false);
        }
      });
    } else if (category && category.cms[0].content.name === "For You" && localStorage.getItem("memberId")) {
      widgetApi.getOfferDiscount(localStorage.getItem("memberId"), catChange ? 0 : offersData.length).then(discount => {
        if (discount.data.data.data) {
          setLoader(false);
          if (catChange) {
            setHasMore(true);
            setOffersData(discount.data.data.data);
          } else {
            setOffersData([...offersData, ...discount.data.data.data]);
          }
        } else {
          setLoader(false);
          setHasMore(false);
        }
      });
    }
  };

  /**
   * @description this function trigger adobe page load event and click event
   * @param ctaName ctaName can be 'Shop Now' or 'Copy Code'
   */
  const adobeEvent = (ctaName?: any, couponCode?: string) => {
    const pageName = "Offers Listing";
    const pageType = "offers section";
    let commonObj = {};
    let offerObj = {};
    if (ctaName) {
      commonObj = {
        linkName: `web|${pageName}`,
        linkPageName: `web|${pageName}`,
        assetType: pageType,
        newAssetType: pageType,
        newLinkPageName: pageName,
        subSection: pageType,
        pageLocation: pageName,
        platform: ADOBE.PLATFORM,
        ctaName,
      };
      offerObj = {
        couponCode: couponCode || "",
      };
    } else {
      commonObj = {
        pageName: "web|offers listing",
        newPageName: pageName,
        subSection: pageName,
        assetType: pageType,
        newAssetType: pageType,
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      };
    }

    (window as any).digitalData = {
      common: commonObj,
      user: Adobe.getUserDetails(userProfile),
      offer: offerObj,
    };
    if (ctaName) {
      Adobe.Click();
    } else {
      Adobe.PageLoad();
    }
  };
  const onMiniPDPClose = (productSelected: any, freeProds: any) => {
    setShowMiniPDPModal(false);
    if (freeProds) {
      setFreeProducts(freeProds);
      setSelectedProduct(productSelected);
      setShowPDPFreeProductModal(true);
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>{t("offers") || "Offers"}</title>
      </Head>

      <div className="w-full bg-themeGray">
        <div className="py-2 px-1.5">
          <div className="w-full sticky flex pl-3 py-3 overflow-x-auto flex-no-wrap z-20 bg-themeGray top-12">
            {Array.isArray(offerCats)
              ? offerCats.map((categories: any) => {
                  const { name } = categories?.cms[0]?.content || {};
                  return (
                    <button
                      type="button"
                      key={name}
                      onClick={() => fetchOffers(categories, true)}
                      className={`flex-sliderChild px-4 text-s mr-3 rounded-full h-8 text-center border border-color1 ${
                        selectedCat?.cms[0]?.content.name === name ? "bg-color1 text-white" : "bg-white text-color1"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })
              : null}
          </div>
          <InfiniteScroll
            dataLength={offersData?.length || 0}
            next={() => fetchOffers(selectedCat)}
            hasMore={hasMore}
            loader
            endMessage={
              offersData?.length > 0 && (
                <p className="text-center">
                  <b>{t("yayYouHaveSeenItAll")}</b>
                </p>
              )
            }
          >
            {offersData?.length > 0 &&
              offersData.map((offer: any, index: any) => {
                const content = offer?.cms?.length && offer.cms[0]?.content;
                const { couponCode, id, endDate, neverEnd } = offer || {};
                const image = offer?.assets?.find((x: any) => x.type === "image");
                const showMiniPDPFlag = offer?.cta?.web?.includes("/product/");

                return (
                  <div key={offer?.id} className="mb-2 mx-2 bg-white rounded-lg p-4 shadow">
                    {/* <div className="row"> */}
                    <div className="pb-2 w-full text-lg font-semibold text-black text-center flex justify-center">
                      {content?.name || offer?.couponName}
                    </div>
                    <div className="w-full flex justify-center">
                      <ImageComponent
                        className="flex justify-center items-center mb-2"
                        style={{
                          maxWidth: "auto",
                          maxHeight: "150px",
                        }}
                        src={image?.url || offer.assets?.[0]?.imageUrl?.["400x400"]}
                        alt={image?.properties?.altText || image?.name}
                      />
                    </div>
                    {!neverEnd && (
                      <div className="pb-2 font-semibold text-xxs text-gray-300  expiryDate">
                        {t("expireIn")}&nbsp;
                        {(endDate && formatDistanceToNow(new Date(endDate))) || formatDistanceToNow(new Date(offer.expiryDate))}
                      </div>
                    )}
                    {/* Offer Details Section */}
                    <p className="text-sm text-black break-all pb-2">{content?.shortDescription || offer?.couponDescription}</p>
                    <div className="">
                      <div className="flex justify-between items-center">
                        <button
                          className={`${
                            !content?.longDescription ? "opacity-0" : ""
                          } h-4 w-21 border-0 font-semibold text-xxs text-red-400 bg-transparent uppercase `}
                          onClick={() => {
                            setDetailBtnText(!detailBtnText);
                            if (detailBtnText) {
                              setShowDescription(id);
                            } else {
                              setShowDescription(null);
                            }
                          }}
                          type="button"
                        >
                          {!detailBtnText && showDescription === id
                            ? `${t("lessDetails") || "Less Details -"} `
                            : `${t("moreDetails") || "More Details +"} `}
                        </button>
                        <div className="">
                          {offer.cta ? (
                            <CopyCouponCode
                              index={index}
                              couponCode={offer.couponCode}
                              apiShowMiniPDPFlag={showMiniPDPFlag}
                              id={offer.id}
                              webURL={offer?.cta?.web}
                              t={t}
                              showMiniPDP={(data: any | { productTag?: string; webURL: string }) => {
                                const slug = data?.webURL.substring(
                                  data?.webURL.indexOf("/product"),
                                  data?.webURL.indexOf("?")
                                );
                                if (slug) setSelectedWeburl(slug);
                                else setSelectedWeburl(data.webURL);

                                setShowMiniPDPModal(true);
                              }}
                            />
                          ) : (
                            <CopyCouponCode
                              index={index}
                              couponCode={couponCode}
                              apiShowMiniPDPFlag={offer?.showMiniPDP}
                              id={id}
                              webURL={offer?.webURL}
                              productTag={offer?.productTag}
                              adobeEvent={adobeEvent}
                              t={t}
                              showMiniPDP={(data: any | { productTag?: string; webURL: string }) => {
                                setSelectedProductTag(data.productTag);
                                setSelectedWeburl(data.webURL);
                                setShowMiniPDPModal(true);
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* </div> */}

                    {/* Offer Description Section */}
                    {showDescription && showDescription === id && (
                      <div className="text-xs pt-2">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: content?.longDescription,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            {loader && !offersData && <LoadSpinner className=" mt-44 w-6 m-auto inset-0" />}
            {!loader && offersData?.length === 0 && (
              <div className="p-7 mt-7 text-center">
                <div className="flex justify-center items-center">
                  <NoOfferLogo />
                </div>
                <div className="text-s font-semibold mt-7">{t("uhoh") || "Uh-oh"}</div>
                <div
                  className="text-xs mt-4"
                  dangerouslySetInnerHTML={{ __html: t("noOffersAvailable")?.replace("\n", "<br/>") }}
                />
              </div>
            )}
          </InfiniteScroll>
        </div>
      </div>

      {showMiniPDPModal && (
        <OfferMiniPDP
          show={showMiniPDPModal}
          onRequestClose={onMiniPDPClose}
          slug={selectedWeburl}
          productTag={selectedProductTag}
          t={t}
        />
      )}
      {showPDPFreeProductModal && (
        <PDPFreeProductModal
          show={showPDPFreeProductModal}
          hide={() => setShowPDPFreeProductModal(false)}
          freeProduct={freeProducts}
          product={selectedProduct}
          t={t}
        />
      )}
    </React.Fragment>
  );
}

Offers.getLayout = (page: ReactElement) => (
  <CustomLayout header="offers" fallback="offers" showCart>
    {page}
  </CustomLayout>
);

export default Offers;
