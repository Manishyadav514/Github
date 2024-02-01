import { SHOP } from "@libConstants/SHOP.constant";

import useTranslation from "@libHooks/useTranslation";

import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";

const WriteAReview = ({ showReviewForm, adobeButtonClickEvent }: any) => {
  const { t } = useTranslation();

  return (
    <div className="h-52 w-full flex flex-col justify-center items-center" style={{ backgroundColor: "var(--color2" }}>
      <p className="text-gray-600 tracking-wide">{t("shareYourThoughtsAnd")}</p>
      {SHOP.ENABLE_GLAMMPOINTS && (
        <div className="mt-2 w-full px-6 flex items-center justify-center font-semibold text-gray-600">
          <p className="inline">Earn</p>
          <GoodPointsCoinIcon className="w-4 h-4 mx-1" />
          <p className="inline">
            {t("goodPointsCoin") || "25"} {t("myglammPoints")}
          </p>
        </div>
      )}
      <div className="flex mt-2 w-full justify-between px-6 py-3">
        {/* Review Button */}
        <button
          type="button"
          className={`tracking-widest w-full mr-2 text-base text-center font-semibold rounded-sm uppercase mb-2 px-6 py-3 outline-0 border border-black text-black`}
          onClick={() => {
            adobeButtonClickEvent("review", "write a review");
          }}
          disabled={showReviewForm}
        >
          {t("writeReview")}
        </button>
      </div>
    </div>
  );
};

export default WriteAReview;
