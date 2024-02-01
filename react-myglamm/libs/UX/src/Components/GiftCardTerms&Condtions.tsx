import React, { useEffect, useState } from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { getClientQueryParam } from "@libUtils/_apputils";
import { formatPrice } from "@libUtils/format/formatPrice";
import LoadSpinner from "./Common/LoadSpinner";

const GiftCardTermsAndCondition = ({ minBillAmount }: { minBillAmount?: number }) => {
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchGiftCardsTermsAndConditions = async () => {
      setLoader(true);
      try {
        const widgetApi = new WidgetAPI();

        const { data } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-gift-card-terms-and-conditions" } });
        const { widget } = data.data.data;

        setTermsAndConditions(widget[0]?.commonDetails?.description);
        setLoader(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGiftCardsTermsAndConditions();
  }, []);

  if (loader) {
    return (
      <div className="relative min-h-[50vh]">
        <LoadSpinner className="m-auto top-0 bottom-0 right-0 left-0 h-20 absolute" />
      </div>
    );
  }

  return (
    <div
      className="p-2"
      dangerouslySetInnerHTML={{
        __html: termsAndConditions.replace(
          "{{ aov_min }}",
          `${minBillAmount && formatPrice(minBillAmount / 100, true, false)}`
        ),
      }}
    />
  );
};

export default GiftCardTermsAndCondition;
