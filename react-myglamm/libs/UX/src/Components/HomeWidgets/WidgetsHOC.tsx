import React, { useState, useRef, useEffect, ReactElement } from "react";
import { useRouter } from "next/router";

import LazyHydrate from "react-lazy-hydration";
import { useInView } from "react-intersection-observer";

import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { getMCVID } from "@libUtils/getMCVID";

import useEffectAfterRender from "@libHooks/useEffectAfterRender";
import { useSplit } from "@libHooks/useSplit";

import { PDPProd } from "@typesLib/PDP";

/* Variant Toggling - Data Manipulation - START */
const toggleBVariantWidgets = (widgets: any) => {
  const labels = widgets?.map((i: any) => i.label);
  const bIndexes = labels.filter((l: any) => l.endsWith("-B")).map((b: any) => labels.indexOf(b));
  const aIndexes = bIndexes.map((i: any) => i - 1);

  return widgets?.map((w: any, i: number) => {
    if (aIndexes.includes(i)) {
      return { ...w, show: false };
    }
    if (bIndexes.includes(i)) {
      return { ...w, show: true };
    }
    return { ...w, show: true };
  });
};

const toggleAVariantWidgets = (widgets: any) =>
  widgets?.map((widget: any) => {
    if (widget.label?.endsWith("-B")) {
      return { ...widget, show: false };
    }
    return widget;
  });
/* Variant Toggling - Data Manipulation - END */

export const getAndStoreSegmentTags = async () => {
  const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
  if (!memberId) return;
  const consumerApi = new ConsumerAPI();
  const { data: userTags } = await consumerApi.getDump(LOCALSTORAGE.USER_SEGMENT, memberId);

  /* If Dump Available Store it for further use */
  const userSegmentTags = userTags?.data?.[0]?.value?.segment;
  if (userSegmentTags?.length) {
    setLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, userSegmentTags, true);
  }
};

interface WidgetProps {
  widgets?: any[];
  additionalData?: any;
  slugOrId?: string;
  disableSegment?: boolean;
  widgetPersonalization?: boolean;
  icidPrefix?: string;
  widgetGroups: (item: any, index: number, icidPrefix?: string, product?: PDPProd) => ReactElement | null;
  product?: PDPProd;
  abExp?: any;
}

function WidgetsHOC({
  widgets,
  slugOrId,
  abExp,
  additionalData,
  widgetGroups,
  icidPrefix,
  disableSegment = false,
  widgetPersonalization = false,
  product,
}: WidgetProps) {
  const { query, locale } = useRouter();

  const { ref, inView } = useInView({ threshold: 0, triggerOnce: true });

  // TODO:
  // switch to true to enable infinite loading,
  // currently disabled because new footer is confusing the infinite component

  function patchWidgetData(data: any[]) {
    return (
      data?.map((w: any) => {
        if (w.label?.endsWith("-B")) {
          return { ...w, show: false };
        }
        return { ...w, show: true };
      }) || []
    );
  }

  function patchAdditionalBanner(tempWidgetData: any) {
    const bannerWidgetIndex = tempWidgetData.findIndex(
      (x: any) => x.show && x.customParam?.match(/multiple-banner|multimedia-carousel-1/)
    );

    /* if a widget is present with banner custom param add the additional data to it otherwise just show the additional data */
    if (bannerWidgetIndex >= 0) {
      const tempData = tempWidgetData;
      /* Store Original Personalized Widget Data temporarily in a key, so that original is mantained */
      tempData[bannerWidgetIndex].tempMultimediaDetails =
        tempData[bannerWidgetIndex].tempMultimediaDetails || tempData[bannerWidgetIndex].multimediaDetails || [];

      tempData[bannerWidgetIndex].multimediaDetails = [
        ...tempData[bannerWidgetIndex].tempMultimediaDetails,
        ...(additionalData?.multimediaDetails || []),
      ];
      setWidgetData([...tempData]);
    } else if (additionalData) {
      setWidgetData([additionalData]);
    } else {
      setWidgetData(tempWidgetData);
    }
  }

  const [widgetData, setWidgetData] = useState(patchWidgetData(widgets || []));

  const showBVariant = useRef(!!query.B);

  const fetchMoreWidgets = React.useCallback(
    async (reset?: boolean) => {
      const where: any = { where: { slugOrId } };

      const segmentTags = getLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, true) || [];
      if (segmentTags?.length) {
        where.where.tag = segmentTags;
      }

      // widget personalization on home
      const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);
      let orderBySegment: any;
      if (widgetPersonalization) {
        if (memberId) {
          const data = getLocalStorageValue(LOCALSTORAGE.PROFILE, true) || [];
          orderBySegment = data?.meta?.attributes?.userGraphVc?.mgp?.orderBySegment || "";
        } else {
          orderBySegment = getLocalStorageValue(LOCALSTORAGE.ORDER_BY_SEGMENT, true) || "";
        }
      }

      try {
        const widgetApi = new WidgetAPI();
        const { data } = await widgetApi.getHomeWidgets(
          where,
          10,
          reset ? 0 : widgetData.length,
          !!checkUserLoginStatus(),
          orderBySegment
        );

        if (data?.data?.data?.widget?.length !== 0) {
          /* Incase of Reset empty widgets and add new ones */
          const updatedData = patchWidgetData([...(reset ? [] : widgetData), ...data.data.data.widget]);

          if (showBVariant.current) {
            patchAdditionalBanner(toggleBVariantWidgets(updatedData));
          } else {
            patchAdditionalBanner(toggleAVariantWidgets(updatedData));
          }
        }
      } catch (error) {
        // console.error(`Failed to fetch Widgets`, error);
        patchAdditionalBanner(widgetData || []);
      }
    },
    [widgetData]
  );

  const getGuestUserSegment = async () => {
    const MCVID = getMCVID() || "";
    if (!MCVID) return;
    const consumerApi = new ConsumerAPI();
    const { data } = await consumerApi.getGuestDump(MCVID);
    // save orderBySegment value for guest user
    const orderBySegmentValue = data?.data?.data?.orderBySegment;
    if (orderBySegmentValue) {
      setLocalStorageValue(LOCALSTORAGE.ORDER_BY_SEGMENT, orderBySegmentValue, true);
    }
    const userSegmentTags = data?.data?.data?.userSegment || data?.data?.[0]?.data?.userSegment;
    if (userSegmentTags?.length) {
      setLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, userSegmentTags, true);
    }
  };

  React.useEffect(() => {
    setWidgetData(patchWidgetData(widgets || []));
  }, [widgets]);

  const triggerSegmentCheck = async () => {
    const memberId = getLocalStorageValue(LOCALSTORAGE.MEMBER_ID);

    if (disableSegment) return;

    if (!memberId) await getGuestUserSegment();

    if (!memberId && showBVariant.current && widgetData) setWidgetData(toggleBVariantWidgets(widgetData));

    /* For guest user when widget data is empty */
    if (!widgetData?.length && slugOrId && !memberId) return fetchMoreWidgets(true);

    /* UserSegment Tags Availabel then directly call Widgets and Overwrite */
    const userSegment = getLocalStorageValue(LOCALSTORAGE.USER_SEGMENT, true);
    if (userSegment?.length) {
      fetchMoreWidgets(true);

      /* Update Tags in Background if already available in storage */
      getAndStoreSegmentTags();

      return;
    }

    /* Call Dump For Login Users */
    if (memberId) {
      await getAndStoreSegmentTags();

      return fetchMoreWidgets(true);
    }

    return null;
  };

  /* Exception - For Guest Users in case of locale change call widgets again */
  useEffectAfterRender(() => {
    if (!checkUserLoginStatus()) setWidgetData(patchWidgetData(widgets || []));
  }, [locale]);

  const abExpVariant =
    useSplit({
      experimentsList: [{ id: abExp }],
      deps: [],
    }) || {};

  //A/B test load check
  useEffect(() => {
    if (abExpVariant?.[abExp]) {
      const selectedVariant = abExpVariant?.[abExp];
      showBVariant.current = selectedVariant === "1" || !!query.B;
      triggerSegmentCheck();

      if (!(window as any).experimentVariant1 && selectedVariant !== "no-variant") {
        (window as any).evars.evar85 = selectedVariant;
      }
    }
  }, [widgets?.length, abExpVariant]);

  useEffect(() => {
    if (inView && slugOrId) fetchMoreWidgets();
  }, [inView]);

  useEffect(() => {
    if (widgetData.length) patchAdditionalBanner(widgetData);
  }, [additionalData]);

  if (widgetData?.length > 0) {
    return (
      <>
        {widgetData.map((item: any, index: number) => {
          if (item.show === false) return null;

          // lazy hydrate everything except the top 2 widgets that are visible above the fold
          if (index > 1) {
            return (
              <LazyHydrate key={`lh-${item.id}`} whenVisible={{ rootMargin: "0px" }}>
                <div ref={widgetData.length - 4 === index ? ref : null} className="cv-auto">
                  {widgetGroups(item, index, icidPrefix)}
                </div>
              </LazyHydrate>
            );
          }

          return (
            <div key={`lh-${item.id}`} className="cv-auto">
              {widgetGroups(item, index, icidPrefix)}
            </div>
          );
        })}
      </>
    );
  }

  return null;
}

export default WidgetsHOC;
