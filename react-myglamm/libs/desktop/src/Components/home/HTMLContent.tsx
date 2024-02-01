import React, { useRef, useEffect } from "react";
import InnerHTML from 'dangerously-set-html-content'
import HomeWidgetLabel from "./HomeWidgetLabel";

const HTMLContent = ({ data, sku }: any) => {
  const myRef = useRef(null);
  const photoslurpId = data.meta?.widgetMeta;

  /* Appending PhotoSlurp Script into the DOM, if WidgetId or PhotoSlurpId is Found in Meta Data */
  useEffect(() => {
    if (myRef.current && photoslurpId && photoslurpId !== "") {
      const psWidget = document.getElementsByTagName("ps-widget");

      const photoSlrupCotainer = myRef.current as HTMLDivElement;

      if (psWidget) {
        photoSlrupCotainer.innerHTML = "";
      }
      /* PhotoSlurp Container */
      const widget = document.createElement("ps-widget");
      widget.setAttribute("data-config", photoslurpId);

      /* PhotoSlurp Script */
      const script = document.createElement("script");
      script.setAttribute("async", "true");
      script.setAttribute("src", "https://static.photoslurp.com/widget/v3/loader.js");

      /* If SKU is passed, append this filter parameters into the DOM */
      if (sku) {
        const skuFilter = document.createElement("script");
        skuFilter.innerHTML = ` window.photoSlurpWidgetSettings = window.photoSlurpWidgetSettings || {};photoSlurpWidgetSettings["${photoslurpId}"] = {lang: "en",productId: ["${sku}"]};`;
        photoSlrupCotainer.appendChild(skuFilter);
      }

      photoSlrupCotainer.appendChild(widget);
      photoSlrupCotainer.appendChild(script);
    }
  }, [myRef]);

  return (
    <section className="max-w-screen-xl my-14 mx-auto w-full homeWidget">
      {photoslurpId && photoslurpId !== "" ? (
        <>
          <HomeWidgetLabel title={data.commonDetails.title} />
          <div className="flex justify-between text-sm w-full">
            <p className="w-1/3 text-lg">Show your look</p>
            <p className="w-1/4 text-center">
              Upload your favorite makeup looks on instagtam with &nbsp;
              <span className="text-color1">#myglamm</span>&nbsp; for a chance to featured!
            </p>
            <p className="text-right w-1/3">
              Follow us on Instagtam <br />
              <span className="text-color1">#myglamm</span>
            </p>
          </div>
          <div className="ps-container" ref={myRef} />
        </>
      ) : (
        <InnerHTML className="bg-white p-2" html={data.commonDetails?.description} />
      )}
    </section>
  );
};

export default HTMLContent;
