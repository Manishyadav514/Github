import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import { getClientQueryParam } from "./_apputils";
import { getVendorCode } from "./getAPIParams";

export const loadThirdPartyScripts = () => {
  /**
   * Load GTM, GA and OPT scripts only if their key present in env
   * variables
   */
  const loadScripts: any = ({ gtmDelay = "3800", gaDelay = "4000" }) => {
    const initGTM: string = getClientQueryParam("initGTM") || gtmDelay;
    const initGA: string = getClientQueryParam("initGA") || gaDelay;
    const NOTP = getClientQueryParam("NOTP");
    if (!NOTP) {
      const GTM_KEY = GBC_ENV.NEXT_PUBLIC_GTM_KEY;

      if (GTM_KEY) {
        window.eval(`(function(){
          setTimeout(function(){
            window.requestIdleCallback(function() {
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),
                dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_KEY}');
            });
          }, parseInt(${initGTM}));
        })();
      `);
      }
      if (process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
        window.eval(`(function(){
          setTimeout(function(){
            window.requestIdleCallback(function() {
              (function(){
                j=document.createElement("script");
                j.async=true;
                j.src='https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_KEY}';
                document.body.appendChild(j);
              })();
            });
          }, parseInt(${initGA}));
        })();
      `);
      }
      if (getVendorCode() === "bbc") {
        window.eval(`(function(){
          setTimeout(function(){
            window.requestIdleCallback(function() {
              (function(){
                j=document.createElement("script");
                j.async=true;
                j.src='https://securepubads.g.doubleclick.net/tag/js/gpt.js';
                document.body.appendChild(j);
              })();
            });
          }, 200);
        })();
      `);
      }
    }
  };

  // dont delay scripts if its
  // 1. safari since this window onload doesn't work here
  // 2. order summary page
  // as the user lands here after making the payment
  // and we want to have critical events fired asap
  const chromeAgent = navigator?.userAgent.indexOf("Chrome") > -1;
  const safariAgent = navigator?.userAgent.indexOf("Safari") > -1;
  const is_safari: any = !chromeAgent && safariAgent;
  const dontDelayScripts: any =
    is_safari ||
    window.location.pathname === "/order-summary" ||
    window.location.pathname === "/login" ||
    window.location.pathname === "/shopping-bag" ||
    window.location.pathname.includes("bigg-boss");
  if (dontDelayScripts) {
    loadScripts({ gtmDelay: "0", gaDelay: "0", optimizeDelay: "0" });
  } else {
    window.addEventListener("load", loadScripts);
  }
};
