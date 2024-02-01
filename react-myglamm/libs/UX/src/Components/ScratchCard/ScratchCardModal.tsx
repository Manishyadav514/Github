import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { GiCloseIco } from "@libComponents/GlammIcons";
import ScratchCardAPI from "@libAPI/apis/ScratchCardAPI";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import ScratchedDataContainer from "@libComponents/ScratchCard/ScratchedDataContainer";
import useTranslation from "@libHooks/useTranslation";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useRouter } from "next/router";
import { SCRATCHCARD_STATUS } from "@libConstants/SCRATCHCARD_STATUS.constant";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import format from "date-fns/format";
import PopupModal from "@libComponents/PopupModal/PopupModal";
// @ts-ignore
import { ScratchCard, SCRATCH_TYPE } from "scratchcard-js";

interface scratchProps {
  show: boolean;
  onRequestClose: any;
  setScratchCards?: any;
  scratchIndex: number;
  scratchCards?: any;
  scratchCardData: any;
  pageName?: any;
}
function ScratchCardModal({
  show,
  onRequestClose,
  scratchCardData,
  scratchIndex,
  setScratchCards,
  scratchCards,
  pageName,
}: scratchProps) {
  const { t } = useTranslation();
  const widgetApi = new WidgetAPI();

  const [isRotated, setIsRotated] = useState(false);
  const [shakeImg, setShakeImg] = useState(false);
  const [widgets, setWidgets] = useState([]);
  const [showUpdatedStatus, setShowUpdatedStatus] = useState(scratchCardData?.statusId);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const myRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  useEffect(() => {
    setIsRotated(false);
  }, [show]);

  useEffect(() => {
    if (myRef.current) {
      createNewScratchCard();
    }
  }, [scratchCardData, show, myRef?.current]);

  const createNewScratchCard = () => {
    const scContainer = (window as any).document.getElementById("js--sc--container") || "";

    if (scContainer) {
      const sc = new ScratchCard("#js--sc--container", {
        scratchType: SCRATCH_TYPE.CIRCLE,
        containerWidth: 300, //scContainer.offsetWidth,
        containerHeight: 460,
        imageBackgroundSrc: "",
        imageForwardSrc: "https://files.myglamm.com/site-images/original/scratchcard-2.png",
        //htmlBackground: "",
        clearZoneRadius: 50,
        nPoints: 30,
        pointSize: 4,
        percentToFinish: 20,

        callback: () => {
          updateStatus(scratchCardData.id, scratchIndex);
        },
      });

      sc.init();

      sc.canvas.addEventListener("scratch.move", function () {
        let percent = sc.getPercent();

        const scInnerContent = document?.querySelector(".sc__inner") as HTMLElement;
        if (scInnerContent) {
          scInnerContent.style.display = "block";
        }
      });
    }
  };

  const scratchCardAdobeEvents = (ctaName?: any) => {
    let cardStatus = "";
    let cardScratched = "";
    const pageType = "scratch and win";
    if (scratchCardData.statusId === SCRATCHCARD_STATUS.UNSCRATCHED_CARD) {
      cardStatus = "new scratch card";
    } else if (scratchCardData.statusId === SCRATCHCARD_STATUS.ACTIVE_CARD) {
      cardStatus = "scratched card";
    }
    if (ctaName) {
      cardScratched = `|scratched`;
    }

    const screenName = pageName?.toLowerCase();

    (window as any).digitalData = {
      common: {
        pageName: `web|scratch and win|${screenName}|${cardStatus}${cardScratched}`,
        newPageName: `scratch and win|${screenName}|${cardStatus}${cardScratched}`,
        subSection: "Scratch and win",
        assetType: pageType,
        newAssetType: pageType,
        platform: ADOBE.PLATFORM,
        pageLocation: pageName,
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(profile),
    };
    const jstrAdobeAsset = {
      previousAssetType: pageName,
      currentAssetType: pageName,
    };
    localStorage.setItem("lsAdobeAssetTypes", JSON.stringify(jstrAdobeAsset));
    Adobe.PageLoad();
  };

  const scratchCardAPI = new ScratchCardAPI();
  useEffect(() => {
    scratchCardAdobeEvents();
    setTimeout(() => {
      setShakeImg(true);

      setShowCloseButton(true);
    }, 1000);
  }, []);

  useEffect(() => {
    if (scratchCardData.statusId !== SCRATCHCARD_STATUS.LOCKED_CARD) {
      const scratchCardInfo = {
        where: {
          slugOrId: "mobile-site-scratch-card-details",
        },
      };
      widgetApi.getWidgets(scratchCardInfo).then(({ data: res }) => setWidgets(res?.data?.data?.widget));
    }
  }, []);

  const updateStatus = (scratchedId: any, index: number) => {
    let guestDetails: any = localStorage.getItem("guestDetails") || "";
    if (guestDetails !== "") {
      guestDetails = JSON.parse(guestDetails);
    }
    scratchCardAPI
      .updateCardStatus(
        profile?.id || localStorage.getItem("memberId") || guestDetails?.phoneNumber,

        scratchedId
      )
      .then(res => {
        scratchCardAdobeEvents("card updated");

        if (scratchCards) {
          // eslint-disable-next-line no-param-reassign
          const updatedScratchCard = [...scratchCards];
          updatedScratchCard[index].statusId = res.data.data.statusId;
          setScratchCards(updatedScratchCard);
        }

        setShowUpdatedStatus(res.data.data.statusId);
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose} type="center-modal">
      {showCloseButton && (
        <div aria-hidden="true" className="absolute -top-10 -right-4" onClick={onRequestClose}>
          <GiCloseIco height="40" width="40" fill="#fff" />
        </div>
      )}

      <div className={`${shakeImg ? "scratchCard-shake" : ""}`}>
        {scratchCardData.statusId === SCRATCHCARD_STATUS.LOCKED_CARD && (
          <div className="relative">
            <img
              className="w-[300px] h-[460px] rounded-3xl"
              src={
                t("scratchAndWin")?.unScratchedImageFull || "https://files.myglamm.com/site-images/original/scratchcard-2.png"
              }
              alt="lockedCard"
            />
            {scratchCardData.value?.unlocksAt && (
              <span
                className="absolute flex py-1 justify-center items-center text-center font-bold w-full text-sm"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  backgroundColor: "#fce1e0",
                }}
              >
                {t("scratchAndWin").scratchCardUnlocksOnPlaceHolder?.replace(
                  "{{unlocksDate}}",
                  `${format(new Date(scratchCardData.value.unlocksAt), "do MMM, yyyy")}`
                )}
              </span>
            )}
          </div>
        )}

        {scratchCardData.statusId === SCRATCHCARD_STATUS.UNSCRATCHED_CARD && (
          <div className="sc__wrapper mx-auto h-[460px] w-[300px]">
            <div id="js--sc--container" className="relative mx-auto  h-[460px] w-full" ref={myRef}>
              <div className="sc__inner hidden">
                <ScratchedDataContainer
                  scratchCardData={scratchCardData}
                  setIsRotated={setIsRotated}
                  isRotated={isRotated}
                  widgets={widgets}
                  pageName={pageName}
                  showUpdatedStatus={showUpdatedStatus}
                />
              </div>
            </div>
          </div>
        )}

        {scratchCardData.statusId === SCRATCHCARD_STATUS.ACTIVE_CARD && (
          <div className="w-[300px] h-[460px] relative">
            <ScratchedDataContainer
              scratchCardData={scratchCardData}
              setIsRotated={setIsRotated}
              isRotated={isRotated}
              widgets={widgets}
              pageName={pageName}
              showUpdatedStatus={showUpdatedStatus}
            />
          </div>
        )}
      </div>
    </PopupModal>
  );
}

export default ScratchCardModal;
