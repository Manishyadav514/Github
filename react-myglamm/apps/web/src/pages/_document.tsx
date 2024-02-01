/**
 *  _document is only rendered on the server side and not on the client side
 *  Event handlers like onClick can't be added to this file
 */
import * as React from "react";
import Document, { Html } from "next/document";

import { getWebsiteDir } from "@libUtils/getWebsiteDir";

import { langLocale } from "@typesLib/APIFilters";

import NonAMPHead from "@libComponents/Document/NonAMPHead";
import DocumentCommon from "@libComponents/Document/DocumentCommon";

import { getVendorGlobalStyles } from "@libStyles/TSStyles/vendorStyles";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: <>{initialProps.styles}</>,
    };
  }

  render() {
    /* Getting Language from Next's Data */
    const { __NEXT_DATA__ } = this.props;
    const { locale, props } = __NEXT_DATA__ || { locale: "en-in" };

    return (
      <Html translate="no" dir={getWebsiteDir(locale as langLocale)}>
        <NonAMPHead />

        <style>{getVendorGlobalStyles(props.headers.vendor)}</style>

        <body>
          <DocumentCommon __NEXT_DATA__={__NEXT_DATA__} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
