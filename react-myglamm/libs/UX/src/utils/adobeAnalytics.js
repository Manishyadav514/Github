import { adobeClick } from "./appm-click";
import { experimentVars, linkTrackEvents, linkTrackVars, buildProductString } from "./appm-common";
import { GA4Event } from "@libUtils/analytics/gtm";
import { adobeView } from "./appm-pageview";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

// const captureDataLayer = digitalData => {
//   var ddebug = JSON.stringify(digitalData);
//   s.eVar191 = ddebug.substr(0, 249);
//   s.eVar192 = ddebug.substr(249, 250);
//   s.eVar193 = ddebug.substr(499, 250);
//   s.eVar194 = ddebug.substr(749, 250);
//   s.eVar195 = ddebug.substr(999, 250);
//   s.eVar196 = ddebug.substr(1249, 250);
//   s.eVar197 = ddebug.substr(1499, 250);
//   s.eVar198 = ddebug.substr(1749, 250);
//   s.eVar199 = ddebug.substr(1999, 250);
//   s.eVar200 = ddebug.substr(1249, 250);
// };
const init = reportSuite => {
  var v_orgId = "BA3F474F5D3AC9CE0A495ED6@AdobeOrg";
  var s_account = reportSuite;
  var s_trackingServer = "myglamm.sc.omtrdc.net";
  var visitor = window.Visitor.getInstance(v_orgId, {
    overwriteCrossDomainMCIDAndAID: true,
  });
  visitor.trackingServer = s_trackingServer;
  var s = window.s_gi(s_account);
  s.trackingServer = s_trackingServer;
  s.account = s_account;
  s.trackingServer = s_trackingServer;
  s.trackingServerSecure = s_trackingServer;
  s.visitor = visitor;
  visitor.getMarketingCloudVisitorID();
  s.usePlugins = true;
  s.useBeacon = true;
  s.doPlugins = function (s) {
    s.pageURL = "D=c11";

    s.prop4 = s.getPreviousValue(s.pageName, "gpv_pn"); // TODO: test this
    s.prop11 = document.URL;
    s.prop39 = s.getNewRepeat(30, "s_getNewRepeat");

    s.eVar11 = "D=c11";
    s.eVar16 = "D=mid";
    s.eVar39 = "D=c39";
    s.eVar63 = s.pageName;
    s.eVar66 = document.URL.split("?")[0];

    var params = new URLSearchParams(window.location.search);
    var utmsource = params.get("utm_source") || "";
    var utmmedium = params.get("utm_medium") || "";
    var utmcampaign = params.get("utm_campaign") || "";
    var utmcontent = params.get("utm_content") || "";
    var utmterm = params.get("utm_term") || "";
    var gclid = params.get("gclid") || "";
    var rc = params.get("rc");
    if ((utmsource || utmmedium || utmcampaign || utmcontent || utmterm || gclid) && !s.campaign) {
      s.campaign =
        utmsource.replaceAll(":", "_") +
        ":" +
        utmmedium.replaceAll(":", "_") +
        ":" +
        utmcampaign.replaceAll(":", "_") +
        ":" +
        utmterm.replaceAll(":", "_") +
        ":" +
        utmcontent.replaceAll(":", "_") +
        ":" +
        gclid;
      s.eVar65 =
        "source=" +
        utmsource.replaceAll(":", "_") +
        ":" +
        "medium=" +
        utmmedium.replaceAll(":", "_") +
        ":" +
        "campaign=" +
        utmcampaign.replaceAll(":", "_");
    }
    if (rc) {
      s.eVar190 = rc;
    }

    experimentVars.map(i => {
      s["eVar" + i] = window.evars["evar" + i];
    });

    s.linkTrackVars = linkTrackVars.join(",");
    s.linkTrackEvents = linkTrackEvents.join(",");
  };

  s.getNewRepeat = new Function(
    "d",
    "cn",
    "" +
      "var s=this,e=new Date(),cval,sval,ct=e.getTime();d=d?d:30;cn=cn?cn:" +
      "'s_nr';e.setTime(ct+d*24*60*60*1000);cval=s.c_r(cn);if(cval.length=" +
      "=0){s.c_w(cn,ct+'-New',e);return'New';}sval=s.split(cval,'-');if(ct" +
      "-sval[0]<30*60*1000&&sval[1]=='New'){s.c_w(cn,ct+'-New',e);return'N" +
      "ew';}else{s.c_w(cn,ct+'-Repeat',e);return'Repeat';}"
  );
  /*
   * Utility Function: split v1.5 (JS 1.0 compatible)
   */
  s.split = new Function(
    "l",
    "d",
    "" +
      "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" +
      "++]=l.substring(0,i);l=l.substring(i+d.length);}return a"
  );

  /*
   * Plugin: getPreviousValue_v1.0 - return previous value of designated
   * variable (requires split utility)
   */
  s.getPreviousValue = new Function(
    "v",
    "c",
    "el",
    "" +
      "var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el" +
      "){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i" +
      "){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)" +
      ":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?" +
      "s.c_w(c,v,t):s.c_w(c,'no value',t);return r}"
  );
  /*
   * Utility Function: split v1.5 - split a string (JS 1.0 compatible)
   */
  s.split = new Function(
    "l",
    "d",
    "" +
      "var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x" +
      "++]=l.substring(0,i);l=l.substring(i+d.length);}return a"
  );

  /*
   * Plugin Utility: apl v1.1
   */
  s.apl = new Function(
    "l",
    "v",
    "d",
    "u",
    "" +
      "var s=this,m=0;if(!l)l='';if(u){var i,n,a=s.split(l,d);for(i=0;i<a." +
      "length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas" +
      "e()));}}if(!m)l=l?l+d+v:v;return l"
  );

  window.s = s;

  function adobeToGA4(type) {
    s.events?.split(",").map(e => {
      const [successEvent, _increment] = e.split("=");
      GA4Event([
        {
          event: `aa`,
          successEvent,
          increment: _increment,
          type: `${type}`,
        },
      ]);
    });
  }

  setInterval(() => {
    window._aaq
      ?.filter(e => !e.sent)
      .map(e => {
        if (e.type === "pageview") {
          e.sent = true;
          s.clearVars();
          // captureDataLayer(e.digitalData);
          adobeView(e.digitalData);
          adobeToGA4(e.type);
        }
        if (e.type === "click") {
          e.sent = true;
          s.clearVars();
          // captureDataLayer(e.digitalData);
          adobeClick(e.digitalData);
          adobeToGA4(e.type);
        }
      });
  }, 150);
};

export const initAdobeAnalytics = () => {
  try {
    const adobeScriptsLoadedInterval = setInterval(() => {
      if (window.Visitor) {
        init(GBC_ENV.NEXT_PUBLIC_ADOBE_REPORT_SUITE || "myglammdev");
        clearInterval(adobeScriptsLoadedInterval);
        console.log("Adobe Analytics initiated.");
      }
    }, 100);
  } catch (e) {
    console.error({ e });
  }
};
