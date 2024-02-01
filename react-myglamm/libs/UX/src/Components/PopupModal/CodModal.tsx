import React, { useEffect, useState } from "react";
import { PaymentData, PaymentType, UpiData, UpiIntent } from "@typesLib/Payment";
import PopupModal from "./PopupModal";
import UPILogo from "../../../public/svg/UPI-Logo.svg";
import { ValtioStore } from "@typesLib/ValtioStore";
import { formatPrice } from "@libUtils/format/formatPrice";
import { UpiCollectInputField } from "@libComponents/Payments/UPI/UpiHelperComponents";
import useTranslation from "@libHooks/useTranslation";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import CloseIcon from "../../../public/svg/group-2.svg";
import clsx from "clsx";
import { useFetchUpiMethod } from "@libHooks/useFetchUpiMethods";
import { getFinalAmountAfterDiscount, handleVerifyUpiId } from "@checkoutLib/Payment/HelperFunc";
import { IUpiBankList } from "@libComponents/Payments/UPI";
import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADOBE_REDUCER, PAYMENT_REDUCER } from "@libStore/valtio/REDUX.store";
import { useSelector } from "@libHooks/useValtioSelector";

const CodModal = ({
  show,
  onClose,
  handleCreateOrder,
}: {
  show: boolean;
  onClose: () => void;
  handleCreateOrder: (arg1: PaymentType, arg2?: PaymentData) => any;
}) => {
  const { t } = useTranslation();
  const { upiList, downTimes, bestOffer, upiIntentOffers } = useFetchUpiMethod();

  const [selectedApp, setSelectedApp] = useState(upiList?.[0]?.code);
  const [UPIVal, setUPIVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [upiValidationError, setUpiValidationError] = useState("");
  const [amountAfterDiscount, setAmountAfterDiscount] = useState<number>();

  const payableAmount = useSelector((store: ValtioStore) => store.cartReducer.cart.payableAmount);

  useEffect(() => {
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: "web|order checkout|cod popup",
        newPageName: "cod popup",
        subSection: "Payment page",
        assetType: "Payment page",
        newAssetType: "cod popup",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  useEffect(() => {
    if (upiList.length) {
      setSelectedApp(upiList?.[0]?.code);
    }

    return () => {
      setUpiValidationError("");
    };
  }, [upiList]);

  /* fetching offers for UPI intent  */
  useEffect(() => {
    if (upiIntentOffers.length > 0) {
      /* fetch discounted amount from selected UPI intent bank  */
      const findSelectedBankUpiOffer = getFinalAmountAfterDiscount({
        selectedBank: selectedApp,
        bestOffer,
        paymentMethod: "upi",
      });

      if (findSelectedBankUpiOffer) {
        return setAmountAfterDiscount(parseInt(findSelectedBankUpiOffer));
      }
      return setAmountAfterDiscount(payableAmount);
    }
  }, [selectedApp, upiIntentOffers]);

  useEffect(() => {
    /* Store the UPI intent bank details selected by the user */
    const getSelectedBankResults = upiList?.find((bank: IUpiBankList) => bank.code === selectedApp);
    PAYMENT_REDUCER.upiAppDetails = {
      ...getSelectedBankResults,
      amount: amountAfterDiscount ? amountAfterDiscount : payableAmount,
    };
  }, [selectedApp, amountAfterDiscount]);

  const handleOrder = (method: string) => {
    sessionStorage.setItem(LOCALSTORAGE.ORDER_CREATED_THROUGH_COD_PROMPT, JSON.stringify(true));
    if (method === "cash") return handleCreateOrder("cash");
    if (method === "enter_upi_id") return handleVerifyVpa();

    return createOrder("intent");
  };

  const handleVerifyVpa = async () => {
    setIsLoading(true);
    const { status, message } = await handleVerifyUpiId(UPIVal);

    if (status) {
      onClose();
      createOrder("collect");
    }
    setUpiValidationError(message);
    setIsLoading(false);
  };

  const createOrder = (upiFlowType: "intent" | "collect") => {
    onClose();
    const selectedAppForUpiIntent = upiList?.find(bank => bank.code === selectedApp);
    handleCreateOrder("juspay", { method: "UPI", vpa: UPIVal, upiFlowType, selectedAppForUpiIntent });
  };

  const dispayUpiInputField = (
    <React.Fragment>
      <div className="mt-2 mb-4">
        <UpiCollectInputField
          UPIVal={UPIVal}
          handleUPIValChange={e => setUPIVal(e.target.value)}
          upiValidationError={upiValidationError}
        />
      </div>
    </React.Fragment>
  );

  /* display UPI intent offers */
  const showUpiIntentFlowOffers = (bankCode: string) => {
    if (upiIntentOffers.length > 0) {
      return upiIntentOffers?.map((offer: UpiIntent) => {
        if (bankCode === offer?.code) {
          return (
            <div key={offer.offer_id} className=" bg-[#edfdf5] px-1 absolute bottom-0 rounded">
              <span className="text-[#1adb80] font-semibold text-xs">
                {t("save")} {formatPrice(+offer?.discount_amount, true, false)}
              </span>
            </div>
          );
        }
      });
    }
  };

  const displayUpiIntentApps = upiList.map((upi: UpiData) => (
    <div key={upi.code} onClick={() => setSelectedApp(upi.code)}>
      <img
        src={upi.imageUrl}
        alt={upi.name}
        className={clsx(
          "w-12 h-12 border rounded-full flex justify-center",
          selectedApp === upi.code ? "  border-color1" : "border-gray-300"
        )}
      />
      <div
        className={clsx(
          "text-xs mt-3 text-center ",
          selectedApp === upi.code ? "text-color1" : "text-gray-500",
          upiIntentOffers.length > 0 ? "mb-8" : "mb-4"
        )}
      >
        {upi.name}
      </div>
      {showUpiIntentFlowOffers(upi.code)}
    </div>
  ));

  const displayCashOnDelivery = (
    <div
      className="text-center mt-2"
      onClick={() => {
        onClose();
        handleOrder("cash");
      }}
    >
      <span className="uppercase text-sm  text-color1 font-bold text-center border-b-2 border-color1">
        Confirm cash on delivery
      </span>
      <span className="font-bold ml-2">{`(${formatPrice(payableAmount, true, false)})`}</span>
    </div>
  );

  if (upiList.length === 0 || downTimes?.status === "DOWN") {
    return null;
  }

  return (
    <PopupModal show={show} onRequestClose={onClose}>
      <div className="p-5 bg-white rounded-t-lg">
        <CloseIcon className="absolute right-5 top-5 w-6 h-6" onClick={onClose} />
        <p className="uppercase font-bold text-black text-lg text-center mb-4">
          {upiIntentOffers.length ? "Save More with upi" : `Pay ${formatPrice(payableAmount, true, false)} with UPI`}
        </p>

        <div className="flex items-center justify-around relative">
          {/* List of UPI intent apps */}
          {displayUpiIntentApps}

          {/* Enter UPI id manually */}
          <div onClick={() => setSelectedApp("enter_upi_id")}>
            <UPILogo
              className={clsx(
                " w-14 h-12 rounded-full flex justify-center border ",
                selectedApp === "enter_upi_id" ? "border-color1" : "border-gray-200"
              )}
            />
            <div
              className={clsx(
                " text-xs mt-3 text-center",
                selectedApp === "enter_upi_id" ? "text-color1" : "text-gray-500",
                upiIntentOffers.length > 0 ? "mb-8" : "mb-4"
              )}
            >
              Enter UPI Id
            </div>
          </div>
        </div>

        {selectedApp === "enter_upi_id" && dispayUpiInputField}

        <button
          disabled={selectedApp === "enter_upi_id" ? !UPIVal.length : false}
          className={clsx(
            " bg-color1 rounded font-bold uppercase w-full text-white px-4 py-2 text-sm  _analytics-gtm-payment-info mb-2",
            upiIntentOffers.length > 0 ? "mt-4" : ""
          )}
          onClick={() => handleOrder(selectedApp)}
        >
          {isLoading && <LoadSpinner className="absolute inset-0 m-auto w-8" />}
          {`${t("verify")} & Pay `}
          {formatPrice(amountAfterDiscount ? amountAfterDiscount : payableAmount, true, false)}
        </button>

        <div className="flex items-center justify-center ">
          <div className="w-full h-1 bg-gray-100 mr-2" />
          <div>OR</div>
          <div className="w-full h-1 bg-gray-100 ml-2" />
        </div>

        {/* display Cash on Delivery */}
        {displayCashOnDelivery}
      </div>
    </PopupModal>
  );
};

export default CodModal;
