import React, { ReactElement, useEffect, useState } from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { getClientQueryParam } from "@libUtils/_apputils";
import { formatPrice } from "@libUtils/format/formatPrice";
import Layout from "@libLayouts/Layout";

const GiftCardTermsAndConditions = ({ widgetData }: { widgetData: any }) => {
  const [minBillAmount, setMinBillAmount] = useState("");
  const termsAndConditions = widgetData[0]?.commonDetails?.description;

  useEffect(() => {
    const aov = getClientQueryParam("aov");
    if (aov) {
      setMinBillAmount(aov);
    }
  }, []);

  if (!minBillAmount) {
    return null;
  }

  return (
    <div
      className="p-2"
      dangerouslySetInnerHTML={{
        __html: termsAndConditions.replace(
          "{{ aov_min }}",
          `${minBillAmount && formatPrice(parseInt(minBillAmount) / 100, true, false)}`
        ),
      }}
    />
  );
};

GiftCardTermsAndConditions.getLayout = (children: ReactElement) => (
  <Layout footer={false} header={false}>
    {children}
  </Layout>
);

export default GiftCardTermsAndConditions;

// ssr for giftcard terms and conditions widget data
GiftCardTermsAndConditions.getInitialProps = async () => {
  const widgetApi = new WidgetAPI();
  try {
    const { data } = await widgetApi.getWidgets({ where: { slugOrId: "mobile-site-gift-card-terms-and-conditions" } });
    return { widgetData: data?.data?.data?.widget };
  } catch {
    return { widgetData: [] };
  }
};
