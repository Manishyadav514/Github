import React, { useEffect, useState, memo } from "react";

import ErrorBoundary from "@libComponents/ErrorBoundary/ErrorBoundary";

import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

import CopyCouponCode from "@libComponents/CopyCoupon";
import OfferMiniPDP from "@libComponents/PopupModal/OfferMiniPDP";
import PDPFreeProductModal from "@libComponents/PopupModal/PDPFreeProductModal";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import ScratchCardText from "@libComponents/ScratchCard/ScratchCardText";

import WidgetLabel from "./WidgetLabel";
import { useSelector } from "@libHooks/useValtioSelector";
import { GiBackIco } from "@libComponents/GlammIcons";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import dynamic from "next/dynamic";

const ScratchCardModal = dynamic(
  () => import(/* webpackChunkName: "ScratchCardModal" */ "@libComponents/ScratchCard/ScratchCardModal"),
  { ssr: false }
);

import { ValtioStore } from "@typesLib/ValtioStore";
import { formatPrice } from "@libUtils/format/formatPrice";

const TwinCarouselCard = memo(({ offer, index }: any) => {
  const { t } = useTranslation();
  const [showMiniPDPFlag, setShowMiniPDPFlag] = useState(false);
  const [showMiniPDPModal, setShowMiniPDPModal] = useState(false);
  const [selectedWeburl, setSelectedWeburl] = useState<any>();
  const [showPDPFreeProductModal, setShowPDPFreeProductModal] = useState(false);
  const [freeProducts, setFreeProducts] = useState<any>();
  const [selectedProduct, setSelectedProduct] = useState<any>();

  useEffect(() => {
    if (offer?.cta?.web?.includes("/product/")) {
      setShowMiniPDPFlag(true);
    } else {
      setShowMiniPDPFlag(false);
    }
  }, []);

  const onMiniPDPClose = (productSelected: any, freeProds: any) => {
    setShowMiniPDPModal(false);
    if (freeProds) {
      setFreeProducts(freeProds);
      setSelectedProduct(productSelected);
      setShowPDPFreeProductModal(true);
    }
  };

  const adobeEvent = (ctaName: any) => {
    const pageName = "homepage";
    const pageType = "Exclusive offers widget";
    let commonObj = {};

    commonObj = {
      linkName: `web|home|${pageName}|${pageType}|${ctaName}`,
      linkPageName: `web|home|${pageName}|${pageType}|${ctaName}`,
      assetType: "home",
      newAssetType: "home",
      newLinkPageName: pageName,
      subSection: pageName,
      pageLocation: "home",
      platform: ADOBE.PLATFORM,
      ctaName,
    };

    (window as any).digitalData = {
      common: commonObj,
      user: Adobe.getUserDetails(),
    };

    Adobe.Click();
  };

  const { value } = offer;

  return (
    <div>
      <div className="flex justify-center flex-col ml-2  w-48 h-72 shadow rounded">
        {offer?.key && offer.key == "scratchCard" ? (
          <div className="relative">
            <ImageComponent
              className="flex justify-center items-center rounded-t mx-auto w-full"
              style={{ maxWidth: "auto", maxHeight: "170px" }}
              src="https://files.myglamm.com/site-images/original/Get-Flat-(1).png"
            />
            <span
              className="absolute flex flex-col top-1/2 px-4 leading-none mt-2 font-extrabold text-4xl justify-center text-center  truncate items-center uppercase"
              style={{
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              {value.discountType == "number" ? formatPrice(value.discount, true, false) : `${value.discount} %`}

              <p className="text-xl font-semibold leading-none">Discount</p>
            </span>
          </div>
        ) : (
          <ImageComponent
            className="flex justify-center items-center rounded-t "
            style={{ maxWidth: "auto", maxHeight: "170px" }}
            src={offer.assets?.[0]?.imageUrl?.["400x400"]}
          />
        )}

        <div className="px-2 h-24 mt-2 text-center">
          <h1 className="text-xs text-black font-bold">{offer.couponName}</h1>
          <p className="text-xs font-light my-1 text-gray-600">{offer.couponDescription}</p>
        </div>

        <div className="w-full" style={{ padding: "0 10px 10px" }}>
          <CopyCouponCode
            index={index}
            couponCode={offer.couponCode}
            apiShowMiniPDPFlag={showMiniPDPFlag}
            id={offer.id}
            webURL={offer?.cta?.web}
            t={t}
            showMiniPDP={(data: any | { productTag?: string; webURL: string }) => {
              let slug = data?.webURL.substring(data?.webURL.indexOf("/product"), data?.webURL.indexOf("?"));
              slug ? setSelectedWeburl(slug) : setSelectedWeburl(data.webURL);

              setShowMiniPDPModal(true);
            }}
            isReminderWidget={true}
            adobeEvent={adobeEvent}
          />
        </div>
      </div>
      {showMiniPDPModal && <OfferMiniPDP show={showMiniPDPModal} onRequestClose={onMiniPDPClose} slug={selectedWeburl} t={t} />}
      {showPDPFreeProductModal && (
        <PDPFreeProductModal
          show={showPDPFreeProductModal}
          hide={() => setShowPDPFreeProductModal(false)}
          freeProduct={freeProducts}
          product={selectedProduct}
          t={t}
        />
      )}
    </div>
  );
});

const ReminderWidget = ({ item }: any) => {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const { t } = useTranslation();

  const [reminderWidgetData, setReminderWidgetData] = useState<any>([]);
  const [showScratchCardModal, setShowScratchCardModal] = useState(false);
  const [scratchCardData, setScratchCardData] = useState<any>({});
  const [scratchIndex, setScratchIndex] = useState<any>();

  useEffect(() => {
    if (userProfile) {
      const widgetApi = new WidgetAPI();

      const widgetMeta = item?.meta?.widgetMeta ? JSON.parse(item?.meta?.widgetMeta) : "";

      widgetApi
        .getReminderWidgetData(widgetMeta.url)
        .then(({ data: res }) => {
          if (res.data) {
            setReminderWidgetData(res.data.data);
          } else {
            setReminderWidgetData([]);
          }
        })
        .catch(() => setReminderWidgetData([]));
    }
  }, [userProfile]);

  const getScratchCardData = (data: any, index: number) => {
    setScratchCardData({
      identifier: data.identifier,
      key: data.key,
      vendorCode: data.vendorCode,
      value: {
        type: data.value.type,
        orderId: data.value.orderId,
        discountCode: data.couponCode,
        discountDescription: data.couponDescription,
        discountAmount: data.value.discount,
        discountAmountType: data.value.discountType,
        unlocksAt: data.value.unlocksAt,
        expiryDate: data.expiryDate,
      },
      statusId: data.statusId,
      createdAt: data.createdAt,
      id: data.id,
    });
    setShowScratchCardModal(true);
    setScratchIndex(index);
  };

  return (
    <ErrorBoundary>
      {userProfile && reminderWidgetData && reminderWidgetData.length ? (
        <div className="p-2">
          <WidgetLabel title={item.commonDetails.title} />
          <div className="flex overflow-x-auto px-2 pb-4">
            {reminderWidgetData?.map((offer: any, index: number) => {
              return (
                <React.Fragment key={offer.id}>
                  {offer?.statusId === SCRATCHCARD_STATUS.UNSCRATCHED_CARD ? (
                    <div>
                      <div className="w-48 h-72 ml-2 relative" onClick={() => getScratchCardData(offer, index)}>
                        <img
                          src="https://files.myglamm.com/site-images/original/-e-Scratch-Card-copy@1,5x-02-(1).png"
                          alt="scratch-card"
                          className="w-full h-72"
                        />
                        <ScratchCardText scratchCardData={offer} />
                      </div>
                    </div>
                  ) : (
                    <TwinCarouselCard offer={offer} index={index} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="flex p-4">
            <a
              href="/offers?category=for_you"
              className="flex items-center justify-center w-full text-center py-2 font-bold border border-black rounded tracking-wide"
              aria-label={t("viewMore")}
            >
              <h1 className="justify-center">{t("viewMore")}</h1>
              <GiBackIco
                className="absolute -mt-1"
                style={{ right: "50px", transform: "rotate(180deg)" }}
                width="27"
                height="27"
                role="img"
                aria-labelledby="view more"
              />
            </a>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      {showScratchCardModal && (
        <ScratchCardModal
          show={showScratchCardModal}
          onRequestClose={() => {
            setShowScratchCardModal(false);
          }}
          scratchCardData={scratchCardData}
          scratchIndex={scratchIndex}
          setScratchCards={setReminderWidgetData}
          scratchCards={reminderWidgetData}
          pageName="homepage"
        />
      )}
    </ErrorBoundary>
  );
};

export default ReminderWidget;
