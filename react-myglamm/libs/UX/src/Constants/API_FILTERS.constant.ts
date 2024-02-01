import { langLocale, LanguageFilter } from "@typesLib/APIFilters";

export const LANGUAGE_FILTER: { [char in langLocale]: LanguageFilter } = {
  "en-in": "EN",
  "hi-in": "HI",
  "mr-in": "MAR",
  "en-ae": "EN",
  "ar-ae": "EN",
  "en-sa": "EN",
  "ar-sa": "EN",
};

export const API_FILTERS = {
  ORDER_CREATED_AT_DESC: "createdAt DESC",
  ORDER_CREATED_AT_ASC: "createdAt ASC",
  UPDATED_AT_DESC: "updatedAt DESC",
  UPDATED_AT_ASC: "updatedAt ASC",
};
