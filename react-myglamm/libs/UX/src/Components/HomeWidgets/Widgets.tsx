import React from "react";
import dynamic from "next/dynamic";

import WidgetsHOC from "./WidgetsHOC";
import { WidgetProps } from "@typesLib/Widgets";

const ModuleCarousel5 = dynamic(
  () => import("@libComponents/PDPWidgets/ModuleCarouselv5" /* webpackChunkName: "ModuleCarouselV5" */)
);
const RecommendedArticles = dynamic(() => import("./RecommendedArticles" /* webpackChunkName: "1-homewidget" */));
const ReminderWidget = dynamic(() => import("./ReminderWidget-homewidget" /* webpackChunkName: "1-homewidget" */));
const BrandGrid = dynamic(() => import("./BrandGrid-homewidget" /* webpackChunkName: "2-homewidget" */));
const SingleBanner = dynamic(() => import("./SingleBanner-homewidget" /* webpackChunkName: "3-homewidget" */));
const SingleBlog = dynamic(() => import("./SingleBlog-homewidget" /* webpackChunkName: "4-homewidget" */));
const SingleCollection = dynamic(() => import("./SingleCollection-homewidget" /* webpackChunkName: "5-homewidget" */));
const SingleLookBook = dynamic(() => import("./SingleLookBook-homewidget" /* webpackChunkName: "6-homewidget" */));
const SingleProduct = dynamic(() => import("./SingleProduct-homewidget" /* webpackChunkName: "7-homewidget" */));
const RectangleVideoBanner = dynamic(() => import("./RectangleVideoBanner-homewidget" /* webpackChunkName: "8-homewidget" */));
const SquareVideoCard = dynamic(() => import("./SquareVideoCard-homewidget" /* webpackChunkName: "9-homewidget" */));
const ThreeGridViewVertical = dynamic(
  () => import("./ThreeGridViewVertical-homewidget" /* webpackChunkName: "10-homewidget" */)
);
const PhotoSlurp = dynamic(() => import("./PhotoSlurp-homewidget" /* webpackChunkName: "11-homewidget" */));
const MultipleBanner = dynamic(() => import("./MultipleBanner-homewidget" /* webpackChunkName: "12-homewidget" */));
const MultipleCollectionCarousel = dynamic(
  () => import("./MultipleCollectionCarousel-homewidget" /* webpackChunkName: "13-homewidget" */)
);
const MultipleCollectionCarouselTwin = dynamic(
  () => import("./MultipleCollectionCarouselTwin-homewidget" /* webpackChunkName: "14-homewidget" */)
);
const MultipleBlogCarousel = dynamic(() => import("./MultipleBlogCarousel-homewidget" /* webpackChunkName: "15-homewidget" */));
const MultipleLookBookCarousel = dynamic(
  () => import("./MultipleLookBookCarousel-homewidget" /* webpackChunkName: "16-homewidget" */)
);
const MultipleProductCarousel = dynamic(
  () => import("./MultipleProductCarousel-homewidget" /* webpackChunkName: "17-homewidget" */)
);
const ImageCarousel = dynamic(() => import("./ImageCarousel-homewidget" /* webpackChunkName: "18-homewidget" */));
const CartCarousel = dynamic(() => import("./CartCarousel-homewidget" /* webpackChunkName: "19-homewidget" */));
const HTMLContent = dynamic(() => import("./HTMLContent-homewidget" /* webpackChunkName: "20-homewidget" */));
const FlashSale = dynamic(() => import("./FlashSale-homewidget" /* webpackChunkName: "21-homewidget" */));
const MultimediaCarousel5 = dynamic(
  () => import("@libComponents/TVC/multimedia-carousel-5-homewidget" /* webpackChunkName: "22-homewidget" */)
);
const BannerProductCarousel2 = dynamic(
  () => import("@libComponents/TVC/banner-product-carousel-2-homewidget" /* webpackChunkName: "23-homewidget" */)
);
const MultimediaSingleBanner = dynamic(
  () => import("@libComponents/TVC/multimedia-single-banner-homewidget" /* webpackChunkName: "24-homewidget" */)
);
const Review = dynamic(() => import("./Review-homewidget" /* webpackChunkName: "25-homewidget" */));
const MultimediaCarousel2 = dynamic(() => import("./MultimediaCarousel2-homewidget" /* webpackChunkName: "26-homewidget" */));
const MultimediaCarousel3 = dynamic(() => import("./MultimediaCarousel3-homewidget" /* webpackChunkName: "26-homewidget" */));
const MultimediaCarousel4 = dynamic(() => import("./MultimediaCarousel4-homewidget" /* webpackChunkName: "26-homewidget" */));
const ShopFromCategories = dynamic(
  () => import("@libComponents/SearchTopSellingWidgets/ShopFromCategories-homewidget" /* webpackChunkName: "27-homewidget" */)
);
const TopNavigation = dynamic(() => import("./TopNavigationWidget-homewidget" /* webpackChunkName: "28-homewidget" */));
const MultimediaGridBanners = dynamic(
  () => import("./MultimediaGridBanners-homewidget" /* webpackChunkName: "29-homewidget" */)
);
const CustomMultimediaCarousel = dynamic(
  () => import("./CustomMultimediaCarousel-homewidget" /* webpackChunkName: "32-homewidget" */)
);
const MultimediaGrid4 = dynamic(() => import("./MultimediaGrid4-homewidget" /* webpackChunkName: "34-homewidget" */));
const RecommendedForYou = dynamic(
  () => import("@libComponents/SearchTopSellingWidgets/RecommendedForYou" /* webpackChunkName: "35-homewidget" */)
);
const MultimediaGrid5 = dynamic(() => import("./MultimediaGrid5-homewidget" /* webpackChunkName: "36-homewidget" */));
const ModuleCarousel4 = dynamic(() => import("@libComponents/HomeWidgets/ModuleCarousel4-homewidget"));
const MysteryRewardsWidget = dynamic(() => import("./MysteryRewardsWidget" /* webpackChunkName: "MysteryRewardsWidget" */));
const IndependentDailyTips = dynamic(() => import("./IndependentDailyTips" /* webpackChunkName: "MysteryRewardsWidget" */));
const ModuleCarousel12 = dynamic(() => import("@libComponents/HomeWidgets/ModuleCarousel12-homewidget"));

const BBLeaderboard = dynamic(() => import("./BBLeaderboard"));

function WidgetGroups(item: any, index: number, icidPrefix?: string) {
  const icid = `${icidPrefix}_${item?.customParam?.toLowerCase()}_${item?.label?.toLowerCase()}_${index + 1}`;

  switch (item.customParam) {
    case "multimedia-carousel-10": {
      return <TopNavigation key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-carousel-1":
    case "multiple-banner": {
      return <MultipleBanner key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-carousel-2": {
      return <MultimediaCarousel2 key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-carousel-3": {
      return <MultimediaCarousel3 key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-carousel-4": {
      return <MultimediaCarousel4 key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "single-banner": {
      return <SingleBanner key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "single-collection": {
      return <SingleCollection key={item.id} item={item} icid={icid} />;
    }
    case "single-blog": {
      return <SingleBlog key={item.id} item={item} icid={icid} />;
    }
    case "single-lookbook": {
      return <SingleLookBook key={item.id} item={item} icid={icid} />;
    }
    case "html-content": {
      return <HTMLContent key={item.id} item={item} />;
    }
    case "single-product": {
      return <SingleProduct key={item.id} item={item} icid={icid} />;
    }
    case "three-grid-view-vertical": {
      return <ThreeGridViewVertical key={item.id} item={item} icid={icid} />;
    }
    case "partial-banner-carousel": {
      return <BrandGrid key={item.id} item={item} icid={icid} />;
    }
    case "offers": {
      return <ReminderWidget key={item.id} item={item} />;
    }
    case "square-video-banner": {
      return <SquareVideoCard key={item.id} item={item} />;
    }
    case "rect-video-banner": {
      return <RectangleVideoBanner key={item.id} item={item} />;
    }
    case "cart-product-carousel": {
      return <CartCarousel key={item.id} item={item} icid={icid} />;
    }
    case "multiple-blog-carousel": {
      return <MultipleBlogCarousel key={item.id} item={item} icid={icid} />;
    }
    case "multiple-lookbook-carousel": {
      return <MultipleLookBookCarousel key={item.id} item={item} icid={icid} />;
    }
    case "module-carousel-1":
    case "multiple-collection-carousel": {
      return (
        <React.Fragment>
          <MultipleCollectionCarousel key={item.id} item={item} icid={icid} />
        </React.Fragment>
      );
    }
    case "module-carousel-2":
    case "multiple-collection-carousel-twin": {
      return <MultipleCollectionCarouselTwin key={item.id} item={item} icid={icid} />;
    }
    case "module-carousel-4": {
      return <ModuleCarousel4 item={item} widgetIndex={index} icid={icid} />;
    }
    case "module-carousel-7": {
      return <RecommendedArticles item={item} />;
    }
    case "multiple-product-carousel": {
      return <MultipleProductCarousel key={item.id} item={item} icid={icid} />;
    }
    case "image-carousel": {
      return <ImageCarousel key={item.id} item={item} icid={icid} />;
    }

    /* New Version Widgets */
    case "independent-photoslurp-grid-2": {
      return <PhotoSlurp key={item.id} item={item} />;
    }
    case "flash-sale": {
      return <FlashSale key={item.id} item={item} icid={icid} />;
    }
    case "multimedia-carousel-5": {
      return <MultimediaCarousel5 key={item.id} item={item} />;
    }
    case "multimedia-single-banner": {
      return <MultimediaSingleBanner key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "independent-banner-product-carousel-2": {
      return <BannerProductCarousel2 key={item.id} item={item} icid={icid} />;
    }
    case "homepage-review": {
      return <Review key={item.id} item={item} icid={icid} />;
    }
    case "multimedia-grid-1": {
      return <ShopFromCategories key={item.id} item={item} icid={icid} />;
    }
    case "multimedia-grid-3": {
      return <MultimediaGridBanners key={item.id} item={item} icid={icid} />;
    }
    case "multimedia-carousel-11": {
      return <CustomMultimediaCarousel key={item.id} item={item} style={{ width: "75%" }} icid={icid} />;
    }
    case "multimedia-carousel-12": {
      return <CustomMultimediaCarousel key={item.id} item={item} style={{ width: "46%" }} icid={icid} />;
    }
    case "multimedia-grid-4": {
      return <MultimediaGrid4 key={item.id} item={item} icid={icid} />;
    }
    case "mystery-rewards": {
      return <MysteryRewardsWidget key={item.id} item={item} icid={icid} />;
    }

    case "independent-daily-tips": {
      return <IndependentDailyTips key={item.id} item={item} />;
    }

    case "independent-contest-leaderboard": {
      return <BBLeaderboard key={item.id} item={item} icid={icid} widgetIndex={index} />;
    }
    case "multimedia-grid-5": {
      return <MultimediaGrid5 key={item.id} item={item} icid={icid} />;
    }
    case "module-carousel-12": {
      return <ModuleCarousel12 item={item} widgetIndex={index} icid={icid} />;
    }
    case "module-carousel-5": {
      return <ModuleCarousel5 item={item} widgetIndex={index} icid={icid} />;
    }
    default: {
      console.info("Unknown Custom Param Introduced in Homegroup Widgets");
      return <div hidden />;
    }
  }
}

function Widgets({
  widgets,
  slugOrId,
  expId,
  additionalData,
  disableSegment = false,
  widgetPersonalization = false,
  icidPrefix = "home_homepage",
  abExp,
}: WidgetProps) {
  const props = { widgets, slugOrId, expId, additionalData, disableSegment, widgetPersonalization, icidPrefix, abExp };

  return <WidgetsHOC widgetGroups={WidgetGroups} {...props} />;
}

export default Widgets;
