import React, { useEffect, useState, ReactElement } from "react";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import MyglammXOWidgets from "@libComponents/MyGlammXO/MyglammXOWidgets";

import { ADOBE } from "@libConstants/Analytics.constant";

import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import SurveyLayout from "@libLayouts/SurveyLayout";

const MyGlammXO = () => {
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    const myGlammXOWhere = {
      where: {
        slugOrId: "mobile-site-myglammxo-landing-page",
      },
    };

    const widgetApi = new WidgetAPI();
    widgetApi.getWidgets(myGlammXOWhere).then(({ data: res }) => {
      setWidgets(res?.data?.data?.widget);
      // call custom accordian js function from window object
      try {
        setTimeout(() => {
          (window as any).activateFaq();
        }, 2000);
        // eslint-disable-next-line no-empty
      } catch (error: any) {}
    });
  }, []);

  // Adobe Analytics[79] - Page Load - MyGlammXO Page
  useEffect(() => {
    const pageload = {
      common: {
        pageName: `web|${ADOBE.ASSET_TYPE.MYGLAMMXO}`,
        newPageName: ADOBE.ASSET_TYPE.MYGLAMMXO,
        subSection: ADOBE.ASSET_TYPE.MYGLAMMXO,
        assetType: ADOBE.ASSET_TYPE.MYGLAMMXO,
        newAssetType: ADOBE.ASSET_TYPE.MYGLAMMXO,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    ADOBE_REDUCER.adobePageLoadData = pageload;
  }, []);

  return (
    <div style={{ backgroundColor: "#fddcdd" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .swrapper {
                  /* font-family: "din-2014" !important; */
                }
                .swrapper .pull-left {
                  float: left;
                }
                .swrapper .glammInsider-faq {
                  padding-bottom: 49px;
                  background: #fff;
                }
                .swrapper .fullwidth {
                  width: 100%;
                }
                .swrapper .for-m-mob-site {
                  display: block;
                }
                .w-full {
                  width: 100%;
                }
                .text-center {
                  text-align: center;
                }
                .mt-10 {
                  margin-top: 2.5rem;
                }
                .font-semibold {
                  font-weight: 600;
                }
                .swrapper .glammInsider-faq .cust-accordrion-panel-wrapper {
                  padding: 8px 0;
                  border-color: #e4e4e4;
                }
                .swrapper .cust-accordrion-panel-wrapper {
                  padding: 10px 10px 10px 0 !important;
                  float: left;
                  width: 100%;
                  border-bottom: 1px solid #000;
                }
                .swrapper .glammInsider-faq .cust-accordrion-panel-wrapper .custom-accordion {
                  font-weight: 400;
                  font-size: 14px;
                  padding: 15px 25px 15px 20px;
                  letter-spacing: 0.5px;
                }
                .swrapper .custom-accordion {
                  cursor: pointer;
                  padding: 15px 25px 15px 0;
                  width: 100%;
                  border: none;
                  text-align: left;
                  outline: none;
                  font-size: 18px;
                  font-weight: 600;
                  transition: 0.4s;
                  background: none;
                  position: relative;
                }
                .swrapper .glammInsider-faq .col-xs-12 {
                  width: 100%;
                  max-width: 100%;
                  flex: none;
                  padding: 0;
                }
                .swrapper .row {
                  max-width: 767px;
                  width: 100%;
                  margin: 0 auto;
                  padding: 0;
                }

                .swrapper .cust-accordrion-panel {
                  background-color: white;
                  /* max-height: 0; */
                  float: left;
                  width: 100%;
                  overflow: hidden;
                  padding: 8px 15px;
                  transition: max-height 0.2s ease-out;
                }
                .swrapper
                  .glammInsider-faq
                  .cust-accordrion-panel-wrapper
                  .custom-accordion:after {
                  right: 6px;
                }
                .swrapper .landing-page:after {
                  color: #9372db;
                }

                .swrapper .custom-accordion:after {
                  content: "\\002b";
                  color: #ff9094;
                  font-weight: 600;
                  position: absolute;
                  right: 0;
                  font-size: 28px;
                  top: 6px;
                  margin: auto;
                }
                .swrapper .glammInsider-faq .cust-accordrion-panel-wrapper .custom-accordion {
                  font-weight: 400;
                  font-size: 14px;
                  padding: 15px 25px 15px 20px;
                  letter-spacing: 0.5px;
                }

                .swrapper .custom-accordion.active,
                .swrapper .custom-accordion:hover {
                  color: #ff9094;
                }
                .swrapper .cust-accordrion-panel-wrapper.active .custom-accordion:after {
                  content: "\\2013";
                }

                .swrapper
                  .glammInsider-faq
                  .cust-accordrion-panel-wrapper
                  .custom-accordion:after {
                  right: 6px;
                }
                .swrapper .landing-page:after {
                  color: #9372db;
                }
                .swrapper .custom-accordion:after {
                  content: "\\002b";
                  color: #ff9094;
                  font-weight: 600;
                  position: absolute;
                  right: 0;
                  font-size: 28px;
                  top: 6px;
                  margin: auto;
                }
                .cust-accordrion-panel {
                  display: none;
                }
                `,
        }}
      />
      <div aria-hidden id="widget-wrapper">
        {widgets?.map((widget: any) => (
          <MyglammXOWidgets key={widget.id} widget={widget} />
        ))}
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `window.activateFaq = function() {
                  var acc = document.querySelectorAll(".cust-accordrion-panel-wrapper");
                  if (acc) {
                    acc.forEach(function (el) {
                      el.addEventListener("click", function (e) {
                        e.stopImmediatePropagation();
                        var panel = this.querySelector(".cust-accordrion-panel");
                        if (panel) {
                          this.classList.remove("active");
                          if (panel.style.display === "block") {
                            panel.style.display = "none";
                            this.classList.remove("active");
                          } else {
                            panel.style.display = "block";
                            this.classList.add("active");
                          }
                        }
                      });
                    });
                  }
                }`,
        }}
      />
    </div>
  );
};

MyGlammXO.getLayout = (children: ReactElement) => (
  <SurveyLayout header="" pageURL="myglammxo">
    {children}
  </SurveyLayout>
);

export default MyGlammXO;
