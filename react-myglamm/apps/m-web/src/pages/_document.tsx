/**
 *  _document is only rendered on the server side and not on the client side
 *  Event handlers like onClick can't be added to this file
 */
import * as React from "react";
import Document, { Html } from "next/document";

import { AMPGlobalStyles } from "@libStyles/TSStyles/amp-global";

import { getWebsiteDir } from "@libUtils/getWebsiteDir";

import { langLocale } from "@typesLib/APIFilters";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

import AMPHead from "@libComponents/Document/AmpHead";
import AmpWrap from "@libComponents/Document/AmpWrap";
import NonAMPHead from "@libComponents/Document/NonAMPHead";
import DocumentCommon from "@libComponents/Document/DocumentCommon";

import { getVendorGlobalStyles } from "@libStyles/TSStyles/vendorStyles";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {ctx.pathname.includes("/amp") && <style dangerouslySetInnerHTML={{ __html: `${AMPGlobalStyles}` }} />}
        </>
        //amp-custom style
      ),
    };
  }

  render() {
    /* Getting Language from Next's Data */
    const { __NEXT_DATA__ } = this.props;
    const { locale, props } = __NEXT_DATA__ || { locale: "en-in" };

    return (
      <Html translate="no" dir={getWebsiteDir(locale as langLocale)}>
        <AmpWrap ampOnly={<AMPHead />} />

        {/* VENDOR STYLEs */}
        <AmpWrap nonAmp={<style>{getVendorGlobalStyles(props.headers.vendor)}</style>} />

        {/* @ts-ignore */}
        <AmpWrap nonAmp={<NonAMPHead />} />

        <body>
          <DocumentCommon __NEXT_DATA__={__NEXT_DATA__} />

          <AmpWrap
            ampOnly={
              <React.Fragment>
                <amp-analytics
                  config={`https://www.googletagmanager.com/amp.json?id=${GBC_ENV.NEXT_PUBLIC_GTM_KEY_AMP}&gtm.url=SOURCE_URL`}
                  data-credentials="include"
                />
                <amp-analytics type="facebookpixel" id="facebook-pixel">
                  <script
                    type="application/json"
                    dangerouslySetInnerHTML={{
                      __html: `
                      {
                        "vars": {
                          "pixelId": "${GBC_ENV.NEXT_PUBLIC_FACEBOOK_PIXEL_KEY}"
                        },
                        "triggers": {
                          "trackPageview": {
                            "on": "visible",
                            "request": "pageview"
                          },
                          "formSubmit": {
                            "on": "amp-form-submit-success",
                            "request": "event",
                            "vars": {
                              "eventName": "Add your event name here"
                            }
                          }
                        }
                      }`,
                    }}
                  />
                </amp-analytics>
              </React.Fragment>
            }
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
