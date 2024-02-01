import React from "react";
import dynamic from "next/dynamic";

const MultimediaSingleBanner = dynamic(() => import("@libComponents/TVC/multimedia-single-banner-homewidget"));
const HTMLContent = dynamic(() => import("@libComponents/HomeWidgets/HTMLContent-homewidget"));

const SideMenuWidgets = ({ widget, index, profile }: any) => {
  const metaData = widget?.meta?.widgetMeta ? JSON.parse(widget?.meta?.widgetMeta) : "";

  return (
    <>
      {((widget?.visibility === "login" && profile) ||
        (widget?.visibility === "guest" && !profile) ||
        widget?.visibility === "both") &&
        widget?.customParam === "multimedia-single-banner" && (
          <>
            {(profile?.memberType.typeName === metaData.type || !metaData) && (
              <div className="mb-2">
                <MultimediaSingleBanner item={widget} index={index} />
              </div>
            )}
          </>
        )}
      {widget?.customParam === "html-content" && <HTMLContent index={index} item={widget} />}
    </>
  );
};

export default SideMenuWidgets;
