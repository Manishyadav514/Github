// @ts-ignore
import React, { useState } from "react";
import Image from "next/legacy/image";
import router from "next/router";
import { useSelector } from "@libHooks/useValtioSelector";

import DatePicker from "@amir04lm26/react-modern-calendar-date-picker";

import { ValtioStore } from "@typesLib/ValtioStore";

import ConsumerAPI from "@libAPI/apis/ConsumerAPI";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import PopupModal from "@libComponents/PopupModal/PopupModal";
import { GAgenericEvent } from "@libUtils/analytics/gtm";
import { DatePickerCss } from "@libStyles/TSStyles/datePicker";
import { addLoggedInUser } from "@libStore/actions/userActions";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const constructNewPath = (currentSearch: object, additionalSearchParam: any) => {
  const query = currentSearch;
  Object.keys(additionalSearchParam).forEach(key => {
    // @ts-ignore
    query[key] = additionalSearchParam[key];
  });
  return query;
};

const LIFESTAGE_DATA = [
  {
    id: 6,
    name: "Pregnant",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/pregnant-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/pregnant-white-icon.svg"),
    title: "Pregnant",
    dateInput: "My Due Date is",
    slug: "expecting-a-baby",
    options: "expecting, pregnant",
    text: "Enter due date to help us serve you better experience",
  },
  {
    id: 4,
    name: "Parent of 0-2 years",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/parent-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/parent-white-icon.svg"),
    title: "New Parent",
    dateInput: "My Child's Date of Birth",
    slug: "new-parents",
    options: "new parent",
    text: "Enter child's date of birth to help us serve you better experience",
  },
  {
    id: 5,
    name: "Parent of 2+ years",
    pinkIcon: getStaticUrl("/svg/lifestage-icons/child-pink-icon.svg"),
    whiteIcon: getStaticUrl("/svg/lifestage-icons/child-white-icon.svg"),
    title: "Toddler",
    dateInput: "My Child's Date of Birth",
    slug: "toddler",
    options: "toddler",
    text: "Enter child's date of birth to help us serve you better experience",
  },
];
// @ts-ignore
const LifeStageModal = ({ show, hide }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [inputDateText, setInputDateText] = useState("");
  const [selectedLifestage, setSelectedLifestage] = useState<any>(null);

  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));

  const handleLifeStageSelection = (lifestage: any) => {
    setSelectedLifestage(lifestage);
    setInputDateText(lifestage?.dateInput);
  };

  const handleSubmit = async () => {
    if (profile?.id) {
      // @ts-ignore
      const birthDate = new Date(`${selectedDay.year}-${selectedDay?.month}-${selectedDay?.day}`).toISOString();
      const payload = {
        meta: {
          babyDetails: {
            ...(selectedLifestage?.id !== 5 && { dob: birthDate }),
            lifestage: {
              name: selectedLifestage?.title,
              type: selectedLifestage?.id,
              seo_url: selectedLifestage?.slug,
              slug: selectedLifestage?.slug,
            },
          },
        },
      };

      const consumerApi = new ConsumerAPI();
      if (checkUserLoginStatus()?.memberId) {
        await consumerApi
          .updateProfilePatch(checkUserLoginStatus()?.memberId, payload)
          .then(() =>
            consumerApi
              .getProfile(localStorage.getItem("memberId") as string)
              .then(({ data: profileData }) => addLoggedInUser(profileData.data))
          );
      }

      GAgenericEvent(
        "engagement",
        "bbc-pwa-select-lifestage",
        `${payload?.meta?.babyDetails?.lifestage?.type} ${payload?.meta?.babyDetails?.lifestage.seo_url}`
      );
    } else {
      const newQuery = constructNewPath(router?.query, { lifestage: selectedLifestage?.id });
      localStorage.setItem("guest_user_lifestage", selectedLifestage?.id);
      router.push(
        {
          query: {
            ...newQuery,
          },
        },
        undefined,
        { shallow: true }
      );
    }
    setSelectedDay(null);
    setInputDateText("");
    setSelectedLifestage(null);
    hide(false);
  };
  return (
    <PopupModal show={show} onRequestClose={hide} type="center-modal">
      <div className="bg-white">
        <div
          className="relative w-screen h-screen bg-white text-center py-28 px-12  "
          style={{
            maxWidth: "500px",
            background: `url("/images/bbc-g3/login-modal-bg.png") no-repeat`,
            backgroundSize: "450px 420px",
          }}
        >
          <span className="absolute top-4 right-4">
            <Image
              alt="close icon"
              src={getStaticUrl("/images/bbc-g3/ico-close-popup.png")}
              className=""
              priority
              width="20"
              height="20"
              layout="intrinsic"
              objectFit="contain"
              onClick={() => hide(false)}
            />
          </span>
          {!selectedLifestage?.id ? (
            <div className="my-8">
              <p>
                Select your <span className="font-bold">lifestage </span>for better experience
              </p>
              {LIFESTAGE_DATA.map((lifestage: any) => (
                <div
                  role="button"
                  tabIndex={lifestage.id}
                  key={lifestage.id}
                  className="flex justify-between py-3 px-4 items-center bg-white my-4 rounded-sm border border-pink-100"
                  onClick={() => handleLifeStageSelection(lifestage)}
                >
                  <div className="flex items-center">
                    <div className="bg-pink4 rounded-full w-12 p-1">
                      <Image
                        alt={lifestage.name}
                        className=""
                        src={lifestage.pinkIcon}
                        objectFit="contain"
                        height="28"
                        width="28"
                      />
                    </div>
                    <div className="pl-4 text-black font-base"> {lifestage.name} </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="date-selection my-12 ">
              {DatePickerCss}

              <p className="py-8 max-w-[270px]">{selectedLifestage?.text} </p>
              <DatePicker
                value={selectedDay}
                onChange={setSelectedDay}
                inputPlaceholder={inputDateText || "Select Date"}
                locale="en"
                wrapperClassName="w-10/12"
                inputClassName="h-12 text-left w-full font-base text-black"
              />

              <button
                type="button"
                className={` h-12 fixed left-0 right-0 mx-auto w-[60%] bottom-20 ${
                  !selectedDay ? "bg-gray-300" : ""
                } text-xs font-black text-white rounded bg-color1 uppercase pl-5 pr-5 pt-2 pb-2 `}
                onClick={() => handleSubmit()}
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </PopupModal>
  );
};

export default LifeStageModal;
