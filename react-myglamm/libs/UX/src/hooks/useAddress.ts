import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import clsx from "clsx";
import { useSelector } from "@libHooks/useValtioSelector";
import { useForm } from "react-hook-form";

import CartAPI from "@libAPI/apis/CartAPI";
import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { ADOBE } from "@libConstants/Analytics.constant";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

import MyGlammAPI from "@libAPI/MyGlammAPI";

import Adobe from "@libUtils/analytics/adobe";
import { showError } from "@libUtils/showToaster";
import { GA4Event } from "@libUtils/analytics/gtm";
import { anonUserCheck } from "@libUtils/anonUserCheck";
import { getCurrency } from "@libUtils/format/formatPrice";
import { formatPlusCode } from "@libUtils/format/formatPlusCode";
import { getLocalStorageValue, removeLocalStorageValue, setLocalStorageValue } from "@libUtils/localStorage";

import { addLoggedInUser } from "@libStore/actions/userActions";

import { DutyModalProps } from "@typesLib/Payment";
import { ValtioStore } from "@typesLib/ValtioStore";
import { addressInitialValues, UserAddress } from "@typesLib/Consumer";
import { EditAddressPayload, AddAddressPayload } from "@typesLib/MyGlammAPI";
import { InternationalShippingCountryList } from "@typesLib/Redux";
import { cartProduct, productCategory } from "@typesLib/Cart";

import { removeEmptyObject } from "@libServices/PLP/filterHelperFunc";

import { checkDutyChanges } from "@checkoutLib/Payment/HelperFunc";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import { ADDRESS_FORM_MODAL_STATE } from "@libStore/valtioStore";
import { CONSTANT_REDUCER, USER_REDUCER } from "@libStore/valtio/REDUX.store";

import useTranslation from "./useTranslation";
import useEffectAfterRender from "./useEffectAfterRender";
import useFetchInternationalCountryList from "./useFetchInternationalCoutryList";

import { REGEX } from "@libConstants/REGEX.constant";

function callAdobe(status: "success" | "failure", type: "add" | "edit") {
  (window as any).digitalData = {
    common: {
      pageName: `web|order checkout|${type} address|${status}`,
      newPageName: `order checkout - ${type} address ${status}`,
      subSection: "order checkout step2",
      assetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      newAssetType: ADOBE.ASSET_TYPE.CHECKOUT_ADDRESS,
      platform: ADOBE.PLATFORM,
      pageLocation: "",
      technology: ADOBE.TECHNOLOGY,
    },
    user: Adobe.getUserDetails(),
  };
}

export type useAddressProps = {
  initialState?: EditAddressPayload;
  isAddAddress: boolean;
  onBack?: () => void;
  dutyCallback: (arg1: DutyModalProps) => void;
};

function useAddress(options: useAddressProps) {
  const [cityDetails, setCityDetials] = useState<any>();
  const [isPageReady, setIsPageReady] = useState(false);
  const [isAddressFetched, setIsAddressFetched] = useState(false);
  const [addressCountryData, setAddressCountryData] = useState<InternationalShippingCountryList | undefined>();

  const [currentAddress, setCurrentAddress] = useState<UserAddress>();
  useFetchInternationalCountryList();

  const router = useRouter();

  const { t } = useTranslation();

  const isLoggined = checkUserLoginStatus();

  const redirectOnSuccess = () => {
    /* By Default set Redirection url to "/chooseAddress" */
    let rdtUrl = guest ? "payment" : "chooseAddress";

    const addAddressFrom = getLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM);

    /* if user is updating address from cancellation reasons modal on order details page we hide the form after success - no redirect case */
    if (addAddressFrom === "order-details") {
      ADDRESS_FORM_MODAL_STATE.showAddressForm = false;
      removeLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM);
    } else {
      /* Check if redirected from payment and incase yes then redirect back onSuccess */
      rdtUrl = `/${addAddressFrom || "payment"}`;

      // CLEANUP
      removeLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM);

      router.replace(rdtUrl);
    }
  };

  const { profile, address, isdCodes, citiesConstants, userCart, addressCountry } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
    address: store.userReducer.userAddress,
    isdCodes: store.constantReducer.isdCodes,
    citiesConstants: store.constantReducer.citiesConstants,
    userCart: store.cartReducer.cart,
    addressCountry: store.constantReducer.addressCountryList,
  }));

  const guest = getLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS, true);
  const PHONE_CODE = profile?.location?.phoneCode || "91";

  const SAME_COUNTRY_USER = isdCodes?.find(
    x => (profile && x.countryCode === PHONE_CODE) || (!guest && x.id === userCart.countryId)
  );
  const addressForm = useForm<addressInitialValues>({
    defaultValues: {
      defaultFlag: true,
      name: (!anonUserCheck(profile) && profile?.firstName) || guest?.name || "",
      phoneNumber: (SAME_COUNTRY_USER && profile?.phoneNumber) || guest?.phoneNumber || "",
      addressNickName: "Home",
      email: (!anonUserCheck(profile) && profile?.email) || guest?.email || "",
      zipcode: guest?.zipcode || "",
      cityName: "",
      stateName: "",
      location: guest?.location || "",
      apartment: guest?.apartment || "",
      area: guest?.area || "",
      ...(guest?.countryCode ? { countryCode: guest?.countryCode } : {}),
    },
    mode: "onChange",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });

  const [zipcode, countryName, countryCode] = addressForm.watch(["zipcode", "countryName", "countryCode"]);

  /* Matching the country label or first country */
  const SELECTED_COUNTRY = isdCodes?.find(x => x.countryLabel === countryName) || isdCodes?.[0];

  async function handleFormSubmit(value: addressInitialValues) {
    if (!value.name.match(REGEX.VALID_NAME)) console.error("INVALID_NAME", value.name);
    const addressPayload = removeEmptyObject({
      ...(currentAddress || {}),
      ...value,
      name: value.name?.replace(REGEX.VALID_NAME, " ").replaceAll(/\s+/g, " ").trim(),
      uiTemplate: SELECTED_COUNTRY?.uiTemplate,
      email: value.email || profile?.email || "",
      zipcode: value.zipcode?.replace(/\s/g, "") || currentAddress?.zipcode || "",
      cityName: value.cityName || cityDetails?.cityName || currentAddress?.cityName || "",
      stateName: cityDetails?.stateName || currentAddress?.stateName || "",
      identifier: profile?.id || "",
      defaultFlag: value.defaultFlag ? "true" : "false",
      cityId:
        cityDetails?.cityId.toString() ||
        citiesConstants?.find(x => x.cityName === value.cityName)?.id?.toString() ||
        currentAddress?.cityId ||
        "",
      stateId: cityDetails?.stateId.toString() || currentAddress?.stateId || "",
      countryName: value.countryName || cityDetails?.countryLabel || currentAddress?.countryName || "",
      countryId: cityDetails?.countryId.toString() || SELECTED_COUNTRY?.id?.toString() || currentAddress?.countryId || "",
      ...(addressCountryData && addressCountryData?.isoCode3 ? { isoCode3: addressCountryData?.isoCode3 } : { isoCode3: "" }),
    });
    // @ts-ignore
    delete addressPayload.ISDCode;

    /* GUEST USER */
    if (!isLoggined) {
      const cartApi = new CartAPI();

      cartApi.getGuestToken(value.phoneNumber).then(({ data }: any) => {
        setLocalStorageValue(LOCALSTORAGE.GUEST_TOKEN, data.token);
        setLocalStorageValue(LOCALSTORAGE.GUEST_DETAILS, addressPayload, true);
        setLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM, "payment");
        USER_REDUCER.shippingAddress = addressPayload as unknown as UserAddress;

        onSuccess(undefined, addressPayload as unknown as UserAddress);
        GA4Event([
          {
            event: "add_shipping_info",
            ecommerce: {
              currency: getCurrency(),
              value: userCart?.netAmount,
              coupon: userCart?.couponData?.couponCode,
              items: userCart?.allProducts.map((p: cartProduct, index) => {
                return {
                  item_id: p.productId,
                  item_name: p.name,
                  discount: p.totalPrice - p.priceAfterCouponCodePerQuantity,
                  coupon: userCart?.couponData?.couponCode ?? "",
                  quantity: p.quantity,
                  price: p.price,
                  index,
                  item_brand: p.brandName,
                  item_category:
                    p.productCategory?.filter((category: productCategory) => category.type === "parent")?.[0]?.name ?? "",
                  item_category_2:
                    p.productCategory?.filter((category: productCategory) => category.type === "child")?.[0]?.name ?? "",
                  item_category_3:
                    p.productCategory?.filter((category: productCategory) => category.type === "subChild")?.[0]?.name ?? "",
                  item_variant: p.shadeLabel,
                };
              }),
            },
          },
        ]);
      });
    } else {
      const consumerApi = new ConsumerAPI();
      try {
        /**
         * Add a New Domestic Address
         */
        if (options.isAddAddress) {
          await consumerApi
            .addAddress(addressPayload as AddAddressPayload)
            .then(onSuccess)
            .catch(e => {
              console.error(e.response?.data?.message || { message: "Add address error", e });
              showError(e.response?.data?.message || "Error");
            });
        } else {
          /**
           * Updating existing Address
           */
          await consumerApi
            .editAddress(addressPayload as EditAddressPayload)
            .then(res => onSuccess(res, addressPayload as UserAddress))
            .catch(e => {
              console.error(e.response?.data?.message || { message: "Edit address error", e });
              showError(e.response?.data?.message || "Error");
            });
        }
      } catch (error: any) {
        console.error("addAddress error on ", options.isAddAddress ? "add" : "edit", error);
        // Adobe Analytics[27] - Page Load - Add Address Failure API
        callAdobe("failure", options.isAddAddress ? "add" : "edit");
      }
    }

    Adobe.PageLoad();
  }

  const onSuccess = async (res: any, editAddress?: UserAddress) => {
    /* Update All Addresses in REDUX */
    if (isLoggined) {
      const consumerApi = new ConsumerAPI();
      consumerApi
        .getAddress({ identifier: isLoggined?.memberId, statusId: 1 }, 0)
        .then(({ data: rs }) => (USER_REDUCER.userAddress = rs?.data?.data))
        .catch(() => console.error("Address API Failed"));

      // Adobe Analytics[26] - Page Load - Add Address Success API
      callAdobe("success", options.isAddAddress ? "add" : "edit");

      /**
       * `anon_${profile?.phoneNumber}` tempName
       * Update User Profile in case temporary name is used
       */
      if (anonUserCheck(profile) && options.isAddAddress) {
        const consumerApi = new ConsumerAPI();
        setTimeout(
          () =>
            consumerApi
              .getProfile(localStorage.getItem("memberId") as string)
              .then(({ data: profileData }) => addLoggedInUser(profileData.data)),
          1000
        );
      }
    }

    /* Duty Check For Middle-East in case of add/edit when redirecting to payment only */
    const shippingAddress = editAddress || (res?.data?.data as UserAddress);

    if (shippingAddress.uiTemplate === "template_are" && getLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM) === "payment") {
      try {
        const dutyData = await checkDutyChanges(userCart.totalDutyCharges, shippingAddress);

        if (dutyData) {
          /* Retriggering AddressPage for Duty(Add === Edit) */
          setCurrentAddress(shippingAddress);
          return options.dutyCallback(dutyData);
        }
      } catch (err: any) {
        showError(err.response?.data?.message || err);
      }
    }

    if (options.isAddAddress || getLocalStorageValue(LOCALSTORAGE.ADD_ADDRESS_FROM) === "payment") {
      USER_REDUCER.shippingAddress = shippingAddress;
    }
    // only on desktop back is used and only on modals, so avoid it on Add Shipping address page
    if (router.pathname === "/add-shipping-address") {
      router.push("/checkout");
      return;
    }
    if (options.onBack) options.onBack();
    else redirectOnSuccess();
  };

  async function getAddresses() {
    try {
      const consumerApi = new ConsumerAPI();
      const { data } = await consumerApi.getAddress({ identifier: isLoggined?.memberId, statusId: 1 }, 0, 25);

      setIsAddressFetched(true);

      if (data.data.count === 0 && !options.isAddAddress) {
        return router.replace("/chooseAddress");
      }
      return (USER_REDUCER.userAddress = data.data.data);
    } catch (error: any) {
      return console.error(error);
    }
  }

  /**
   * Get the Addresses if not available in Redux Store
   */
  useEffect(() => {
    if (address.length === 0 && profile && !isAddressFetched) {
      getAddresses();
    }
  }, [profile, address]);

  useEffect(() => {
    if (userCart?.allowIntShipping && addressCountry?.length) {
      const selectedCountry = addressCountry.find(x => x?.isoCode3 === guest?.isoCode3);
      setAddressCountryData(selectedCountry || addressCountry?.[0]);
    }
  }, [userCart?.allowIntShipping, addressCountry]);

  useEffect(() => {
    if (MyGlammAPI?.Filter?.AddressCountryCode !== addressCountryData?.isoCode3 && userCart?.allowIntShipping) {
      MyGlammAPI?.changeAddressCountryCode(
        {
          countryCode: addressCountryData?.isoCode3,
        } || ""
      );
    }
  }, [addressCountryData]);

  /**
   * Get the current addess details for Edit Form
   */
  async function getCurrentAddressData(guestAddress?: UserAddress) {
    const filteredAddress =
      (options.initialState as UserAddress) ||
      guestAddress ||
      address?.find(add => add.id === (router.query.slug || ADDRESS_FORM_MODAL_STATE.editAddressId));
    if (filteredAddress) {
      setCurrentAddress(filteredAddress);
      const { location, societyName, flatNumber, countryCode } = filteredAddress;
      addressForm.reset(
        removeEmptyObject({
          ...filteredAddress,
          ...(filteredAddress.defaultFlag === "true" ? {} : { defaultFlag: false }),
          countryCode: formatPlusCode(countryCode, true),
          location: flatNumber || societyName ? clsx(flatNumber, societyName, location) : location,
        })
      );
    }

    await getCitiesByCountry(filteredAddress?.cityName, filteredAddress?.countryName);

    if (userCart?.allowIntShipping && addressCountry?.length) {
      setIsPageReady(true);
    } else if (userCart?.allowIntShipping !== undefined && !userCart?.allowIntShipping) {
      setIsPageReady(true);
    }
  }

  async function setAddressForm() {
    if (profile) {
      /**
       * In-case firstName matches the backend default name don't populate
       *  address Name and emailField
       */
      const NEW_ADDRESS: any = {
        defaultFlag: true,
        addressNickName: "Home",
      };
      if (!anonUserCheck(profile)) {
        NEW_ADDRESS.name = clsx(profile.firstName, profile?.lastName);
        NEW_ADDRESS.email = profile.email;
      }

      if (SAME_COUNTRY_USER) {
        NEW_ADDRESS.countryCode = formatPlusCode(PHONE_CODE, true);
        NEW_ADDRESS.phoneNumber = profile.phoneNumber;
        NEW_ADDRESS.countryName = isdCodes?.find(x => x.countryCode === PHONE_CODE)?.countryLabel;
      }

      addressForm.reset(NEW_ADDRESS);
    } else if (SAME_COUNTRY_USER) {
      // guest detect country
      addressForm.reset({
        countryCode: SAME_COUNTRY_USER.countryCode,
        countryName: SAME_COUNTRY_USER.countryLabel,
      });
    }

    await getCitiesByCountry(undefined, SAME_COUNTRY_USER?.countryLabel);

    setIsPageReady(true);
  }

  async function getCitiesByCountry(cityName?: string, countryName?: string) {
    const SELECTED_COUNTRY_ID = isdCodes?.find(x => x.countryLabel === countryName)?.id || SELECTED_COUNTRY?.id;
    if (SELECTED_COUNTRY?.uiTemplate === "template_are" && SELECTED_COUNTRY_ID !== citiesConstants?.[0].countryId) {
      const consumerApi = new ConsumerAPI();
      const { data: cities } = await consumerApi.getAllCities(SELECTED_COUNTRY_ID as number);

      CONSTANT_REDUCER.citiesConstants = cities.data;

      setTimeout(
        () =>
          addressForm.setValue(
            "cityName",
            cities?.data?.find((x: any) => x.cityName === cityName) ? cityName : cities.data?.[0]?.cityName
          ),
        100
      );
    } else if ((cityName || citiesConstants?.[0].cityName) && options.isAddAddress) {
      addressForm.setValue("cityName", cityName || citiesConstants?.[0].cityName || "");
    }
  }

  // API CALL, getProfile
  useEffect(() => {
    if (profile && isdCodes) {
      if (options.isAddAddress) {
        setAddressForm();
      } else if (address.length > 0) {
        getCurrentAddressData();
      }
    } else if (!checkUserLoginStatus() && isdCodes) {
      // For Guest
      getCurrentAddressData(guest);
    }
  }, [address, profile, isdCodes, addressCountry]);

  /**
   * Run useEffect on change for Pincode and Zipcode to fetch the City and
   * State details, display Error message for invlid picode
   */
  useEffect(() => {
    const pin = zipcode;
    /**
     * check for white space between digits & length , entered digits only
     */
    if (
      (pin && pin.replace(/\s/g, "").length === 6 && pin.replace(/\s/g, "").match(/^\d+$/)) ||
      (userCart?.allowIntShipping &&
        pin &&
        addressCountryData &&
        new RegExp(addressCountryData?.pinCodeRegex?.slice(1, -1)).test(pin))
    ) {
      (async function getcity() {
        const consumerApi = new ConsumerAPI();
        const { data } = await consumerApi.getCityDetails([pin.replace(/\s/g, "")]);
        /**
         * Set Field value if recieve valid data else set Field error message
         */
        if (data.code === 200 && data.data.length > 0) {
          setCityDetials(data.data[0]);
          addressForm.setValue("cityName", data.data[0].cityName, { shouldValidate: true });
          addressForm.setValue("stateName", data.data[0].stateName, { shouldValidate: true });
          addressForm.setValue("countryName", data.data[0].countryLabel, { shouldValidate: true });
        } else {
          addressForm.setError("zipcode", {
            type: "required",
            message: t("pleaseEnterPinCode"),
          });
        }

        MyGlammAPI?.changeAddressCountryCode(
          {
            countryCode: addressCountryData?.isoCode3,
            pincode: pin,
          } || {}
        );

        addressForm.clearErrors("zipcode");
      })();
    } else if (pin) {
      addressForm.setError("zipcode", {
        type: "required",
        message: t("sixpincodeValidation"),
      });
    }
  }, [zipcode, addressCountryData]);

  /* After Everything Loaded if country is changed again then call Cities API */
  useEffect(() => {
    if (isPageReady && countryName) {
      getCitiesByCountry(guest?.cityName);
    }
  }, [countryName, isPageReady]);

  useEffectAfterRender(() => {
    if (countryCode && isPageReady && isdCodes) {
      addressForm.setValue("phoneNumber", "", { shouldValidate: true });
      addressForm.setValue("zipcode", "", { shouldValidate: true });
      // addressForm.setValue("countryName", "", { shouldValidate: true });
    }
  }, [countryCode]);

  return {
    addressForm,
    handleFormSubmit,
    addressCountryData,
    setAddressCountryData,
    isInternationalShipping: userCart.allowIntShipping,
    state: { isPageReady, SELECTED_COUNTRY },
  };
}

export default useAddress;
