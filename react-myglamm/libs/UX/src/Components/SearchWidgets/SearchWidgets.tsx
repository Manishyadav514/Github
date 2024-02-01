import * as React from "react";
import dynamic from "next/dynamic";

const Categories = dynamic(() => import("./Categories"));
const Chips = dynamic(() => import("./Chips"));
const ModuleCarousal4 = dynamic(() => import("./ModuleCarousal4"));

const SearchWigetsGroup = (item: any, index: number, getData?: void, onRequestClose?: void) => {
  switch (item.customParam) {
    case "chips": {
      return <Chips key={item.id} item={item} widgetIndex={index} getData={getData} onRequestClose={onRequestClose} />;
    }
    case "categories": {
      return <Categories key={item.id} item={item} widgetIndex={index} onRequestClose={onRequestClose} />;
    }
    case "module-carousel-4": {
      return <ModuleCarousal4 key={item.id} item={item} widgetIndex={index} onRequestClose={onRequestClose} />;
    }
    default: {
      return null;
    }
  }
};

function SearchWidgets({ widgets, getData, onRequestClose }: any) {
  return widgets?.map((item: any, index: number) => SearchWigetsGroup(item, index, getData, onRequestClose));
}

export default React.memo(SearchWidgets);
