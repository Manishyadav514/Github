import React from "react";
import CartUpsellDS from "@libComponents/Cart/CartUpsell/CartUpsellDS";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import useTranslation from "@libHooks/useTranslation";

const PaymentUpsell = ({ showUpsell, setShowUpsell }: { showUpsell: boolean; setShowUpsell: (arg: boolean) => void }) => {
  return (
    <div className="bg-white p-4">
      <PopupModal onRequestClose={() => setShowUpsell(false)} show={showUpsell}>
        <CartUpsellDS isUpsellOnPayment={true} closePaymentUpsellModal={() => setShowUpsell(false)} />
      </PopupModal>
    </div>
  );
};

export default PaymentUpsell;
