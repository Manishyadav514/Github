import React, { useState, useEffect, Fragment } from "react";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";

import GamificationShare from "./GamificationShare";

const GamificationFooter = () => {
  const [widgets, setWidgets] = useState([]);

  /* Widget's API Call */
  useEffect(() => {
    const widgetApi = new WidgetAPI();

    widgetApi
      .getWidgets({ where: { slugOrId: "mobile-site-gamification-landing-page" } })
      .then(({ data: res }) => setWidgets(res?.data?.data?.widget));
  }, []);

  return (
    <Fragment>
      <style>
        {`
         summary:after {
          margin: auto 0;
          content: "+";
          font-size: 16px;
          color: #f70665;
          transition: all 0.3s ease;
          position: absolute;
          right: -48px;
          transform-origin: center;
        }
        details[open] summary:after {
          content: "-";
        }
       `}
      </style>

      <div className="bg-color3">
        {widgets?.[0] && <MyglammXOWidgets widget={widgets[0]} />}

        <div className="pt-2 px-4">
          <GamificationShare />
        </div>
      </div>

      {widgets?.[1] && widgets.slice(1).map((widget: any) => <MyglammXOWidgets key={widget.id} widget={widget} />)}
    </Fragment>
  );
};

export default GamificationFooter;
