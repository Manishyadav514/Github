import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import WidgetsHOC from "@libComponents/HomeWidgets/WidgetsHOC";

import { WidgetProps } from "@typesLib/Widgets";

const BlogsGrid = dynamic(() => import("./BlogsGrid"));
const HTMLContent = dynamic(() => import("./HTMLContent"));
const SlickBanner = dynamic(() => import("./SlickBanner"));
const CategoryGrids = dynamic(() => import("./CategoryGrids"));
const MenuProductGrid = dynamic(() => import("./MenuProductGrid"));
const MultipleBanners = dynamic(() => import("./MultipleBanners"));
const ProductCarousel = dynamic(() => import("./ProductCarousel"));
const ModuleCarousel10 = dynamic(() => import("./ModuleCarousel10"));
const MultimediaCarousel2 = dynamic(() => import("./MultimediaCarousel2"));
const MultimediaCarousel9 = dynamic(() => import("./MultimediaCarousel9"));
const MultimediaCarousel5 = dynamic(() => import("./MultimediaCarousel5"));
const RecommendedArticles = dynamic(() => import("./RecommendedArticles"));
const IndependentDailyTips = dynamic(() => import("./IndependentDailyTips"));
const MultipleLooksCarousel = dynamic(() => import("./MultipleLooksCarousel"));
const MultipleBannerCarousel = dynamic(() => import("./MultipleBannerCarousel"));
const BannerProductCarousel2 = dynamic(() => import("./BannerProductCarousel2"));
const MultimediaSingleBanner = dynamic(() => import("./MultimediaSingleBanner"));
const BannerProductCarousel1 = dynamic(() => import("./BannerProductCarousel1"));
const SingleCollectionCarousel = dynamic(() => import("./SingleCollectionCarousel"));

const Widgets = (props: WidgetProps) => {
  const { pathname } = useRouter();

  const getWidgetGroups = (widget: any, index: number) => {
    const { customParam, label } = widget;

    const icid = `home_homepage_${customParam?.toLowerCase()}_${label?.toLowerCase()}_${index + 1}`;

    const isTVC = pathname.match(/\/focus-group|\/shraddha-kapoor-tv-ad/);

    switch (customParam) {
      case "html-content": {
        return <HTMLContent data={widget} />;
      }
      case "multimedia-carousel-3": {
        return <MultipleBanners data={widget} icid={icid} />;
      }
      case "multimedia-carousel-5": {
        return <MultimediaCarousel5 data={widget} isTVC={!!isTVC} />;
      }
      case "multimedia-carousel-6": {
        return <SlickBanner data={widget} icid={icid} />;
      }
      case "multimedia-grid-1": {
        return <CategoryGrids data={widget} icid={icid} />;
      }
      case "module-carousel-2": {
        return <ProductCarousel data={widget} icid={icid} />;
      }
      case "module-carousel-3": {
        return <MultipleLooksCarousel data={widget} icid={icid} />;
      }
      case "module-carousel-4": {
        return <SingleCollectionCarousel data={widget} icid={icid} />;
      }
      case "module-carousel-6": {
        return <MenuProductGrid data={widget} icid={icid} widgetsCount={props.widgets?.length} closeMenu={props.closeMenu} />;
      }
      case "module-carousel-7": {
        return <RecommendedArticles item={widget} />;
      }
      case "module-grid-1": {
        return <BlogsGrid data={widget} icid={icid} />;
      }
      case "independent-banner-product-carousel-2": {
        return <BannerProductCarousel2 data={widget} icid={icid} />;
      }
      case "multimedia-carousel-1": {
        return <MultipleBannerCarousel data={widget} icid={icid} tvc={!!isTVC} />;
      }
      case "multimedia-single-banner": {
        return <MultimediaSingleBanner data={widget} index={index} icid={icid} />;
      }
      case "independent-banner-product-carousel-1": {
        return <BannerProductCarousel1 data={widget} index={index} />;
      }
      case "module-carousel-10": {
        return <ModuleCarousel10 data={widget} index={index} />;
      }
      case "multimedia-carousel-2": {
        return <MultimediaCarousel2 data={widget} index={index} />;
      }
      case "multimedia-carousel-9": {
        return <MultimediaCarousel9 item={widget} index={index} />;
      }
      case "independent-daily-tips": {
        return <IndependentDailyTips key={widget.id} item={widget} />;
      }

      default: {
        return null;
      }
    }
  };

  return <WidgetsHOC widgetGroups={getWidgetGroups} {...props} />;
};

export default Widgets;
