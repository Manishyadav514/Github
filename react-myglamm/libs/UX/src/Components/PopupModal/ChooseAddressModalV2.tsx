import { useManageAddress } from "@libHooks/useManageAddress";
import PopupModal from "./PopupModal";
import useTranslation from "@libHooks/useTranslation";
import CloseIcon from "../../../public/svg/group-2.svg";
import { getFormattedAddress } from "@checkoutLib/Payment/HelperFunc";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";
import AddressForm from "@libComponents/Form/AddressForm";
import { setLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";
import { ADDRESS_FORM_MODAL_STATE } from "@libStore/valtioStore";
import { useSnapshot } from "valtio";
import { useState, useEffect } from "react";
import { useSelector } from "@libHooks/useValtioSelector";
import { ValtioStore } from "@typesLib/ValtioStore";
import { fetchIsPincodeServiceable } from "@libStore/actions/userActions";
import { UserAddress } from "@typesLib/Consumer";
import LoadSpinner from "@libComponents/Common/LoadSpinner";
import OrderAPI from "@libAPI/apis/OrderAPI";
import { useRouter } from "next/router";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { showError, showCustom } from "@libUtils/showToaster";
import { ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";
import { ADOBE } from "@libConstants/Analytics.constant";
import Adobe from "@libUtils/analytics/adobe";

interface IChooseAddressModalV2 {
  show: boolean;
  hide: () => void;
  shippingAddress: any;
  handleChangeAddressCallback?: (address: UserAddress) => void;
}

const ChooseAddressModalV2 = ({ show, hide, shippingAddress, handleChangeAddressCallback }: IChooseAddressModalV2) => {
  const { userAddress, handleDeleteAddress } = useManageAddress();
  const [isAddAddressForm, setIsAddAddressForm] = useState(true);
  const { t } = useTranslation();
  const ADDRESS_FORM = useSnapshot(ADDRESS_FORM_MODAL_STATE);
  const isPincodeServiceable = useSelector((store: ValtioStore) => store.userReducer.isPincodeServiceable);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress>(shippingAddress);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleEditAddress = (id: any) => {
    setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "order-details");
    ADDRESS_FORM_MODAL_STATE.editAddressId = id;
    ADDRESS_FORM_MODAL_STATE.showAddressForm = true;
    setIsAddAddressForm(false);
  };

  const checkIfPinCodeisServicable = (address: any) => {
    setSelectedAddress(address);
    fetchIsPincodeServiceable(address as UserAddress);
  };

  const handleChangeAddress = async (address: any) => {
    if (handleChangeAddressCallback) {
      handleChangeAddressCallback(address);
      return;
    }
    setIsSubmitting(true);
    const orderAPI = new OrderAPI();
    const orderId = router.query.order || "";
    const { memberId } = checkUserLoginStatus() || {};
    // Custom payload for change address
    const addressDataPayLoad = {
      identifier: memberId,
      shippingAddress: {
        addressId: address?.id,
        cityId: address?.cityId,
        cityName: address?.cityName,
        email: address?.email,
        phoneNumber: address?.phoneNumber,
        consumerName: address?.name,
        stateName: address?.stateName,
        stateId: address?.stateId,
        countryName: address?.countryName,
        countryId: address?.countryId,
        addressNickName: address?.addressNickName,
        location: address?.location,
        zipcode: address?.zipcode,
        identifier: memberId,
      },
    };

    try {
      const orderUpdated = await orderAPI.updateOrderShippingAddress(orderId, memberId, addressDataPayLoad);
      if (orderUpdated?.data?.code === 200 && orderUpdated?.data?.data?.orderId) {
        showCustom(t("orderUpdatedSuccessText") || "Order has been updated successfully!", 3000);
        setTimeout(() => {
          router.push({ pathname: "/my-orders" });
        }, 800);
      }
    } catch (error: any) {
      setIsSubmitting(false);
      console.error(error);
      showError(error.response?.data?.message || "Oops something went wrong!");
    }
  };

  useEffect(() => {
    /* Adobe Page Load Event - Post Order - Address Edit Modal */
    ADOBE_REDUCER.adobePageLoadData = {
      common: {
        pageName: `web|address edit`,
        newPageName: `post order address edit`,
        subSection: "address edit",
        assetType: "address edit",
        newAssetType: "address edit",
        platform: ADOBE.PLATFORM,
        pageLocation: "order details",
        technology: ADOBE.TECHNOLOGY,
      },
    };
  }, []);

  /* Adobe On Click Event - Post Order - Address Edit - Confirm Address */
  const adobeClickEventEditAddressConfirmAddress = (ctaName: string) => {
    (window as any).digitalData = {
      common: {
        linkName: `web|address edit screen|Confirm Address`,
        linkPageName: `web|address edit popup|Submit`,
        newLinkPageName: "address edit screen",
        assetType: "",
        newAssetType: "",
        subSection: "",
        platform: ADOBE.PLATFORM,
        ctaName,
        pageLocation: "Order Details",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <PopupModal show={show} onRequestClose={hide}>
      {ADDRESS_FORM?.showAddressForm ? (
        <div className="bg-white rounded-t-3xl flex flex-col pt-4">
          <AddressForm isAddAddress={isAddAddressForm} />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-t-3xl flex flex-col">
            <div className="py-4 pl-4 border-b border-gray-100/75 mb-5">
              <p className="text-base font-bold">{t("selectDeliveryAddressTitle") || "Select a delivery address"}</p>
              <CloseIcon onClick={hide} className="absolute right-3 top-3" />
            </div>
            <div className="overflow-y-auto overflow-x-hidden max-h-72">
              {userAddress?.length > 0 ? (
                userAddress?.map((address: any) => (
                  <div className="flex border-b-8 border-gray-100/50 space-x-2 mb-4" key={address?.id}>
                    <div className="flex ml-4">
                      <input
                        id={address?.id}
                        type="radio"
                        className="radio-input"
                        name="select-address"
                        value={address?.id}
                        defaultChecked={shippingAddress?.id === address?.id}
                        onChange={() => setSelectedAddress(address)}
                      ></input>
                    </div>

                    <div className="flex flex-col pb-4">
                      <label
                        htmlFor={address?.id}
                        onClick={() => {
                          checkIfPinCodeisServicable(address);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-1 items-center">
                            <p className="text-sm font-semibold">{address?.name}</p>
                            <div className="text-10 text-color1 font-semibold bg-color2 py-0.5 px-1.5 rounded">
                              {address?.addressNickName}
                            </div>
                          </div>
                          <div className="flex justify-end pr-3">
                            {address?.defaultFlag === "true" && (
                              <span className="float-right text-10 py-0.5 px-1.5 bg-gray-100 text-gray-600 rounded">
                                {t("defaultAddress") || "Default Address"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-2 text-gray-600 flex flex-col space-y-2">
                          <p className="text-xs w-4/5" dangerouslySetInnerHTML={{ __html: getFormattedAddress(address) }} />
                          <p className="text-xs">
                            <bdi>
                              {formatPlusCode(address?.countryCode || "91")}&nbsp;{address?.phoneNumber}
                            </bdi>
                          </p>
                        </div>
                      </label>

                      <div className="flex mt-2">
                        <button
                          type="button"
                          className="text-color1 font-semibold text-xs"
                          aria-label="Edit Button"
                          onClick={() => handleEditAddress(address?.id)}
                        >
                          {t("edit") || "Edit"}
                        </button>
                        {address?.defaultFlag !== "true" && (
                          <button
                            type="button"
                            className="ml-10 text-color1 font-semibold text-xs"
                            aria-label="Delete Button"
                            onClick={() => handleDeleteAddress(address?.id)}
                          >
                            {t("delete") || "Delete"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <LoadSpinner className="w-12 absolute inset-0 m-auto" />
              )}
            </div>

            <div className="px-4 py-2 w-full flex justify-between">
              <button
                type="button"
                className="text-sm w-1/2 mr-2 p-2 rounded-sm uppercase font-semibold"
                style={{
                  border: "1px solid #fde1e1",
                  color: "#fab6b5",
                }}
                onClick={e => {
                  e.stopPropagation();
                  setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "order-details");
                  setIsAddAddressForm(true);
                  ADDRESS_FORM_MODAL_STATE.showAddressForm = true;
                }}
              >
                <span>&#65291; {t("addNew" || "Add new address")}</span>
              </button>

              <button
                type="button"
                className="text-sm w-1/2 p-2 rounded-sm	uppercase font-semibold text-white bg-color1"
                disabled={!isPincodeServiceable || isSubmitting || shippingAddress?.id === selectedAddress?.id}
                onClick={() => {
                  handleChangeAddress(selectedAddress);
                  adobeClickEventEditAddressConfirmAddress("Confirm Address");
                }}
              >
                {isPincodeServiceable
                  ? isSubmitting
                    ? "Updating..."
                    : t("confirmAddress") || "Confirm Address"
                  : "Not Serviceable"}
              </button>
            </div>
          </div>
          <style>
            {`.radio-input {
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-clip: content-box;
            width: 20px;
            height: 20px;
            border: 1px solid #979797;
            padding: 4px;
            display: inline-block;
            border-radius: 50%;
            }
        .radio-input:checked {
            background-color: var(--color1);
            border: 1px solid var(--color1);
            }
        `}
          </style>
        </>
      )}
    </PopupModal>
  );
};
export default ChooseAddressModalV2;
