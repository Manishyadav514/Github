import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { PDP_ICID } from "@productLib/pdp/PDP.constant";
import { PDPProd } from "@typesLib/PDP";
import LazyHydrate from "react-lazy-hydration";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import dynamic from "next/dynamic";

const PDPAccordionV2 = dynamic(() => import(/* webpackChunkName: "PDPAccordionV2" */ "./PDPAccordionV2"));
const PDPContactUs = dynamic(() => import(/* webpackChunkName: "PDPContactUs" */ "./PDPContactUs"));
const PDPDisclaimer = dynamic(() => import(/* webpackChunkName: "PDPDisclaimer" */ "./PDPDisclaimer"));
const PDPDetails = dynamic(() => import(/* webpackChunkName: "PDPDetails" */ "./PDPFinerAndKeyBenfits"));
const PDPFrequentlyBroughtV2 = dynamic(
  () => import(/* webpackChunkName: "PDPFrequentlyBroughtV2" */ "@libComponents/PDP/PDPFrequentlyBroughtV2")
);

const ModuleCarousel5 = dynamic(() => import(/* webpackChunkName: "ModuleCarousel5" */ "./ModuleCarouselv5"));
const PDPSubFooter = dynamic(() => import(/* webpackChunkName: "PDPSubFooter" */ "./PDPSubFooter"));

const CustomerQuestionV2 = dynamic(() => import(/* webpackChunkName: "CustomerQuestionV2" */ "./CustomerQuestionV2"));
const PDPReviewV2 = dynamic(() => import(/* webpackChunkName: "PDPReviewV2" */ "./PDPReviewV2"));
const PDPRecentlyViewedCarouselV2 = dynamic(
  () => import(/* webpackChunkName: "PDPRecentlyViewedCarouselV2" */ "./PDPRecentlyViewedCarouselV2")
);
const InstaStoryWidget = dynamic(() => import(/* webpackChunkName: "InstaStoryWidget" */ "./InstaStoryWidget"));
const ModuleCarousel12 = dynamic(
  () => import(/* webpackChunkName: "ModuleCarousel12" */ "@libComponents/HomeWidgets/ModuleCarousel12-homewidget")
);
const PhotoSlurpHomeWidget = dynamic(
  () => import(/* webpackChunkName: "PhotoSlurpHomeWidget" */ "@libComponents/HomeWidgets/PhotoSlurp-homewidget")
);
const PDPTestimonials = dynamic(
  () => import(/* webpackChunkName: "PDPTestimonials" */ "@libComponents/PDP/PDPWidgetComponents/PDPTestimonials")
);

const MultipleBanner = dynamic(() => import("@libComponents/HomeWidgets/MultipleBanner-homewidget" /* webpackChunkName: "12-homewidget" */));

const PDPWidgets = ({ product, widget }: { product: PDPProd; widget: any }) => {
  const [widgetData, setWidgetData] = useState(widget?.widget);
  const { ref, inView } = useInView({ threshold: 0 });
  const [skip, setSkip] = useState(widgetData?.length);

  useEffect(() => {
    if (inView && widget?.count > widgetData?.length) {
      const widgetApi = new WidgetAPI();

      widgetApi
        .getWidgets({ where: { slugOrId: "mobile-site-pdp-widgetsv2" } }, 10, skip)
        .then(({ data: widgetRes }) => {
          setWidgetData([...widgetData, ...widgetRes?.data?.data?.widget]);
          setSkip(skip + 10);
        })
        .catch(() => null);
    }
  }, [product?.id, inView]);

  const PDPWidgetGroup: any = (item: any,index:number) => {
    switch (item?.customParam) {
      case "pdp-independent-story": {
        return <InstaStoryWidget item={item} productSku={product.sku} />;
      }
      case "pdp-key-benfits": {
        return <PDPDetails product={product} type="keyBenefits" />;
      }
      case "pdp-finner-details": {
        return <PDPDetails product={product} type="finerDetails" />;
      }
      case "pdp-proven-result": {
        return <PDPDetails product={product} type="provenResults" />;
      }
      case "pdp-accordion": {
        return <PDPAccordionV2 product={product} />;
      }
      case "pdp-ratings-reviews": {
        return <PDPReviewV2 product={product} />;
      }
      case "pdp-customer-question": {
        return <CustomerQuestionV2 product={product} />;
      }
      case "pdp-recenlty-viewed-carousel": {
        return <PDPRecentlyViewedCarouselV2 icid={PDP_ICID} productId={product.id} />;
      }
      case "pdp-frequntly-bought-togther": {
        return <PDPFrequentlyBroughtV2 product={product} item={item} />;
      }
      case "module-carousel-5": {
        return <ModuleCarousel5 icid={PDP_ICID} productSKU={product?.sku} item={item} />;
      }
      case "pdp-disclimer": {
        return <PDPDisclaimer />;
      }
      case "pdp-contact-us": {
        return <PDPContactUs />;
      }
      case "pdp-sub-footer": {
        return <PDPSubFooter />;
      }
      case "pdp-photoslurrp-carousel": {
        return <PhotoSlurpHomeWidget item={item} productSku={product.sku} isNewDesign={true} />;
      }
      case "pdp-testimonials": {
        return <PDPTestimonials product={product} />;
      }
      case "multiple-banner": {
        return <MultipleBanner key={item.id} item={item} icid={PDP_ICID} widgetIndex={index} />;
      }
      case "module-carousel-12": {
        return <ModuleCarousel12 item={item} widgetIndex={index} icid={PDP_ICID} />;
      }

      default:
        break;
    }
  };

  /* */

  if (!widgetData?.length) {
    return null;
  }

  return (
    <section ref={ref}>
      {widgetData?.map((item: any,index:number) => {
        return (
          <LazyHydrate whenIdle key={item?.id}>
            {PDPWidgetGroup(item,index)}
          </LazyHydrate>
        );
      })}
    </section>
  );
};

export default PDPWidgets;
