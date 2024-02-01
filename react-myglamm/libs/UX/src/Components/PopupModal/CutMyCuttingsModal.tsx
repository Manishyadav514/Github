import React from "react";
import { format } from "date-fns";
import useTranslation from "@libHooks/useTranslation";
import ScissorsIcon from "../../../public/svg/leftScissorsIcon.svg";
import PopupModal from "./PopupModal";
import { formatPrice } from "@libUtils/format/formatPrice";

const CutMyCuttingsModal = ({ userLogs, show, showButton = true, onRequestClose, openInviteModal }: any) => {
  const { t } = useTranslation();

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white h-auto" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <p className="text-base text-center font-bold pt-6">{t("myCuttings") || "My Cuttings"}</p>
        <div className="mx-4 pt-4 max-h-80 overflow-auto">
          {userLogs?.map((data: any, index: number) => {
            return (
              <div
                className="flex gap-4 justify-between items-center py-3"
                style={{ borderBottom: "solid 2px #f7f7f7" }}
                key={index}
              >
                <div className="flex flex-col justify-start pr-4">
                  <p className="text-sm font-medium">
                    {data?.phoneNumber} {t("ctpSuccessfulSignUp") || "has successfully sign up"}
                  </p>
                  <p className="text-sm pt-2" style={{ color: "#8c8c8c" }}>
                    {format(new Date(data?.createdAt), "dd MMM yyyy, hh:mm aaaaa'm'")}
                  </p>
                </div>
                <div className="flex flex-wrap justify-center items-center border border-dashed border-color1 p-1 rounded-lg w-1/4 shrink-0">
                  <p className="text-sm mx-2 font-semibold text-red-500">-{formatPrice(data?.point, true)}</p>
                  <ScissorsIcon className="w-3.5 h-3.5 mr-2" />
                </div>
              </div>
            );
          })}
        </div>
        {showButton && (
          <div className="px-2 py-2">
            <button
              type="button"
              className="rounded-md uppercase items-center text-white text-sm font-semibold w-full h-12 bg-ctaImg whitespace-nowrap"
              onClick={() => openInviteModal()}
            >
              {t("inviteMoreFriends") || "Invite more Friends for More Cut"}
            </button>
          </div>
        )}
      </div>
    </PopupModal>
  );
};

export default CutMyCuttingsModal;
