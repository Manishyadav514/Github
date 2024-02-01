import * as React from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import LazyHydrate from "react-lazy-hydration";

const DynamicRenderer = ({ children, isBot, lazyLoadThreshold = 0 }: any) => {
  return React.Children.map(children, child => {
    if (isBot) {
      return <LazyHydrate whenVisible>{child}</LazyHydrate>;
    } else {
      return (
        <LazyLoadComponent style={{ display: "block" }} threshold={lazyLoadThreshold}>
          {child}
        </LazyLoadComponent>
      );
    }
  });
};
export default DynamicRenderer;
