interface Window {
  // add you custom properties and methods
  YT?: any;
  onYouTubeIframeAPIReady?: any;
  digitalData: {
    common: {
      assetType: string;
      channel?: string;
      pageName: string;
      subSection?: string;
      subSection1?: string;
      subSection2?: string;
      flowName?: "";
      platform: string;
      newAssetType?: string;
      pageLocation: string;
      newPageName?: string;
      technology: string;
      ctaName?: string;
      linkName?: string;
      linkPageName?: string;
      newLinkPageName?: string;
      language?: string;
      upsellProductSKUs?: string;
    };
    user: any;
    dsRecommendationWidget?: any;
    experimentVariant1?: any;
  };
  __NEXT_REDUX_STORE__: any;
  SimplFingerprint: {
    generateFingerprint: (phone: string, email: string, cb: (payload: any) => any) => void;
  };
  dataLayer: any;
  fire: any;
  google_optimize?: {
    get: (experimentId: string) => string;
  };
  webengage?: any;
  eval?: any;
  requestIdleCallback?: any;
  ResizeObserver?: any;
  __satelliteLoaded?: boolean;
  ymConfig?: any;
  YellowMessengerPlugin?: any;
  /**
   * Adobe Satellite Object
   */
  _satellite?: {
    /**
     * Tracking Function for calling Adobe Events
     */
    track: (event: string) => any;
  };
}
/**
 * Module namespace for importing Images
 */
declare module "*.webp" {
  const value: any;
  export default value;
}
declare module "*.png" {
  const value: any;
  export = value;
}
declare module "*.jpg" {
  const value: any;
  export = value;
}
declare module "*.svg" {
  const value: any;
  export = value;
}
// The elements you list here will be accepted, attributes don't matter
declare namespace JSX {
  interface IntrinsicElements {
    "amp-img": any;
  }
  interface IntrinsicElements {
    "amp-accordion": any;
  }
  interface IntrinsicElements {
    "amp-youtube": any;
  }
  interface IntrinsicElements {
    "amp-lightbox": any;
  }
  interface IntrinsicElements {
    "amp-analytics": any;
  }
  interface IntrinsicElements {
    "amp-iframe": any;
  }
  interface IntrinsicElements {
    "amp-instagram": any;
  }
  interface IntrinsicElements {
    "amp-pinterest": any;
  }
}
declare module "react-payment-inputs" {
  const PaymentInputsWrapper: any;
  const usePaymentInputs: any;
  export { PaymentInputsWrapper, usePaymentInputs };
}
declare module "unescape" {
  const decode: (value: string) => string;
  export default decode;
}
declare module "@typeform/embed" {
  const typeformEmbed: any;
  type makePopup = {
    open: () => void;
    close: () => void;
    element: any;
  };
  const makePopup = (url: string, options: any): makePopup => {};
  export { makePopup };
  export default typeformEmbed;
}
declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
