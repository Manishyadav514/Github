import React from "react";
import CalendarIcon from "../../../public/svg/calendarThemeColor.svg";
import { format } from "date-fns";
import useTranslation from "@libHooks/useTranslation";

interface RewardPreviewProps {
  hide: boolean;
  scrollUp: boolean;
  reward: any;
  g3Logo: string;
  couponData: any;
}

const RewardPreview = ({ hide, scrollUp, reward, g3Logo, couponData }: RewardPreviewProps) => {
  const { t } = useTranslation();

  return (
    <div className="reward-preview">
      <div className={`reward-details my-8 mx-4 justify-between items-center ${scrollUp ? "hidden" : "flex"}`}>
        <div className={`w-20 pl-2 ${!hide ? "" : "invisible"}`}>
          <img alt="g3 logo" src={g3Logo} className="w-5 h-5 my-0.5" />
          <p className="font-bold text-xs my-1 leading-3 "> {reward.redeemablePoints} </p>
          <p className="text-11 leading-3 my-1 tracking-wide"> {t("goodPoints")} </p>
        </div>
        <div className="h-48 pr-1" style={{ width: "148px" }}>
          <img
            className="w-full h-full object-cover border-2 border-white"
            src={reward?.thumnailImage?.couponImage}
            alt="reward"
            style={{ borderRadius: "99px 99px 12px 12px", boxShadow: "10px 10px 0px -3px rgba(0,0,0,0.20)" }}
          />
        </div>
        <div className={`w-20 ${!hide ? "" : "invisible"}`}>
          <CalendarIcon className="w-4 h-4 my-0.5" fill={"#ffffff"} />
          <p className="font-bold text-xs leading-3 my-1">
            {reward.expireAt && format(new Date(reward.expireAt), "do MMM, yyy")}
          </p>
          <p className="text-11 leading-3 my-0.5"> Valid till </p>
        </div>
      </div>

      <div className={`mb-8 reward-title ${scrollUp ? "hidden" : "flex"}`}>
        <p
          className="text-15 leading-tight text-center w-3/4 mx-auto line-clamp-2"
          dangerouslySetInnerHTML={{ __html: couponData?.value?.discountDescription || reward?.title }}
        ></p>
      </div>
    </div>
  );
};

export default RewardPreview;
