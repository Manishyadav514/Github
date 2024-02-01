import * as React from "react";
import BestSellers from "@libComponents/SearchTopSellingWidgets/BestSellers";
import ShopFromCategories from "@libComponents/SearchTopSellingWidgets/ShopFromCategories-homewidget";
import RecommendedForYou from "@libComponents/SearchTopSellingWidgets/RecommendedForYou";
import ModuleCarousal4 from "@libComponents/HomeWidgets/ModuleCarousel4-homewidget";
import ModuleCarousel12 from "@libComponents/HomeWidgets/ModuleCarousel12-homewidget";

const TopSellingWidgetsGroup = (item: any, index: number) => {
  const icid = `search_search landing page_${item.customParam.toLowerCase()}_${item.label.toLowerCase()}_${index + 1}`;

  switch (item.customParam) {
    case "module-carousel-2": {
      return <BestSellers item={item} widgetIndex={index} icid={icid} />;
    }
    case "module-carousel-3": {
      return <RecommendedForYou item={item} widgetIndex={index} icid={icid} />;
    }
    case "multimedia-grid-1": {
      return <ShopFromCategories item={item} widgetIndex={index} icid={icid} />;
    }
    case "module-carousel-4": {
      return <ModuleCarousal4 item={item} widgetIndex={index} icid={icid} />;
    }
    case "module-carousel-12": {
      return <ModuleCarousel12 item={item} widgetIndex={index} icid={icid} />;
    }

    default: {
      return null;
    }
  }
};

function TopSellingWidgets({ widgets }: any) {
  return widgets?.map((item: any, index: number) => {
    return <div key={`tsw-${index}`}>{TopSellingWidgetsGroup(item, index)}</div>;
  });
}

export default React.memo(TopSellingWidgets);
