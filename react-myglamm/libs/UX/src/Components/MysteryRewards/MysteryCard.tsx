import useTranslation from "@libHooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import ArrowIcon from "../../../public/svg/ic-arrow.svg";

interface MysteryCardProps {
  brandData: any;
  title: string;
  rewardImg: string;
  slug: string;
  icid: string;
}

const MysteryCard = ({ brandData, title, rewardImg, slug, icid }: MysteryCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div
      className="w-52  mx-3 rounded-md"
      style={{ background: `${brandData?.backgroundColor || "var(--color1)"}`, height: "335px" }}
    >
      <div className="w-52 rounded-t-sm mysteryCard" style={{ height: "290px" }}>
        <span
          className="block m-auto border-x-[1px]  w-16"
          style={{ borderColor: brandData?.primaryColor, height: "18px" }}
        ></span>
        <span className="block rounded-md h-8 w-36 border-[1px] mx-auto p-1" style={{ borderColor: brandData?.primaryColor }}>
          <img src={brandData?.headerLogo} className="w-full h-full object-contain mx-auto block" alt="brand logo" />
        </span>
        <div className=" h-48 my-8 mx-auto relative" style={{ width: "148px" }}>
          <img
            className="w-full h-full object-cover border-2 border-white"
            src={rewardImg}
            alt="reward"
            style={{ borderRadius: "99px 99px 12px 12px", boxShadow: "10px 10px 0px -3px rgba(0,0,0,0.20)" }}
          />
          <span className="text-3xl leading-none absolute -top-2 -right-6  " style={{ color: brandData?.primaryColor }}>
            +
          </span>
          <span className="text-3xl leading-none absolute -bottom-4 -left-6 " style={{ color: brandData?.primaryColor }}>
            +
          </span>
        </div>
        <p
          className="text-xs uppercase text-center font-bold line-clamp-2 mx-4 whitespace-normal"
          style={{ color: brandData?.primaryColor }}
        >
          <div dangerouslySetInnerHTML={{ __html: title }} />
        </p>
      </div>
      <Link href={`/mystery-reward/${slug}${icid}`} legacyBehavior>
        <button className="bg-black h-11 w-full  flex justify-center items-center gap-3 rounded-b-md relative z-10">
          <span className="text-xs text-white"> Claim now</span> <ArrowIcon role="img" aria-labelledby="claim now" />
        </button>
      </Link>
    </div>
  );
};

export default MysteryCard;
