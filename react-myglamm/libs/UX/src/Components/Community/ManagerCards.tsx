import React from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import WidgetLabel from "@libComponents/HomeWidgets/WidgetLabel";

import { IS_DESKTOP } from "@libConstants/COMMON.constant";

import HomeWidgetLabel from "@libDesktop/Components/home/HomeWidgetLabel";

import { SHOP } from "@libConstants/SHOP.constant";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const communityManagers = {
  mgp: [
    {
      image: "https://files.babychakra.com/site-images/original/Kanchan-MyGlamm.jpg",
      name: "Kanchan Kumare",
      subText: "",
    },
    {
      image: "https://files.babychakra.com/site-images/original/Manisha-MyGlamm.jpg",
      name: "Manisha L",
      subText: "",
    },
  ],
  myglamm: [
    {
      image: "https://files.babychakra.com/site-images/original/Kanchan-MyGlamm.jpg",
      name: "Kanchan Kumare",
      subText: "",
    },
    {
      image: "https://files.babychakra.com/site-images/original/Manisha-MyGlamm.jpg",
      name: "Manisha L",
      subText: "",
    },
  ],
  bbc: [
    {
      image: "https://files.babychakra.com/site-images/original/Barkha-BBC.jpg",
      name: "Barkha Chawla",
      subText: "",
    },
    {
      image: "https://files.babychakra.com/site-images/original/Trisha-BBC.jpg",
      name: "Trisha Dey",
      subText: "",
    },
  ],
  orh: [
    {
      image: "https://files.babychakra.com/site-images/original/Komal--Organic-Harvest.jpg",
      name: "Komal Chawla",
      subText: "",
    },
  ],
  srn: [
    {
      image: "https://files.babychakra.com/site-images/original/Pooja-Sirona.jpg",
      name: "Pooja Maheshwary",
      subText: "",
    },
    {
      image: "https://files.babychakra.com/site-images/original/Subham-Sirona.jpg",
      name: "Subham Sinha",
      subText: "",
    },
  ],
};

const ManagerCards = () => {
  return (
    <div className={IS_DESKTOP ? "my-4" : ""}>
      {IS_DESKTOP ? <HomeWidgetLabel title="Meet Our Managers" /> : <WidgetLabel title={"Meet Our Managers"} />}

      <div className={`bg-color3 p-4 flex  space-x-6 text-left ${IS_DESKTOP ? "hide-scrollbar-css" : ""}`}>
        {/* @ts-ignore */}
        {communityManagers[SHOP.SITE_CODE].map((item: any) => {
          return (
            <div key={item.name}>
              <ImageComponent
                alt={item.name}
                src={item.image || DEFAULT_IMG_PATH()}
                className={IS_DESKTOP ? " max-w-[130px] rounded-t-full" : "min-w-[130px] rounded-t-full"}
              />
              <p className={IS_DESKTOP ? "text-sm font-semibold mt-2" : "text-13 font-semibold mt-2"}>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManagerCards;
