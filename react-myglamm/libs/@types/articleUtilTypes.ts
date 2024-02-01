import { LifeStageSlug } from "./lifestageTypes";
export type UserType = {
  user_slug: string;
  user_nicename: string;
  display_name: string;
  description: string;
  first_name: string;
  last_name: string;
  avatar: string;
  user_link: string;
  article_count: number;
};

export interface LearnPageServerInterface {
  trendingReads: object[];
  freshReads: object[];
  articlesList: object[];
  serverLang: string;
  defaultFilterUsed: object;
  serverLifestageId: number;
  serverSlug: string;
  isMobileView: boolean;
  pageNo: number;
  totalItems: number;
}

export interface LifeStageInterface {
  id: number;
  name: string;
  pinkIcon: string;
  whiteIcon: string;
  slug: LifeStageSlug;
  title: string;
  dateInput: string;
  options: string;
  text: string;
}

export interface ArticleCardV2Interface {
  bannerImage: string;
  description: string;
  authorName: string;
  likeCount?: number;
  routePath?: string;
  isNextImage?: boolean;
  isSSR?: boolean;
  createdAt: Date;
  readTime?: number;
  isHomeArticle?: boolean;
}

export interface ArticleCardSectionV2Interface {
  articleDetails: any;
  isSSR: boolean;
  enableAds?: boolean;
  adSlotData?: any;
}
