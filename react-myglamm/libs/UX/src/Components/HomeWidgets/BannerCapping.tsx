import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { capBannerData, Multimedia } from "@typesLib/Widgets";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

interface cappingProps {
  banner: Multimedia;
  children: ReactElement;
  callback?: (arg: Array<string>) => void;
}

const BannerCapping = ({ children, banner, callback }: cappingProps) => {
  const { ref, inView } = useInView({ threshold: 1 });

  const { viewCount, id } = banner || {};

  const [hideBanner, setHideBanner] = useState(false);

  useEffect(() => {
    if (viewCount) {
      const CAPPING_DATA: capBannerData = getLocalStorageValue(LOCALSTORAGE.CAPPING_DATA, true);

      const CAPPED_BANNERS_ID = CAPPING_DATA ? Object.keys(CAPPING_DATA)?.filter((x: any) => CAPPING_DATA[x]?.hide) : [];

      // Hide Banner only when not in view an cap is achieved
      if (!inView && viewCount <= CAPPING_DATA?.[id]?.count && !CAPPING_DATA?.[id]?.hide) {
        setLocalStorageValue(
          LOCALSTORAGE.CAPPING_DATA,
          { ...(CAPPING_DATA || {}), [id]: { ...(CAPPING_DATA?.[id] || {}), hide: true } },
          true
        );

        setHideBanner(true);

        callback?.([...CAPPED_BANNERS_ID, id]);
      } else if (inView) {
        // if inview Increment the counter in localstorage for the id
        setLocalStorageValue(
          LOCALSTORAGE.CAPPING_DATA,
          {
            ...(CAPPING_DATA || {}),
            [id]: { ...(CAPPING_DATA?.[id] || {}), count: CAPPING_DATA?.[id]?.count ? CAPPING_DATA[id].count + 1 : 1 },
          },
          true
        );
      } else if (callback) {
        // in either case give a callback
        callback(CAPPED_BANNERS_ID);
      } else if (!inView && viewCount <= CAPPING_DATA?.[id]?.count) {
        // exception in case which callback is not there and we just remove the html
        setHideBanner(true);
      }
    }
  }, [inView]);

  if (hideBanner) return null;

  // @ts-ignore
  return <Fragment>{{ ...children, ref }}</Fragment>;
};

export function handleCappedBanners(data: string[], banners: Multimedia[]) {
  if (banners?.length) return banners.filter(x => !data.includes(x.id));

  return [];
}

export default BannerCapping;
