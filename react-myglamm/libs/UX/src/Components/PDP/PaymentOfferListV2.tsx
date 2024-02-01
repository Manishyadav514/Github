import React, { useEffect, useState } from "react";

import { useSelector } from "@libHooks/useValtioSelector";

import { fetchAllJuspayOffers } from "@libStore/actions/paymentActions";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

import OfferIcon from "../../../public/svg/offersIcon.svg";
import ArrowDown from "../../../public/svg/downArrowBold.svg";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import PaymentAPI from "@libAPI/apis/PaymentAPI";

import clsx from "clsx";
import dynamic from "next/dynamic";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const PaymentOfferPDPModal = dynamic(
  () => import(/* webpackChunkName: "PaymentOfferPDPModal" */ "@libComponents/PopupModal/PaymentOfferPDPModal"),
  { ssr: false }
);

const PaymentOffersList = ({ productPrice }: { productPrice: number }) => {
  const [showOffers, setShowOffers] = useState(true);
  const [credDetails, setCredDetails] = useState<any>();
  const [showOffersDetails, setShowOffersDetails] = useState<boolean>(false);
  const [activeOffer, setActiveOffer] = useState<any>(false);

  const allJuspayOffers = useSelector((store: ValtioStore) => store.paymentReducer.allJuspayOffers);

  useEffect(() => {
    fetchAllJuspayOffers({ payableAmount: productPrice, vendorMerchantId: SITE_CODE() });
    if (checkUserLoginStatus()) {
      checkCredEligibilty();
    }
  }, []);

  const checkCredEligibilty = async () => {
    const paymentApi = new PaymentAPI();
    const response = await paymentApi.checkEligibility({ paymentMethod: "CRED" });

    if (response.data.status) {
      const { metaData } = response.data.data[0];
      if (metaData?.isEligible) {
        setCredDetails(metaData.layout);
      }
    }
  };

  const combineAllOffers = () => {
    let offers: any = [];
    let combineOffers: any = [];

    if (allJuspayOffers) {
      const juspayOffers = [...allJuspayOffers?.eligible, ...allJuspayOffers?.ineligible];

      juspayOffers.forEach(
        (offer: { offer_description: { title: string; subtitle: string; imageURL: string; description: string } }) => {
          offers.push({
            title: offer.offer_description.title,
            subTitle: offer.offer_description.subtitle,
            imageURL: offer.offer_description.imageURL,
            description: offer.offer_description.description,
          });
        }
      );
    }

    if (credDetails) {
      combineOffers = [
        ...offers,
        {
          title: credDetails?.cta_text,
          subTitle: credDetails?.sub_text,
          imageURL: credDetails?.icon,
          description: credDetails?.banner_text,
        },
      ];
    } else {
      combineOffers = [...offers];
    }

    return combineOffers;
  };

  if (allJuspayOffers || credDetails) {
    return (
      <>
        <div className="mb-3 mx-2">
          <div
            className="bg-white p-2 flex items-center justify-around mt-2 pb-2 gap-2"
            onClick={() => setShowOffers(!showOffers)}
          >
            <OfferIcon className="h-6 w-6" />
            <div>
              <span className="font-bold">Offers</span> <br />
              <span className="text-sm line-clamp-1">Save extra buy more with these exciting offers</span>
            </div>
            <ArrowDown className={clsx("", showOffers && "rotate-180")} />
          </div>
          {showOffers && (
            <>
              <div
                className={clsx(" bg-white p-2 ", combineAllOffers().length === 1 ? "w-full" : "flex w-full overflow-x-scroll")}
              >
                {combineAllOffers().map((paymentOffer: any, index: number) => (
                  <span
                    onClick={() => {
                      setActiveOffer(paymentOffer);
                      setShowOffersDetails(true);
                    }}
                    key={index}
                  >
                    <OffersList paymentOffer={paymentOffer} key={index} combineAllOffers={combineAllOffers} />
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        {showOffersDetails && (
          <PaymentOfferPDPModal
            show={showOffersDetails}
            onRequestClose={() => setShowOffersDetails(false)}
            activeOffer={activeOffer}
          />
        )}
      </>
    );
  }

  return null;
};

const OffersList = ({ paymentOffer, combineAllOffers }: { paymentOffer: any; combineAllOffers: any }) => {
  return (
    <div
      className={clsx(
        "border border-color1  rounded flex-sliderChild  p-0.5",
        combineAllOffers().length === 1 ? "w-full" : "w-60 h-28 ml-2"
      )}
    >
      <div className="flex items-center bg-color2 p-2 h-14">
        <ImageComponent src={paymentOffer?.imageURL} alt={paymentOffer?.title} className="bg-white rounded-3 w-10 h-10" />
        <div className="ml-3">
          <div className="text-sm overflow-hidden line-clamp-1">{paymentOffer?.title}</div>
          <div className="font-bold text-sm  overflow-hidden line-clamp-1">{paymentOffer?.subTitle}</div>
        </div>
      </div>
      <div className="bg-white m-2 text-sm line-clamp-2 overflow-hidden">{paymentOffer?.description}</div>
    </div>
  );
};

export default PaymentOffersList;
