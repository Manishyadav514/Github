import { PageTitlebar } from "@components/PageTitlebar";
import { useNavigate } from "@solidjs/router";
import { PartyThemeBreadcrumb } from "../../constants/BreadcrumbConstant";
import { SearchBar } from "@components/common/SearchBar";
import { SecureLoginPopup } from "@/components/LoginAlertPopup";
import { PopupModal } from "@/components/common/PopupModal";
import { createSignal, onMount } from "solid-js";
import { OTPVerificationPopup } from "@/components/OTPVerificationPopup";
import { getLocalStorageValue, setLocalStorageValue } from "@/utils/localStorage";
import { LOCALSTORAGE } from "@/constants/Storage.constant";
import { API_CONFIG } from "@/constants/api.constant";
import { hideLoader, showLoader } from "@/services/loader.service";
import { showError } from "@/utils/showToaster";
import { Pagination } from "@/components/Pagination";
import PartyThemeAPI from "@/services/party-theme.service";
import { createStore } from "solid-js/store";

export default function PartyTheme() {
  const navigate = useNavigate();
  const [mfaOTP, setMfaOTP] = createStore({ password: "MFA CODE" });
  const [mfaUUID, setMfaUUID] = createSignal("");
  const [LoginAlert, setLoginAlert] = createSignal(false);
  const [verifyPopup, setVerifyPopup] = createSignal(false);
  const [currentPageNo, setCurrentPageNo] = createSignal(1); // current active page
  const [SortOrder, setSortOrder] = createSignal<string>("createdAt DESC"); // module data
  const [moduleData, setModuledData] = createSignal<any>([]);
  const [dataCount, setDataCount] = createSignal(0); // no. of members
  const vendorCode = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
  const country = getLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME) || "IND";
  const languageFilter = getLocalStorageValue(LOCALSTORAGE.SELECTED_LANGUAGE) || "EN";
  const pageSize = API_CONFIG.pageSize;
  const partyThemeAPI = new PartyThemeAPI();

  onMount(() => {
    getPartyThemeData();
  });

  // list party theme data
  const getPartyThemeData = async () => {
    showLoader("Loading...");
    try {
      const res: any = await partyThemeAPI.fetchAllTheme(vendorCode, currentPageNo(), pageSize, SortOrder(), country, [1, 2]);
      setModuledData(res?.data?.data?.data?.data);
      setDataCount(res?.data?.data?.data?.totalRecords);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Party Theme");
      setLoginAlert(true);
    } finally {
      hideLoader();
    }
  };

  // get mfa code on you number
  const getOTP = async () => {
    try {
      const res: any = await partyThemeAPI.sendMFAOTP(vendorCode, country, languageFilter, "party-theme");
      const uuid = res?.data?.data?.uuid;
      setMfaUUID(uuid);
      return uuid;
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Party Theme");
    }
  };

  // veify otp recieved on phone
  const verifyMFAOTP = async () => {
    try {
      const res: any = await partyThemeAPI.verifyMFAOTP(
        vendorCode,
        country,
        languageFilter,
        "party-theme",
        mfaUUID(),
        mfaOTP.password
      );
      const accessToken = res?.data?.data?.details?.secure_token;
      setLocalStorageValue(LOCALSTORAGE.MFA_ACCESS_TOKEN, accessToken, true);
    } catch (err: any) {
      showError((err && err?.message) || (err && err.error && err.error.message) || "Party Theme");
      setVerifyPopup(true);
    }
  };

  // send MFA code, handle login and verofy-otp modal
  const handleLoginAlert = async () => {
    const uuid = await getOTP();
    if (uuid) {
      setLoginAlert(!LoginAlert());
      setVerifyPopup(!verifyPopup());
    }
  };

  // verify MFA code, reload theme data, and close otp verification popuop
  const handleSubmitOTP = () => {
    verifyMFAOTP();
    getPartyThemeData();
    setVerifyPopup(!verifyPopup());
  };

  // handle MFA code input in popup
  const handleOTPInput = (e: any) => {
    setMfaOTP("password", e.target.value);
  };

  // handle page change
  const handlePageChange = (page: any) => {
    setCurrentPageNo(page);
    getPartyThemeData();
  };

  return (
    <div>
      <PageTitlebar
        breadcrumb={PartyThemeBreadcrumb}
        pageTitle="Party Theme"
        btnText="Add New Party Theme"
        addBtnTrigger={() => navigate(`/party-theme/add`, { replace: false })}
      />
      <SearchBar placeholder="Search by Party Theme Name" />
      <div class="flex flex-wrap bg-white "></div>
      <PopupModal show={LoginAlert()} onRequestClose={() => setLoginAlert(!LoginAlert())}>
        <SecureLoginPopup onRequestClose={() => handleLoginAlert()} />
      </PopupModal>
      <PopupModal show={verifyPopup()} onRequestClose={() => setVerifyPopup(!verifyPopup())}>
        <OTPVerificationPopup
          onRequestClose={() => setVerifyPopup(!verifyPopup())}
          resendOTP={() => getOTP()}
          verifyOTP={() => handleSubmitOTP()}
          onInputChange={e => handleOTPInput(e)}
        />
      </PopupModal>
      <Pagination
        onPageChange={handlePageChange}
        totalItems={dataCount()}
        currentPageNo={currentPageNo()}
        noOfPageSlots={5}
        recordsPerPage={pageSize}
      />
    </div>
  );
}
