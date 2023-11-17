import { CommonIcon } from "./CommonIcon";
import { createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { getLocalStorageValue } from "../utils/localStorage";
import { LOCALSTORAGE } from "../constants/Storage.constant";

interface IUserOptions {
  optionClicked: () => boolean;
}

function ShowUserOptions({ optionClicked }: IUserOptions) {
  const navigation = useNavigate();
  return (
    <div class="absolute border flex flex-col pt-1 top-10 bg-white rounded-lg text-base text-left w-full">
      <button class="hover:bg-gray-200 px-6 py-1  flex items-center space-x-2" onClick={() => optionClicked()}>
        <span class="text-black">
          <CommonIcon icon="ph:user-bold" height={20} width={20} />
        </span>
        <span>Profile</span>
      </button>
      <button
        class="hover:bg-gray-200 px-6 py-1 flex items-center space-x-2"
        onClick={() => {
          navigation("/select-vendorcode");
        }}
      >
        <span class="text-black">
          <CommonIcon icon="prime:shopping-bag" height={20} width={20} />
        </span>

        <span>Brands</span>
      </button>
      <button class="hover:bg-gray-200 px-6 py-1 flex items-center space-x-2" onClick={() => optionClicked()}>
        <span class="text-black">
          <CommonIcon icon="ion:settings-outline" height={20} width={20} />
        </span>
        <span>Settings</span>
      </button>
      <button
        class="hover:bg-gray-200 px-6 py-1 flex items-center space-x-2"
        onClick={() => {
          localStorage.clear();
          navigation("/auth/login");
        }}
      >
        <span class="text-black">
          <CommonIcon icon="ri:logout-circle-r-line" height={20} width={20} />
        </span>
        <span> Logout</span>
      </button>
    </div>
  );
}

function Header() {
  const [isProd, setisProd] = createSignal(false);
  const [openSettings, setOpenSettings] = createSignal(false);
  const { firstName, lastName } = getLocalStorageValue(LOCALSTORAGE.LOGGED_IN_USER, true);

  return (
    <nav class="flex justify-between items-center border fixed top-0 w-screen z-10 bg-white pl-[25px] pt-5 pb-2 pr-[21px]">
      <img src="/images/svg/nucleus-logo.svg" alt="logo" loading="eager" width={"120px"} />
      <div class="flex items-center space-x-8">
        <div class="flex space-x-2 items-center text-base">
          <div class={`w-4 h-4 border-4 rounded-lg ${isProd() ? "border-green-500 " : "border-orange-300"}`}></div>
          <span class={` ${isProd() ? "text-green-500 " : "text-orange-300"}`}>{isProd() ? "Live" : "Alpha"}</span>
        </div>
        <button class="text-sm relative ">
          <span>What's new</span>
          <div class="w-4 h-4 bg-red-500 text-white rounded-full absolute top-0 right-0 flex items-center justify-center text-[11px] animate-bounce">
            2
          </div>
        </button>
        <button class="flex items-center  cursor-pointer relative" onClick={() => setOpenSettings(!openSettings())}>
          <div class="flex items-center">
            <img
              class="h-[36px] w-[36px] rounded-full"
              src="https://nucleus-alpha.myglamm.net/assets/images/user.svg"
              alt="profile"
              loading="eager"
            ></img>
          </div>
          <p class="text-gray-500 text-sm">
            {firstName} {lastName}
          </p>
          <span class="text-gray-500 ">
            <CommonIcon icon="material-symbols:arrow-drop-up" height={25} width={25} rotate={90} />
          </span>
          {openSettings() ? <ShowUserOptions optionClicked={() => setOpenSettings(false)} /> : null}
        </button>
      </div>
    </nav>
  );
}

export { Header };
