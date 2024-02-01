import Header from "@components/BigBoss/Header";
import BigBossAPI from "@libAPI/apis/BigBossAPI";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import useTranslation from "@libHooks/useTranslation";
import { logURI } from "@libUtils/debug";
import { getLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";
import { useRouter } from "next/router";
import { Fragment, ReactElement, useEffect, useState } from "react";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";
import Image from "next/legacy/image";
import BBHead from "@components/BigBoss/BBHead";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";

const Contestants = ({ contestantsList }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);
  const [selectedContestant, setSelectedContestant] = useState<any>();
  const [isSpinnerOn, setisSpinnerOn] = useState(false);

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|bigg boss|contestant voting`,
        newPageName: "bigg boss contestant voting",
        subSection: "bigg boss voting",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };

    if (!userProfile) {
      router.push("/bigg-boss");
    }
  }, []);

  const handleContestantSelect = contestant => {
    (window as any).digitalData = {
      common: {
        linkName: "web|bigg boss|contestant voting",
        linkPageName: "bigg boss contestant voting",
        ctaName: `Bigg Boss Contestant Select|${contestant.firstName + " " + contestant.lastName}`,
        newLinkPageName: "bigg boss contestant voting",
        subSection: "bigg boss voting",
        assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
        platform: ADOBE.PLATFORM,
        pageLocation: "",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();

    setSelectedContestant(contestant);
  };

  const handleSubmit = async () => {
    if (selectedContestant) {
      setisSpinnerOn(true);
      (window as any).digitalData = {
        common: {
          linkName: "web|bigg boss|contestant voting",
          linkPageName: "bigg boss contestant voting",
          ctaName: `Bigg Boss Contestant Submit|${selectedContestant.firstName + " " + selectedContestant.lastName}`,
          newLinkPageName: "bigg boss contestant voting",
          subSection: "bigg boss voting",
          assetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
          newAssetType: ADOBE.ASSET_TYPE.BIGG_BOSS,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
        },
        user: Adobe.getUserDetails(),
      };
      Adobe.Click();

      const bigBossAPi = new BigBossAPI();
      const utmParams = getLocalStorageValue(LOCALSTORAGE.UTM_PARAMS, true) || {};
      let input = { contestantId: selectedContestant.id };
      if (utmParams?.utmSource) {
        input["utmSource"] = utmParams.utmSource;
      }
      if (utmParams?.utmMedium) {
        input["utmMedium"] = utmParams.utmMedium;
      }
      if (utmParams?.utmTerm) {
        input["utmTerm"] = utmParams.utmTerm;
      }
      if (utmParams?.utmCampaign) {
        input["utmCampaign"] = utmParams.utmCampaign;
      }
      if (utmParams?.utmContent) {
        input["utmContent"] = utmParams.utmContent;
      }
      if (userProfile.referenceCode) {
        input["referralCode"] = userProfile.referenceCode;
      }
      bigBossAPi
        .voteNow(input)
        .then(res => {
          if (res?.data?.data?.data?.id) {
            setLocalStorageValue(LOCALSTORAGE.BIGG_BOSS_UPDATED, res?.data?.data?.data, true);
            setisSpinnerOn(false);
            router.push("/bigg-boss/thank-you");
          }
        })
        .catch(e => {
          setisSpinnerOn(false);
        });
    }
  };

  if (!userProfile)
    return (
      <Fragment>
        <BBHead />
        <LoadSpinner className="absolute m-auto inset-0 w-8" />
      </Fragment>
    );

  return (
    <section
      className="bg-no-repeat min-h-screen flex flex-col justify-between"
      style={{
        backgroundSize: "100% 100%",
        backgroundImage: `url(${t("imageUrls")?.bb13Background})`,
      }}
    >
      <BBHead />
      <div>
        <Header label={t("contestContestantListTitle") || "Contestant List"} />
        <div className="flex flex-wrap justify-around items-center mt-4 mb-16">
          {contestantsList?.map((cont, index) => {
            return (
              <a
                className="my-4 text-center static"
                key={index}
                onClick={() => handleContestantSelect(cont)}
                aria-label="select icon"
              >
                {selectedContestant?.id === cont.id && (
                  <div className="absolute my-4 ml-[118px] z-40">
                    <Image
                      src={"https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/select-icon-2.png"}
                      height="15"
                      width="15"
                    />
                  </div>
                )}
                <div
                  className={`w-36 h-36 rounded-full border-3 ${
                    selectedContestant?.id === cont.id ? "border-[#50A2D6]" : "border-white-500"
                  }`}
                >
                  <Image src={cont.thumbnail} height="600" width="600" className={`rounded-full border-3`} />
                </div>
                <p className="text-white text-1xl font-bold mt-2 tracking-wide">{cont.firstName + " " + cont.lastName}</p>
              </a>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          style={{ backgroundColor: "#50A2D6" }}
          className="flex justify-center items-center text-white fixed bottom-4 w-11/12 h-12 shadow-lg rounded-md font-bold tracking-wide uppercase mt-4"
          onClick={() => handleSubmit()}
          disabled={!selectedContestant || isSpinnerOn}
        >
          {!isSpinnerOn && (t("bbSubmit") || "SUBMIT")}
          {isSpinnerOn && <LoadSpinner className="ml-2 w-6" />}
        </button>
      </div>
    </section>
  );
};

Contestants.getLayout = (children: ReactElement) => children;

Contestants.getInitialProps = async (ctx: any) => {
  const api = new BigBossAPI();

  try {
    const { data } = await api.getContestantsList();

    return {
      contestantsList: data?.data?.data,
    };
  } catch (error) {
    logURI(ctx.asPath);
    console.error(error);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end(error);
    }
  }
};

export default Contestants;
