export type Multimedia = {
  position: number;
  sliderText: string;
  targetLink: string;
  url: string;
  footerText: string;
  headerText: string;
  meta: any;
  bannerScore: number;
  score: number;
  startDate: string;
  id: string;
  viewCount: number;
  endDate: string;
  imageAltTitle: string;
  assetDetails: {
    url: string;
    name: string;
    type: "image" | "video";
    properties: { height: number; width: number };
  };
};

export type capBannerData = {
  [char in string]: {
    count: number;
    hide: boolean;
  };
};

export interface WidgetProps {
  widgets?: any[];
  cssClass?: string;
  closeMenu?: () => void;
  additionalData?: any;
  slugOrId?: string;
  expId?: string;
  abExp?: string;
  disableSegment?: boolean;
  widgetPersonalization?: boolean;
  icidPrefix?: string;
}

export interface CBWidgetsProps {
  show: boolean;
  hide: () => void;
  widget: any;
}
