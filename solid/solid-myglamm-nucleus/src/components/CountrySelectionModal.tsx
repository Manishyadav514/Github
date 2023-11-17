import { createSignal, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { CommonButton } from "./CommonButton";
import { getLocalStorageValue, setLocalStorageValue } from "../utils/localStorage";
import { LOCALSTORAGE } from "../constants/Storage.constant";
import { themeConfig } from "../constants/Theme.constant";

interface ICountrySelectionProps {
  onRequestClose: () => void;
  countryList: Array<any>;
}

const country = [
  {
    name: "India",
    image_url: "https://files.babychakra.com/site-images/original/india.png",
  },
  {
    name: "Saudi Arabia",
    image_url: "https://files.babychakra.com/site-images/original/saudi-arabia.png",
  },
  {
    name: "United Arab Emirates",
    image_url: "https://files.babychakra.com/site-images/original/united-arab-emirates.png",
  },
];
function CountrySelectionModal(props: ICountrySelectionProps) {
  const [selectedCountry, setSelectedCountry] = createSignal(null);
  const navigate = useNavigate();
  const selectedVendor = getLocalStorageValue(LOCALSTORAGE.SELECTED_VENDORCODE);
  const theme: any = themeConfig;

  const setTheme = () => {
    document.documentElement.style.setProperty("--primary-color", theme?.[selectedVendor]?.primaryColor);
    document.documentElement.style.setProperty("--primary-light-color", theme?.[selectedVendor]?.primaryLight);
  };

  return (
    <div class="bg-white w-8/12 absolute mx-auto top-20 left-0 right-0 p-4 rounded-lg">
      <p class="text-lg">Select Country {selectedCountry()}</p>
      <div onClick={() => props.onRequestClose()}>
        <span role="button" class="absolute top-2 right-3 text-xl cursor-pointer">
          &#10005;
        </span>
      </div>

      <div class="flex space-x-6 items-center my-10">
        <For each={props.countryList}>
          {item => (
            <div
              class={`relative border w-40 h-48 flex flex-col cursor-pointer justify-center items-center text-center px-4 hover:border-primary  rounded-md ${
                (selectedCountry() as any)?.countryLabel === item.countryLabel ? "border-primary border-2" : ""
              }`}
              onClick={() => setSelectedCountry(item)}
            >
              <div
                class={`${
                  (selectedCountry() as any)?.countryLabel === item.countryLabel &&
                  "absolute -right-2 -top-2 h-5 w-5 bg-primary rounded-full border border-solid border-slate-300 before:w-1.5 before:h-3 before:border-2 before:border-solid before:border-white before:border-t-0 before:border-l-0 before:absolute before:top-0.5 before:left-1.5 before:block before:rotate-45"
                }`}
              ></div>
              <img class="mr-2 mb-2 w-16 h-16 object-cover rounded-full" src={item.countryFlag} alt={item.countryLabel}></img>
              <p class="text-base">{item.countryLabel}</p>
            </div>
          )}
        </For>
      </div>
      <div class="flex justify-between mt-8">
        <CommonButton
          labelText="Back"
          bgWhite={true}
          btnType="button"
          isDisabled={false}
          // @ts-ignore
          clicked={() => props?.onRequestClose()}
        />
        <CommonButton
          labelText="Next"
          bgWhite={false}
          btnType="button"
          isDisabled={false}
          // @ts-ignore
          clicked={() => {
            if (selectedCountry()) {
              setLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY, selectedCountry(), true);
              setLocalStorageValue(LOCALSTORAGE.SELECTED_COUNTRY_NAME, (selectedCountry() as any)?.countryName);
              setTheme();
              navigate("/");
              props?.onRequestClose();
            }
          }}
        />
      </div>
    </div>
  );
}

export { CountrySelectionModal };
