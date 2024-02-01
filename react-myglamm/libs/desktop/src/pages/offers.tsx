import React, { useEffect, useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import useTranslation from "@libHooks/useTranslation";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { ADOBE } from "@libConstants/Analytics.constant";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import Adobe from "@libUtils/analytics/adobe";
import { getImage } from "@libUtils/homeUtils";
import { showSuccess } from "@libUtils/showToaster";

import CopyIcon from "../../../UX/public/svg/copycoupon.svg";
import NoOfferLogo from "../../../UX/public/svg/no-offer.svg";

const OffersPage = () => {
  const { t } = useTranslation();

  const { ref, inView } = useInView();

  const [offersData, setOffersData] = useState<any[]>();
  const [offerCats, setOfferCats] = useState<any[]>([{ cms: [{ content: { name: t("all") } }] }]);

  const [loading, setLoading] = useState(false);
  const [showCopied, setShowCopied] = useState<string>();
  const [selectedCat, setSelectedCat] = useState(offerCats[0]);

  const handleGetOffers = (category?: any) => {
    // incase category present then the tab has changed and we need to reset data
    if (category) {
      setSelectedCat(category);
      setLoading(true);
    }

    const widgetApi = new WidgetAPI();
    widgetApi.getOffers(category?.id, category ? 0 : offersData?.length || 0).then(({ data: offer }) => {
      if (category) {
        setOffersData(offer?.data?.data || []);
      } else {
        setOffersData([...(offersData || []), ...offer?.data?.data]);
      }

      setLoading(false);
    });
  };

  const copyCodeToClipboard = (offer: any) => {
    navigator.clipboard.writeText(offer.coupon?.toUpperCase());
    setShowCopied(offer.id);
    showSuccess(t("couponCopied") || "Coupon Copied !!!");
    offerClickEvent("Copy Code", offer.coupon);
  };

  const pageName = "Offers Listing";
  const pageType = "offers section";

  // Offers PageLoad Event
  const OfferPageLoadEvent = () => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|offers listing",
        newPageName: pageName,
        subSection: pageName,
        assetType: pageType,
        newAssetType: pageType,
        platform: ADOBE.PLATFORM,
        technology: ADOBE.TECHNOLOGY,
      },
    };
  };

  const offerClickEvent = (ctaName: string, couponCode: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|${pageName}`,
        linkPageName: `web|${pageName}`,
        assetType: pageType,
        newAssetType: pageType,
        newLinkPageName: pageName,
        subSection: pageType,
        pageLocation: pageName,
        platform: ADOBE.PLATFORM,
        ctaName,
      },
      offerObj: {
        couponCode: couponCode || "",
      },
    };

    Adobe.Click();
  };

  useEffect(() => {
    const widgetApi = new WidgetAPI();
    widgetApi.getOfferCategories().then(({ data: cat }) => {
      setOfferCats([...offerCats, ...cat?.data?.data]);
    });

    handleGetOffers(selectedCat);
    OfferPageLoadEvent();
  }, []);

  useEffect(() => {
    if (inView) {
      handleGetOffers();
    }
  }, [inView]);

  return (
    <main className="bg-white py-8">
      <Head>
        <title>{t("offers") || "Offers"}</title>
      </Head>

      <h1 className="uppercase text-3xl font-bold bg-underline text-center mb-6 w-max table mx-auto px-1.5">
        {t("offersOfTheWeek") || "offers of the week"}
      </h1>

      <section className="max-w-screen-lg mx-auto">
        <div className="flex flex-wrap overflow-x-scroll justify-center py-4">
          {offerCats.map(cat => {
            const categoryName = cat?.cms?.[0]?.content?.name;

            return (
              <button
                type="button"
                key={categoryName}
                onClick={() => handleGetOffers(cat)}
                className={`rounded-full mr-2.5 mb-3 border border-color1 flex-sliderChild py-2 px-6 ${
                  selectedCat?.cms?.[0]?.content?.name === categoryName ? "text-white bg-color1" : "text-color1"
                }`}
              >
                {categoryName}
              </button>
            );
          })}
        </div>

        {(() => {
          if (loading) {
            return (
              <div className="w-full h-56 relative">
                <LoadSpinner />
              </div>
            );
          }

          if ((offersData?.length || 0) > 0) {
            return offersData?.map((offer, index) => {
              const { content } = offer.cms?.[0] || {};
              const couponCode = offer.couponCode?.trim();
              const copiedOffer = showCopied === offer.id;

              return (
                <div
                  key={offer.id}
                  ref={index === offersData.length - 5 ? ref : null}
                  className="border border-gray-200 rounded p-5 mb-7 shadow flex"
                >
                  <figure className="h-40 w-40 rounded-md flex justify-center items-center border border-color1">
                    <ImageComponent
                      className="mx-auto"
                      forceLoad={index < 5}
                      alt={offer.assets?.[0]?.name}
                      style={{ maxHeight: "136px" }}
                      src={offer.assets?.[0]?.url || getImage(offer, "400x400")}
                    />
                  </figure>

                  <div className="px-4 w-3/5 overflow-hidden mr-4">
                    <p className="font-bold text-18">{content.name}</p>
                    {!offer.neverEnd && (
                      <p className="text-sm font-semibold text-gray-400 capitalize">
                        {t("expireIn") || "expires in"}&nbsp;{formatDistanceToNow(new Date(offer.endDate))}
                      </p>
                    )}
                    <p className="mt-2.5">{content.shortDescription}</p>
                  </div>

                  {couponCode && !copiedOffer && (
                    <div className="my-auto uppercase pl-3 pr-10 border border-dotted rounded-md relative truncate h-10 border-color1 w-1/5 flex items-center justify-center">
                      {couponCode}
                      <button
                        type="button"
                        value={couponCode}
                        onClick={() => copyCodeToClipboard(offer)}
                        className="bg-color1 rounded-r-md absolute h-10 w-10 flex justify-center items-center -right-1 top-0"
                      >
                        <CopyIcon height={15} width={15} />
                      </button>
                    </div>
                  )}

                  {(copiedOffer || !couponCode) && (
                    <Link
                      aria-hidden
                      href={offer.webURL}
                      onClick={() => offerClickEvent("Shop Now", couponCode)}
                      className={`text-center transition-all bg-color1 text-white uppercase font-bold text-sm h-10 rounded-md w-1/5 my-auto flex items-center justify-center`}
                    >
                      {t("shopNow")}
                    </Link>
                  )}
                </div>
              );
            });
          }

          if (offersData?.length === 0) {
            return (
              <div className="p-7 mt-7 text-center">
                <div className="flex justify-center items-center">
                  <NoOfferLogo height={300} width={300} />
                </div>
                <div className="font-semibold mt-7">{t("uhoh") || "Uh-oh"}</div>
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: t("noOffersAvailable")?.replace("\n", "<br/>") }} />
              </div>
            );
          }

          return null;
        })()}
      </section>
    </main>
  );
};

export default OffersPage;
