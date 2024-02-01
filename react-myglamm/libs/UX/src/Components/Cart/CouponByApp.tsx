import * as React from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import { useEffect, useState } from "react";
import { getAppStoreRedirectionUrl } from "@libUtils/getAppStoreRedirectionUrl";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import ImageComponent from "@libComponents/Common/LazyLoadImage";

const CouponByApp = () => {
  const [loading, setLoading] = useState(true);
  const [couponData, setCouponData] = useState<any>([]);

  const fetchTrendingSearches = async () => {
    const widgetApi = new WidgetAPI();
    try {
      const { data } = await widgetApi.getWidgets({
        where: { slugOrId: "mobile-site-order-success-unlock-coupon-by-app-download" },
      });
      setCouponData(data?.data?.data?.widget);
    } catch (error) {
      console.error("Widget Load Error : ", error);
      setCouponData([]);
    } finally {
      setLoading(false);
    }
  };

  // click event on redirection
  const adobeClickEvent = () => {
    (window as any).digitalData = {
      ...(window as any).digitalData,
      common: {
        assetType: "order summary",
        ctaName: `Download App Unlock Coupon`,
        linkName: `web | Download App Unlock Coupon`,
        linkPageName: `web| Download App Unlock Coupon`,
        newAssetType: "order summary",
        newLinkPageName: "Download App Unlock Coupon",
        pageLocation: "order summary",
        platform: ADOBE.PLATFORM,
        subSection: "Download App Unlock Coupon",
      },
    };
    Adobe.Click();
  };

  useEffect(() => {
    setLoading(true);
    fetchTrendingSearches();
  }, []);

  return (
    <section>
      {loading ? (
        <div className="h-96">
          <LoadSpinner />
        </div>
      ) : (
        <div
          className="w-full flex justify-center"
          onClick={() => {
            adobeClickEvent();
            return (location.href = getAppStoreRedirectionUrl(couponData?.[0]?.multimediaDetails?.[0]?.url || ""));
          }}
        >
          <ImageComponent
            className="h-auto max-w-full"
            src={couponData?.[0]?.multimediaDetails?.[0]?.assetDetails.url}
            alt={couponData?.[0]?.multimediaDetails?.[0].sliderText || "coupon-image"}
          />
        </div>
      )}
    </section>
  );
};

export default CouponByApp;
