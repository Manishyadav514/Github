import useTranslation from "@libHooks/useTranslation";
import React, { useEffect, useRef } from "react";
import CopyIcon from "../../../public/svg/ic-copy.svg";
import ArrowIcon from "../../../public/svg/ic-arrow.svg";
import { showError, showSuccess } from "@libUtils/showToaster";
import { format } from "date-fns";
import { isWebview } from "@libUtils/isWebview";
import { WVCallbacks } from "@libUtils/WVCallbacks";
import {
  mysteryRewardCouponCopy,
  mysteryRewardPageLoadOnWinning,
  mysteryRewardPagePlaceOrder,
} from "@libAnalytics/MysteryRewards.Analytics";
import { BASE_URL } from "@libConstants/COMMON.constant";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { useRouter } from "next/router";
import { setLocalStorageValue } from "@libUtils/localStorage";

interface RewardRedeemProps {
  scrollUp: boolean;
  setScrollUp: (value: any) => void;
  couponData: any;
  reward: any;
  site: string;
  name: string;
}

const RewardRedeem = ({ scrollUp, setScrollUp, couponData, reward, site, name }: RewardRedeemProps) => {
  const router = useRouter();
  const iFrameRef = useRef(null);

  useEffect(() => {
    mysteryRewardPageLoadOnWinning();
  }, []);

  const onClickHideElements = () => {
    setScrollUp(!scrollUp);
  };

  const copyCoupon = (event: any) => {
    event.stopPropagation();
    try {
      navigator.clipboard.writeText(couponData?.value?.discountCode);
      setLocalStorageValue(LOCALSTORAGE.COUPON, couponData?.value?.discountCode);
      isWebview() && WVCallbacks(`${window.location.origin}/copy?message=${couponData?.value?.discountCode}`);
      showSuccess("Copied");
      mysteryRewardCouponCopy();
    } catch (err) {
      console.error(err);
      showError("Something went wrong");
    }
  };

  const placeOrder = () => {
    try {
      const { contentWindow } = iFrameRef.current as unknown as HTMLIFrameElement;
      const { memberId, xtoken } = checkUserLoginStatus() || {};

      /* Post Message in Iframe for the required reward's Website - on demand */
      if (contentWindow) {
        contentWindow.postMessage(JSON.stringify({ key: LOCALSTORAGE.MEMBER_ID, value: memberId }), site);
        contentWindow.postMessage(JSON.stringify({ key: `xtoken-${reward?.discountCodeVendor}`, value: xtoken }), site);
        contentWindow.postMessage(JSON.stringify({ key: LOCALSTORAGE.COUPON, value: couponData?.value?.discountCode }), site);
      }
    } catch (err) {
      console.error(err);
    }
    mysteryRewardPagePlaceOrder();
    setLocalStorageValue(LOCALSTORAGE.COUPON, couponData?.value?.discountCode);
    navigator.clipboard.writeText(couponData?.value?.discountCode);
    if (isWebview()) {
      WVCallbacks(`${window.location.origin}/copy?message=${couponData?.value?.discountCode}`);
      WVCallbacks(
        `${couponData?.value?.cta?.web}${
          isWebview() && !BASE_URL()?.includes(site)
            ? (couponData?.value?.cta?.web).includes("?")
              ? "&openInChrome=true"
              : "?openInChrome=true"
            : ""
        }`,
        true
      );
    } else {
      router.push(couponData?.value?.cta?.web);
    }
  };

  const { t } = useTranslation();
  return (
    <section className="mx-4 mt-4 text-black">
      <span className="block mx-auto w-16 border-t-2 border-[#d9d9d9]" onClick={onClickHideElements}></span>
      <div className="h-12 bg-[#f2f2f2] w-full rounded-sm flex justify-between px-2 py-2 my-3 items-center">
        <span>
          <p className="text-10 leading-tight pt-0.5">Your voucher code</p>
          <p className="text-base font-bold uppercase leading-tight">{couponData?.value?.discountCode}</p>
        </span>
        <span
          className="rounded-full  bg-white border-dashed border-2 border-[#cfcfcf] h-9 w-9 flex justify-center items-center"
          onClick={copyCoupon}
        >
          <CopyIcon />
        </span>
      </div>
      <button onClick={placeOrder} className="bg-black h-12 w-full rounded-sm flex justify-center items-center gap-3">
        <span className="text-xs text-white"> {t("placeOrder")}</span> <ArrowIcon />
      </button>
      <p className="my-5 text-xs text-center">
        Valid till {couponData?.value?.expiryDate && format(new Date(couponData?.value?.expiryDate), "do MMM, yyy")}
      </p>
      <div className="lineFadeBlack w-full" />
      <section className="redeemList overflow-y-auto mt-3 pb-28 overscroll-contain" style={{ height: `calc(100vh - 255px)` }}>
        <div className="py-3">
          <p className="font-bold text-base my-2"> About</p>
          <div dangerouslySetInnerHTML={{ __html: reward?.cms[0]?.content?.about }} />
        </div>
        <div className="py-3">
          <p className="font-bold text-base my-2"> How to claim</p>
          <div dangerouslySetInnerHTML={{ __html: reward?.cms[0].content?.howToClaim }} />
        </div>
        <div className="py-3">
          <p className="font-bold text-base my-2"> Terms & Conditions</p>
          <div className="block" dangerouslySetInnerHTML={{ __html: reward?.cms[0].content?.termsAndCondition }} />
        </div>
      </section>
      {site && !BASE_URL()?.includes(site) && !isWebview() && (
        <iframe hidden className="hidden" ref={iFrameRef} title={name} src={`${site}${site.endsWith("/") ? "" : "/"}ls`} />
      )}
    </section>
  );
};

export default RewardRedeem;
