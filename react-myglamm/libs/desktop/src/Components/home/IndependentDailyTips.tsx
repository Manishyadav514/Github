import React from "react";

import ConstantsAPI from "@libAPI/apis/ConstantsAPI";

import GoodGlammSlider from "@libComponents/Common/GoodGlammSlider";

import { useSelector } from "@libHooks/useValtioSelector";

import { showSuccess } from "@libUtils/showToaster";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { ValtioStore } from "@typesLib/ValtioStore";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";

interface PropTypes {
  item: any;
}

const MetricInfoCard = ({ tip }: any) => {
  return (
    <div className="border border-color1 rounded-lg mb-2.5 p-0 h-[260px] relative">
      <div className=" bg-color1 text-base font-medium p-4 text-white rounded-t-lg rounded-tl-lg rounded-tr-lg flex items-center ">
        {tip?.cms?.[0]?.content?.metricTitleImage ? (
          <img src={tip?.cms?.[0]?.content?.metricTitleImage} alt="" className="w-[36px] h-[36px] rounded" />
        ) : null}
        <p className="ml-2 capitalize mb-0">{tip?.cms?.[0]?.content?.metricTitle}</p>
      </div>
      <div className="p-5">
        <p className="text-black font-base mb-0">{tip?.cms?.[0]?.content?.metricDescription}</p>
        <div className="flex absolute bottom-5 left-1/2 -translate-x-1/2">
          <button
            type="button"
            className=" uppercase text-xs font-bold rounded-sm flex items-center justify-center text-green-500 border-solid border border-green-500 w-20 h-7 mr-3"
            onClick={() => {
              navigator.clipboard.writeText(tip?.cms?.[0]?.content?.ctaFirstDeeplink || `${GBC_ENV.NEXT_PUBLIC_BASE_URL}/`);
              showSuccess("Copied to clipboard successfully!");
            }}
          >
            {tip?.cms?.[0]?.content?.ctaFirstText === "Share" || !tip?.cms?.[0]?.content?.ctaFirstText ? (
              <img src={getStaticUrl("/images/bbc-g3/whatsapp-logo2.svg")} alt="" className="mr-1" />
            ) : null}
            <p className="mb-0">{tip?.cms?.[0]?.content?.ctaFirstText || "Share"}</p>
          </button>
          {tip?.cms?.[0]?.content?.ctaSecondText ? (
            <a href={tip?.cms?.[0]?.content?.ctaSecondDeeplink || "/"}>
              <button type="button" className="read-more uppercase text-xs font-bold text-white rounded-sm w-24 h-7 bg-color1">
                {tip?.cms?.[0]?.content?.ctaSecondText}
              </button>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MetricDevelopmentCard = ({ tip }: any) => {
  return (
    <div className="border border-color1 rounded-lg mb-2.5 p-0 h-[260px] relative">
      <div className=" bg-color1 text-base font-medium p-4 text-white rounded-t-lg rounded-tl-lg rounded-tr-lg flex items-center">
        {tip?.cms?.[0]?.content?.metricTitleImage ? (
          <img src={tip?.cms?.[0]?.content?.metricTitleImage} alt="" style={{ width: "36px", height: "36px" }} />
        ) : null}
        <p className="ml-2 capitalize mb-0">{tip?.cms?.[0]?.content?.metricTitle}</p>
      </div>

      <div className="p-5">
        {tip?.cms?.[0]?.content?.metricImage ? (
          <img src={tip?.cms?.[0]?.content?.metricImage} alt="" className="mb-2 ml-auto mr-auto block w-[138px] h-[75px]" />
        ) : null}

        <p className="text-black font-base mx-3">{tip?.cms?.[0]?.content?.metricDescription}</p>
      </div>
    </div>
  );
};

const IndependentDailyTips = (props: PropTypes) => {
  const { item } = props;
  const [dailyTips, setDailyTips] = React.useState([]);
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const getDailyTipsResponse = async () => {
    const metaData = item?.meta?.widgetMeta;
    if (metaData) {
      const parsedData = JSON.parse(metaData);
      const { url } = parsedData;

      if (!url) {
        return [];
      }
      const constantApi = new ConstantsAPI();
      try {
        const response = await constantApi.dynamicG3Call(url);
        setDailyTips(response?.data?.data?.data || []);
      } catch (err) {
        console.error("error ", err);
      }
    }
  };

  React.useEffect(() => {
    if (item && userProfile?.id) {
      getDailyTipsResponse();
    }
  }, [userProfile?.id, item]);
  return (
    <div className="bg-white my-3 px-4 py-3 w-full">
      {userProfile?.id && dailyTips?.length ? (
        <>
          <p className="mb-5 text-base font-bold">Tip for you Today</p>
          <GoodGlammSlider slidesPerView={1} dots="dots" arrowClass={{ left: "-left-8", right: "-right-8" }}>
            {dailyTips?.map((tip: any) => {
              if (tip.metricType === "metricInfo") {
                return <MetricInfoCard tip={tip} key={tip.id} />;
              }
              if (tip.metricType === "metricDevelopment") {
                return <MetricDevelopmentCard tip={tip} key={tip.id} />;
              }
              // return <div key={tip.id}>{tip.metricType}</div>;
            })}
          </GoodGlammSlider>
        </>
      ) : null}
      {!userProfile?.id ? (
        <>
          <p className="mb-5 text-base font-bold">Tip for you Today</p>
          <div className="relative">
            <img src={getStaticUrl("/images/bbc-g3/daily-tip-placeholder.svg")} alt="" height={260} />
            <div className="placeholder w-full h-[260px] absolute top-0 left-0 bg-[#000000a6]" />
            <div className="absolute top-0 left-0 text-center py-6">
              <p className="text-white font-bold text-lg">Daily Tips & Parenting Hacks</p>
              <p className="text-white text-base mt-2">Get personalised daily tips & track important milestones</p>
              <button
                type="button"
                className="uppercase text-color1 font-bold w-[245px] h-[36px] border border-color1 mt-3"
                onClick={() => SHOW_LOGIN_MODAL({ show: true })}
              >
                Complete Profile
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default React.memo(IndependentDailyTips);
