export interface BabyNamesObject {
  statusID: number;
  _id: string;
  name: string;
  meaning: string;
  start_alphabet: string;
  gender: string;
  religion: string;
  region: string;
  vendorCode: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

export interface BabyNamesResponse {
  code: number;
  count: number;
  data: BabyNamesObject[];
}

export interface QuestionResponse {
  id: number;
  question: string;
  url: string;
}

export type MeaningPage = "MEANING";
export type ListingPage =
  | "GENDER"
  | "ALPHABET"
  | "GENDER_AND_ALPHABET"
  | "ORIGIN"
  | "ORIGIN_AND_GENDER"
  | "REGIONAL_AND_GENDER"
  | "REGIONAL";

export type PageTypeTypes = MeaningPage | ListingPage | undefined;

export type filterDynamicContent = {
  name: string;
  origin: string;
  gender: string;
  region: string;
  start_alphabet: string;
  slug: string;
};

export type filterType = {
  limit: number;
  skip: number;
  sort: {
    name: number;
  };
  where: Partial<filterDynamicContent>;
};
