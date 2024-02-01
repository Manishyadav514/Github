import useTranslation from "@libHooks/useTranslation";
import RightScissorsIcon from "../../../public/svg/rightScissorsIcon.svg";
import ScissorsIcon from "../../../public/svg/leftScissorsIcon.svg";
import { useEffect, useState } from "react";
import PopupModal from "./PopupModal";
import { formatPrice } from "@libUtils/format/formatPrice";
import ConfettiModal from "@libComponents/OrderSummary/ConfettiModal";
import { isClient } from "@libUtils/isClient";

const CutThePriceCongratsModal = ({ price = 0, show, onRequestClose }: any) => {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState<any>();
  let msg =
    t("perFriendDiscount") ||
    `You have just <strong>cut ₹20</strong> from the price. Now invite more friends and cut the remaining <strong>{{price}}</strong> to get this product for <strong>free</strong>.`;
  msg = msg?.replace("{{price}}", formatPrice(price, true, true));

  useEffect(() => {
    if(isClient()){
      (window as any).navigator?.vibrate([200, 100, 200]);
      setTimeout(() => setShowConfetti(true), 1000);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, []);

  return (
    <>
      <PopupModal show={show} onRequestClose={onRequestClose}>
        <div className="bg-white h-44" style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <div className="mx-6 pt-4">
            <div className="flex flex-row justify-evenly items-center mt-3">
              <ScissorsIcon />
              <span className="absolute border-dashed w-1/6	border-black left-0 opacity-50" style={{ borderWidth: 1 }}></span>
              <p className="text-2xl font-bold text-center relative">{t("congratulation") || "Congratulation!"}</p>
              <RightScissorsIcon />
              <span className="absolute border-dashed w-1/6	border-black right-0 opacity-50" style={{ borderWidth: 1 }}></span>
            </div>
            <p className="text-base text-center my-5" dangerouslySetInnerHTML={{ __html: msg }}></p>
          </div>
        </div>
      </PopupModal>
      {showConfetti && <ConfettiModal show={showConfetti} />}
    </>
  );
};

export default CutThePriceCongratsModal;
