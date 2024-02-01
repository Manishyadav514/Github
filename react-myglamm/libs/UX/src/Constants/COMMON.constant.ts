import MyGlammAPI from "@libAPI/MyGlammAPI";

import { getStaticUrl } from "@libUtils/getStaticUrl";

import { SHOP } from "./SHOP.constant";
import { GBC_ENV } from "./GBC_ENV.constant";

export const BASE_URL = () =>
  GBC_ENV.NEXT_PUBLIC_BASE_URL?.concat(`/${MyGlammAPI.LOCALE}`).replace("/en-in", "") || GBC_ENV.NEXT_PUBLIC_BASE_URL;

export const DEFAULT_IMG_PATH = () => getStaticUrl("/images/default-bg.png");

export const IS_DESKTOP = process.env.NEXT_PUBLIC_ROOT === "web";

export const IS_POPXO = () => SHOP.SITE_CODE === "popxo";
