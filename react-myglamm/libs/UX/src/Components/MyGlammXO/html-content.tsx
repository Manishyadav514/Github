import React, { useEffect } from "react";

function HtmlContent({ item }: any) {
  /* Activating FAQ - Accordions */
  useEffect(() => {
    const scriptHTML = `window.activateFaq = function() {
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
      };
      setTimeout(() => window.activateFaq(), 1000);
    `;
    document.querySelector(".accdnScript")?.remove();
    const scriptEle = document.createElement("script");
    scriptEle.setAttribute("type", "text/javascript");
    scriptEle.setAttribute("class", "accdnScript");
    scriptEle.innerHTML = scriptHTML;
    document.body.appendChild(scriptEle);
  }, []);

  return (
    <div className="html-content">
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .swrapper .glammInsider-faq {
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
                  border-color: #ffc3d9;
                }
                .swrapper .cust-accordrion-panel-wrapper {
                  padding: 10px 10px 10px 0 !important;
                  width: 100%;
                  border-bottom: 1px solid #000;
                }
                .swrapper .glammInsider-faq .cust-accordrion-panel-wrapper .custom-accordion {
                  font-weight: 400;
                  font-size: 13.5px;
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
                  text-align: left;
                  float: left;
                  width: 100%;
                  overflow: hidden;
                  padding: 8px 15px;
                  transition: max-height 0.2s ease-out;
                  border-bottom: 1px solid #ffc3d9;
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
                  color: #ff3980;
                  font-weight: 400;
                  position: absolute;
                  right: 0;
                  font-size: 28px;
                  top: 6px;
                  margin: auto;
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
                  color: #ff3980;
                  font-weight: 400;
                  position: absolute;
                  right: 0;
                  font-size: 28px;
                  top: 6px;
                  margin: auto;
                }
                .cust-accordrion-panel {
                  display: none;
                }
                table {
                  margin-top: 16px;
                  font-size: 14px;
                }
                th, td {
                  border : 1px solid #000;
                  text-align: center;
                }
                `,
        }}
      />

      <div
        dangerouslySetInnerHTML={{
          __html: item.commonDetails.description,
        }}
      />
    </div>
  );
}

export default HtmlContent;
