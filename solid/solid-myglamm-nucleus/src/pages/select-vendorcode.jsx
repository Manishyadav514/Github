import { CommonIcon } from "../components/CommonIcon";
import { LOCALSTORAGE } from "../constants/Storage.constant";
import { getLocalStorageValue, setLocalStorageValue } from "../utils/localStorage";
import { onMount, createSignal } from "solid-js";
import { showError } from "../utils/showToaster";
import { vendorDomainUrlMap } from "../constants/App.constant";
import { CountrySelectionModal } from "../components/CountrySelectionModal";
import { PopupModal } from "../components/common/PopupModal";
import LocationAPI from "../services/location.service";

export default function SelectVendorCode() {
  const { allowedVendorCodes } = localStorage.getItem(LOCALSTORAGE.LOGGED_IN_USER)
    ? getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true)
    : "";

  const [userVendors, setUserVendors] = createSignal([]);
  const [userCountries, setUserCountries] = createSignal([]);
  const [toggleCountryPopup, setToggleCountryPopup] = createSignal(false);
  const locationAPI = new LocationAPI();

  onMount(() => {
    let vendorCodeAllowed = [];
    vendorDomainUrlMap.map(resp => {
      allowedVendorCodes.map(res => {
        if (resp.vendorCode === res && import.meta.env.NUCLEUS_ENV === resp.env) {
          vendorCodeAllowed.push(resp);
        }
      });
    });
    setUserVendors(vendorCodeAllowed);
    fetchAllActiveCountries();
  });

  const onSelectVendor = selectedVendor => {
    setLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE, selectedVendor?.vendorCode);
    setToggleCountryPopup(!toggleCountryPopup());
  };

  const fetchAllActiveCountries = async () => {
    const countryList = await getUserAllowedCountries();
    const where = { countryName: countryList };
    const { data } = await locationAPI.fetchCountries(where);
    if (data?.data) {
      setUserCountries(data?.data);
    }
  };

  const getUserAllowedCountries = () => {
    const currentUser = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);
    if (!currentUser.allowedCountries || !currentUser.allowedCountries.length) {
      showError("User has no access to countries. Please login again");
      return null;
    }
    return currentUser.allowedCountries;
  };

  return (
    <>
      <div class="h-screen flex items-center bg-slate-200/50">
        <PopupModal show={toggleCountryPopup()} onRequestClose={setToggleCountryPopup(!toggleCountryPopup())}>
          <CountrySelectionModal onRequestClose={setToggleCountryPopup(!toggleCountryPopup())} countryList={userCountries()} />
        </PopupModal>
        <div class="p-4 flex items-center justify-center flex-wrap">
          {userVendors()?.map(vendor => (
            <div
              class="m-3.5 py-2.5 px-5 bg-white rounded-2xl flex items-center group cursor-pointer"
              onClick={() => {
                onSelectVendor(vendor);
              }}
            >
              <img src={`/images/img-${vendor.vendorCode}.jpg`} alt={vendor.vendorCode} />
              <span class="w-11 h-11 rounded-full bg-primary shrink-0 flex items-center justify-center duration-300 translate-x-0 group-hover:translate-x-2.5 text-white">
                <CommonIcon icon="material-symbols:arrow-right-alt" height={30} width={30}  />
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
