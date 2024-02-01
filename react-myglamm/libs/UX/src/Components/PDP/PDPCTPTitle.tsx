import React, { useState } from "react";
import ScissorsIcon from "../../../public/svg/leftScissorsIcon.svg";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import CutMyCuttingsModal from "@libComponents/PopupModal/CutMyCuttingsModal";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CutThePriceInviteModal from "@libComponents/PopupModal/CutThePriceInviteModal";
import { CTPData, PDPProd } from "@typesLib/PDP";
import { useSnapshot } from "valtio";
import { PDP_STATES } from "@libStore/valtio/PDP.store";

function PDPCTPTitle({ product }: { product: PDPProd }) {
  const { t } = useTranslation();

  const { ctpProductData, userLogs } = useSnapshot(PDP_STATES).CTP as CTPData;

  const [ctpMyCuttingsModal, setCTPMyCuttingsModal] = useState<boolean | undefined>();
  const [ctpInviteModal, setCTPInviteModal] = useState<boolean | undefined>();
  const users = JSON.parse(JSON.stringify(userLogs));
  const intiteHeading = t("ctpInviteAcceptation") || "Woohoo! Your {{count}} friends have accepted the invite";

  const openInviteModal = () => {
    setCTPMyCuttingsModal(false);
    setCTPInviteModal(true);
  };

  return (
    <div className="pt-2 px-2 bg-white" style={{ borderBottom: "solid 2px #f7f7f7" }}>
      <div className="flex flex-col p-2 w-full">
        <p className="text-sm mb-2">{intiteHeading.replace("{{count}}", userLogs?.length)}</p>
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-wrap justify-start items-center">
            <div className="flex flex-wrap justify-start items-center -space-x-1">
              {users?.splice(0, 6)?.map((data: any, index: number) => {
                return (
                  <ImageComponent
                    src={`https://s3.ap-south-1.amazonaws.com/pubfiles.themomsco.net/tmc-alpha/original/ctp-image-${
                      index + 1
                    }.png`}
                    height={30}
                    width={30}
                    key={index}
                  />
                );
              })}
              {userLogs?.length > 6 && (
                <div className="bg-gray-500 rounded-full w-8 h-8">
                  <p className="p-2 text-white font-semibold">+{userLogs?.length - 6}</p>
                </div>
              )}
            </div>
            <p className="text-xs font-semibold text-color1 ml-2" onClick={() => setCTPMyCuttingsModal(true)}>
              {t("viewDetails") || "View Details"}
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center border border-dashed border-color1 p-1 rounded-lg">
            <p className="text-sm mx-2 font-bold text-red-500">-{formatPrice(ctpProductData?.point, true)}</p>
            <ScissorsIcon className="w-3.5 h-3.5 mr-2" />
          </div>
        </div>
      </div>

      {typeof ctpMyCuttingsModal === "boolean" && (
        <CutMyCuttingsModal
          userLogs={userLogs}
          show={ctpMyCuttingsModal}
          onRequestClose={() => setCTPMyCuttingsModal(false)}
          openInviteModal={openInviteModal}
        />
      )}

      {typeof ctpInviteModal === "boolean" && (
        <CutThePriceInviteModal show={ctpInviteModal} product={product} onRequestClose={() => setCTPInviteModal(false)} />
      )}
    </div>
  );
}

export default PDPCTPTitle;
