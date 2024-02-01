import { UseFormReturn } from "react-hook-form";

export type LoginForm = UseFormReturn<{
  mobile: string;
  ISDCode: string;
  name: string;
  countryCode?: string;
  phoneNumber?: string;
}>;
