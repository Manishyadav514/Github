import { For, createSignal } from "solid-js";
import { CommonIcon } from "./CommonIcon.js";
import { CommonButton } from "./CommonButton.jsx";
import { Checkbox } from "./common/Checkbox.jsx";
import { useNavigate } from "@solidjs/router";

const LinkGenerator = () => {
  const navigate = useNavigate();
  const [isDiscount, setIsDiscount] = createSignal(false);
  const CircularTab = ({ index, title, subTitle, isDisable }: any) => {
    return (
      <div class={`flex flex-row`}>
        <div
          class={`flex justify-center align-middle items-center rounded-full w-7 h-7 text-xs ${
            isDisable ? "border border-[#F5BFDD] text-[#F5BFDD]" : "bg-primary text-white"
          }`}
        >
          {index}
        </div>
        <div class={`ml-2 ${isDisable ? "text-[#BCBEC7] cursor-not-allowed" : "text-black cursor-pointer"} `}>
          <p class="capitalize text-xs font-semibold">{title}</p>
          <p class="capitalize text-[10px]">{subTitle}</p>
        </div>
      </div>
    );
  };

  return (
    <div class="p-5">
      <div class="grid grid-cols-2 mb-4">
        <CircularTab index="1" title={"Link Details"} subTitle={`Name, Slug`} />
        <CircularTab index="2" title="Analytics" subTitle={`Channel, Campaign`} isDisable />
      </div>
      <form class="w-full max-w-[800px]">
        <div class="mb-4 mt-2">
          <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
            Destination
          </label>
          <p class="text-xs mt-2 mb-1 text-[#808593]">{`(Destination is the landing page where the link will redirect to)`}</p>
          <div class="w-full relative inline-flex self-center">
            <select class="w-full py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white focus:outline-none appearance-none">
              <option>Select...</option>
              <option>cancelled</option>
              <option>confirmed</option>
              <option>ready to ship</option>
            </select>
            <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
              <CommonIcon icon="material-symbols:arrow-drop-down" />
            </span>
          </div>
        </div>
        <div class="mb-4 mt-2">
          <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
            Action
          </label>
          <p class="text-xs mt-2 mb-1 text-[#808593]">
            {`(You can have a selective action which you want to perform when the URL is hit)`}
          </p>
          <div class="w-full relative inline-flex self-center">
            <select class="w-full py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white focus:outline-none appearance-none">
              <option>Select...</option>
              <option>cancelled</option>
              <option>confirmed</option>
              <option>ready to ship</option>
            </select>
            <span class="h-full flex align-middle items-center justify-center text-black absolute top-0 right-0 pointer-events-none">
              <CommonIcon icon="material-symbols:arrow-drop-down" />
            </span>
          </div>
        </div>
        <div class="mb-4 mt-2">
          <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
            Type
          </label>
          <p class="text-xs mt-2 mb-1 text-[#808593]">{`(Type can be Product, Category, Collection, Blog etc.)`}</p>
          <input
            class="bg-[#E9ECEF] text-sm placeholder:text-[#202841] text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="desktop"
            type="text"
            placeholder="Product"
          ></input>
        </div>
        <div class="mb-4 mt-2">
          <label class="text-sm font-medium text-[#808593]" for="password">
            Alias
          </label>
          <p class="text-xs mt-2 mb-1 text-[#808593]">{`(Provide an identity to the short url)`}</p>
          <input
            class="bg-[#E9ECEF] text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="desktop"
            type="text"
            placeholder=""
          ></input>
        </div>
        <div class="pb-4">
          <Checkbox
            labelText="Apply Discount"
            id="siteWide"
            checked={e => {
              setIsDiscount(!isDiscount());
            }}
            customText="text-[#808593]"
          />
          <div class={`mb-4 mt-2 ${isDiscount() ? "visible" : "hidden"}`}>
            <label class="text-sm font-medium text-[#808593] after:content-['*'] after:ml-2 after:text-red-500" for="password">
              Discount Code
            </label>
            <p class="text-xs mt-2 mb-1 text-[#808593]">{`(Enter a valid and active discount code)`}</p>
            <input
              class="bg-[#E9ECEF] text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
              id="desktop"
              type="text"
              placeholder=""
            ></input>
          </div>
        </div>
        <div class="pb-4">
          <Checkbox
            labelText="Include Mobile APP Deeplink"
            id="siteWide"
            checked={e => {
              console.log(e);
            }}
            customText="text-[#808593]"
          />
        </div>
        <div class="text-sm font-medium mb-4">Redirection URL</div>
        <div class="mb-5">
          <label class="text-sm font-medium text-[#808593]" for="password">
            Desktop
          </label>
          <input
            class="bg-[#E9ECEF] mt-2 text-sm placeholder:text-[#202841] text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="desktop"
            type="text"
            placeholder=""
          ></input>
        </div>
        <div class="mb-5">
          <label class="text-sm font-medium  text-[#808593]" for="password">
            ios
          </label>
          <input
            class="bg-[#E9ECEF] mt-2 text-sm placeholder:text-[#202841] text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="desktop"
            type="text"
            placeholder=""
          ></input>
        </div>
        <div class="mb-5">
          <label class="text-sm font-medium text-[#808593]" for="password">
            Android
          </label>
          <input
            class="bg-[#E9ECEF] mt-2 text-sm placeholder:text-[#202841] text-[#202841] appearance-none border border-[#e8e9ec] rounded w-full py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
            id="desktop"
            type="text"
            placeholder=""
          ></input>
        </div>
      </form>
      <div class="pt-4 flex justify-between">
        <CommonButton
          labelText="Back"
          bgWhite={true}
          btnType="button"
          isDisabled={false}
          // @ts-ignore
          clicked={() => {
            navigate(`/link-builder`, { replace: true });
          }}
        />
        <CommonButton
          labelText="Next"
          bgWhite={false}
          btnType="button"
          isDisabled={true}
          // @ts-ignore
          clicked={() => {
            navigator;
          }}
        />
      </div>
    </div>
  );
};

export { LinkGenerator };
