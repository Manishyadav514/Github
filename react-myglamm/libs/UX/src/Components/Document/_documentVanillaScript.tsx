import React, { Fragment } from "react";

import { LOCALSTORAGE, XTOKEN } from "@libConstants/Storage.constant";

const DocVaniallaScript = () => {
  const apiUrl = process.env.NEXT_PUBLIC_APIV2_URL;

  return (
    <Fragment>
      <link rel="preconnect" href="https://acl.mgapis.com/" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://acl.mgapis.com/" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
              const cookies = document.cookie;
              if(!location.href.includes("/unAuthorized") && cookies.includes("fingerPrintUser=bad")){
                location.replace("/unAuthorized");
              }

              (function() {

                window.dataLayer = window.dataLayer || [];

                // prevent dom nodes leaking
                window.dataLayer.push = function (event) {
                  if(event['gtm.element']) {
                    event['gtm.element'] = event['gtm.element'].cloneNode(true);
                  }
                  return Array.prototype.push.apply(this, arguments);
                }

                window.evars = window.evars || {};
                window.digitalData = window.digitalData || {};
                window._aaq = window._aaq || [];
                (function() {
                  if (typeof globalThis === 'object') return;
                  Object.defineProperty(Object.prototype, '__magic__', {
                    get: function() {
                      return this;
                    },
                    configurable: true
                  });
                  __magic__.globalThis = __magic__; // lolwat
                  delete Object.prototype.__magic__;
                }());
                window.requestIdleCallback = window.requestIdleCallback ||
                  function (cb) {
                    return setTimeout(function () {
                      var start = Date.now();
                      cb({ 
                        didTimeout: false,
                        timeRemaining: function () {
                          return Math.max(0, 50 - (Date.now() - start));
                        }
                      });
                    }, 1);
                  };

                window.cancelIdleCallback = window.cancelIdleCallback ||
                  function (id) {
                    clearTimeout(id);
                  };

                function isLocalStorageAvailable(){
                    var test = 'test';
                    try {
                        localStorage.setItem(test, test);
                        localStorage.removeItem(test);
                        return true;
                    } catch(e) {
                        return false;
                    }
                }
                window.isLocalStorageAvailable = isLocalStorageAvailable;
                if (!isLocalStorageAvailable()) {
                  return;
                }

                if ("xtoken" in localStorage) {
                  localStorage.setItem("${XTOKEN()}", localStorage.getItem("xtoken"));
                  localStorage.removeItem("xtoken");
                }

                if (("${XTOKEN()}" in localStorage && !("${
            LOCALSTORAGE.MEMBER_ID
          }" in localStorage)) || (!("${XTOKEN()}" in localStorage) && "${LOCALSTORAGE.MEMBER_ID}" in localStorage)) {
                  localStorage.clear();
                }
                
                function eargerHandShakeCall() {
                  var xhr = new XMLHttpRequest();
                  xhr.open('POST', "${apiUrl}/tokenHandshake", true);
                  xhr.setRequestHeader('Content-Type', 'application/json');
                  xhr.setRequestHeader('apikey', '${process.env.NEXT_PUBLIC_API_KEY}');
                  xhr.onreadystatechange = function(res) {
                    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                      try {
                        localStorage.setItem("${XTOKEN()}", JSON.parse(this.response).token);
                        localStorage.removeItem("${LOCALSTORAGE.CORS_TOKEN}");
                        localStorage.removeItem("${LOCALSTORAGE.CARTID}");
                      } catch(e) {
                        //no-op
                      }
                    }
                    xhr.send([JSON.stringify({idToken: localStorage.getItem("${LOCALSTORAGE.CORS_TOKEN}")})]);
                  }
                }
                
                if("${LOCALSTORAGE.CORS_TOKEN}" in localStorage && "${LOCALSTORAGE.MEMBER_ID}" in localStorage){
                  eargerHandShakeCall();
                }

              })();
              `,
        }}
      />
    </Fragment>
  );
};

export default DocVaniallaScript;
