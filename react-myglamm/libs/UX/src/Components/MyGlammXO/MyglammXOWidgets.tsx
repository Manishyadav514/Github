import React from "react";
import dynamic from "next/dynamic";

const HtmlContent = dynamic(() => import("./html-content"));
const ModuleGrid3 = dynamic(() => import("./module-grid-3"));
const MultmediaCarousel1 = dynamic(() => import("./multimedia-carousel-1"));
const MultimediaCarousel6 = dynamic(() => import("./multimedia-carousel-6"));
const ModuleCarousel12 = dynamic(() => import("@libComponents/HomeWidgets/ModuleCarousel12-homewidget"));

const MyglammXOWidgets = ({ widget, type }: any) => {
  switch (widget.customParam) {
    case "multimedia-carousel-6": {
      return <MultimediaCarousel6 data={widget} type={type} />;
    }
    case "module-grid-3": {
      return <ModuleGrid3 data={widget} />;
    }
    case "html-content": {
      return <HtmlContent item={widget} />;
    }
    case "multimedia-carousel-1": {
      return <MultmediaCarousel1 item={widget} />;
    }
    case "module-carousel-12": {
      return <ModuleCarousel12 item={widget} />;
    }

    default: {
      return null;
    }
  }
};

export default MyglammXOWidgets;
