import React from "react";
import HtmlContent from "./html-content";

import ModuleGrid3 from "./module-grid-3";
import MultmediaCarousel1 from "./multimedia-carousel-1";
import MultimediaCarousel6 from "./multimedia-carousel-6";

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
    default: {
      return null;
    }
  }
};

export default MyglammXOWidgets;
