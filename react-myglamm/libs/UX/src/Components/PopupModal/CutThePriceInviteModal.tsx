import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CutThePriceShare from "@libComponents/CutThePrice/CutThePriceShare";
import useTranslation from "@libHooks/useTranslation";
import * as React from "react";
import PopupModal from "./PopupModal";

const CutThePriceInviteModal = ({ product, show, onRequestClose }: any) => {
  const { t } = useTranslation();

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div className="bg-white h-auto" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
        <div className="mx-6 pt-6">
          <div className="flex justify-between">
            <ImageComponent
              src="https://s3.ap-south-1.amazonaws.com/pubfiles.themomsco.net/tmc-alpha/original/invite-left.png"
              width="65px"
              height="26px"
            />
            <div>
              <p className="text-sm font-bold text-center">{t("inviteNGetDiscount") || "Invite and get ₹20 discount"}</p>
              <p className="text-sm text-center mt-2">{t("perFriendDiscount") || "per friend on your favorite products"}</p>
            </div>
            <ImageComponent
              src="https://s3.ap-south-1.amazonaws.com/pubfiles.themomsco.net/tmc-alpha/original/invite-right.png"
              width="65px"
              height="26px"
            />
          </div>
          <CutThePriceShare product={product} />
        </div>
      </div>
    </PopupModal>
  );
};

export default CutThePriceInviteModal;
