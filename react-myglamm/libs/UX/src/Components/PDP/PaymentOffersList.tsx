import React, { useEffect, useState } from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import OfferIcon from "../../../public/svg/offersIcon.svg";
import ArrowDown from "../../../public/svg/downArrowBold.svg";
import { useSplit } from "@libHooks/useSplit";
import useTranslation from "@libHooks/useTranslation";

const PaymentOffersList = () => {
  const { t } = useTranslation();
  const variants = useSplit({ experimentsList: [{ id: "paymentOffersPdp" }], deps: [] });

  const [offersWidgets, setOffersWidgets] = useState<any>([]);
  const [showOffers, setShowOffers] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      const widgetApi = new WidgetAPI();
      try {
        const { data: widgets } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-pdp-payment-offers" } });
        const { widget } = widgets?.data?.data || { widget: [] };
        setOffersWidgets(widget);
      } catch (err) {
        console.error(err);
      }
    };

    if (variants && variants?.paymentOffersPdp !== "no-variant") {
      fetchOffers();
    }
  }, [variants]);

  if (offersWidgets?.length > 0 && variants.paymentOffersPdp === "1") {
    return (
      <>
        <div className="bg-white p-2 flex items-center justify-around mt-2 pb-2" onClick={() => setShowOffers(!showOffers)}>
          <OfferIcon />
          <div className="">
            <span className="font-bold">Payment Offers</span> <br />
            <span className="text-sm">Save extra buy more with these exciting offers</span>
          </div>
          <ArrowDown />
        </div>
        {showOffers && (
          <>
            {offersWidgets?.length === 1 ? (
              <div className="flex items-center bg-white p-3">
                <img
                  src={offersWidgets?.[0]?.multimediaDetails[0]?.assetDetails?.url}
                  alt={offersWidgets?.[0]?.label}
                  className="bg-white p-2 ml-2 w-8 h-8"
                />
                <div className="ml-2 text-sm">{offersWidgets?.[0]?.commonDetails?.shortDescription}</div>
              </div>
            ) : (
              <div className="flex bg-white p-2 w-full overflow-x-scroll">
                {offersWidgets?.map((paymentOffer: any) => (
                  <OffersList paymentOffer={paymentOffer} key={paymentOffer.id} />
                ))}
              </div>
            )}
          </>
        )}
      </>
    );
  }

  return null;
};

const OffersList = ({ paymentOffer }: { paymentOffer: any }) => {
  return (
    <div className="border border-color1 max-w-sm rounded ml-2 flex-sliderChild w-3/4 p-0.5">
      <div className="flex items-center bg-color2 p-3">
        <img
          src={paymentOffer?.multimediaDetails[0]?.assetDetails?.url}
          alt={paymentOffer?.label}
          className="bg-white p-2 w-8 h-8"
        />
        <div className="ml-3">
          <div>{paymentOffer?.commonDetails?.title}</div>
          <div className="font-bold">{paymentOffer?.commonDetails?.subTitle}</div>
        </div>
      </div>
      <div className="bg-white p-3 text-sm">{paymentOffer?.commonDetails?.shortDescription}</div>
    </div>
  );
};

export default PaymentOffersList;
