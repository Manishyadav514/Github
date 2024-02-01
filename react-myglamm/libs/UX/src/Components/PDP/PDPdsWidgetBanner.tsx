import React, { useEffect, useState } from "react";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import MultipleBanner from "@libComponents/HomeWidgets/MultipleBanner-homewidget";

const PDPdsWidgetBanner = () => {
  const [item, setItem] = useState([]);
  useEffect(() => {
    const where: any = {
      where: {
        slugOrId: "mobile-site-ds-pd-page-top-banner",
      },
    };
    const widgetApi = new WidgetAPI();
    const dsWidgetData = async () => {
      const { data } = await widgetApi.getWidgets(where, 5, 0);
      setItem(data?.data?.data?.widget[0]);
      console.log("dswidget", data?.data?.data?.widget[0]?.multimediaDetails);
      data?.data?.data?.widget[0].multimediaDetails.map((val: any) => {
        console.log("object", val?.assetDetails.url);
      });
    };
    dsWidgetData();
  }, []);
  return <MultipleBanner item={item} />;
};

export default PDPdsWidgetBanner;
