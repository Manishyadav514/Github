import { createSignal } from "solid-js";
import { CommonButton } from "../CommonButton";
import { CommonIcon } from "../CommonIcon";
import { Checkbox } from "../common/Checkbox";

interface AddressPopupProps {
  onRequestClose: () => any;
}

function AddressPopup(props: AddressPopupProps) {
  const [isChecked, setIsChecked] = createSignal(false);
  return (
    <div class="bg-slate-700/50 w-screen h-screen flex justify-around align-middle items-center ">
      <div class="bg-white w-full max-w-[798px] rounded-md">
        <div class="flex flex-row justify-between align-middle items-center p-6 border-b">
          <p class="text-base">Add New Address</p>
          <span role="presentation" class="text-xl cursor-pointer" onClick={() => props.onRequestClose()}>
            &#10005;
          </span>
        </div>
        <div class="p-4">
          <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Name
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Mobile Number
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
          </div>
          <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Email
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Address Type
              </label>
              <div class="w-full relative inline-flex self-center">
                <select class="mt-2 w-full py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white focus:outline-none appearance-none">
                  <option>Home</option>
                  <option>Office</option>
                  <option>Others</option>
                </select>
                <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
                  <CommonIcon icon="material-symbols:arrow-drop-down" />
                </span>
              </div>
            </div>
          </div>
          <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Flat No/House No/Floor/Building
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Colony/Street Name
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
          </div>

          <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Neighbourhood/Locality
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                Pincode
              </label>
              <input
                class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
          </div>

          <div class="mb-4 mt-2 flex flex-row justify-between gap-4">
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                State
              </label>
              <input
                class="mt-2 bg-gray-100 text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
            <div class="w-1/2">
              <label
                class=" text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500"
                for="password"
              >
                City
              </label>
              <input
                class="mt-2 bg-gray-100 text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
                id="desktop"
                type="text"
                placeholder=""
              ></input>
            </div>
          </div>
          <div class="w-1/2">
            <label class=" text-sm font-medium text-[#808593]" for="password">
              Landmark
            </label>
            <input
              class="mt-2 bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
          <div class="mb-4 mt-6 flex flex-row justify-between gap-4 cursor-pointer text-gray-500">
            <Checkbox
              labelText="Set As Default"
              id="default-radio-1"
              checked={() => setIsChecked(!isChecked())}
              isChecked={isChecked()}
            />
          </div>
        </div>
        <div class="flex justify-end gap-5 p-6 border-t">
          <CommonButton labelText="Close" hoverLightPink bgWhite={true} clicked={() => props.onRequestClose()} />
          <CommonButton labelText="Save" clicked={() => props.onRequestClose()} />
        </div>
      </div>
    </div>
  );
}

export { AddressPopup };
