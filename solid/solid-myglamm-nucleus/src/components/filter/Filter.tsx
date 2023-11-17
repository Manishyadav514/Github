import { CommonButton } from "../CommonButton";
import { CommonIcon } from "../CommonIcon";
import { RatingsBadges } from "../RatingsBadges";
import { For } from "solid-js";
import { OptionPicker } from "./OptionPicker";
import { DatePicker } from "./DatePicker";
import { PricePicker } from "./PricePicker";
interface filterPropsType {
  checkIsSidebar: any;
  closeSidebar: (isClick: boolean) => boolean;
  filterData: any;
  setFilterData: any;
  where: any;
  setWhere: any;
}

export function Filter(props: filterPropsType) {
  return (
    <>
      <div class={`fixed top-0 left-0 bg-[#0000004d] w-full h-full z-[51] flex justify-end`}>
        <div
          class={`py-4 px-7 w-96 bg-white overflow-y-auto translate-x-96 duration-300 ${
            props.checkIsSidebar ? " !translate-x-0" : " "
          }`}
        >
          <div class="text-right text-[#797e8d]">
            <button type="button" onClick={() => props.closeSidebar(false)}>
              <CommonIcon icon="material-symbols:close" />
            </button>
          </div>
          <div class="mb-5">
            <h3 class="text-xl font-semibold text-black inline-block">Filters</h3>
            <span class="text-xs text-primary cursor-pointer inline-block font-semibold ml-2">Clear all filters</span>
          </div>
          <For each={props.filterData}>
            {item => {
              if (item.type === "calendar") {
                return (
                  <DatePicker
                    optionPickerData={item}
                    setWhere={props.setWhere}
                    where={props.where}
                    filterData={props.filterData}
                    setFilterData={props.setFilterData}
                  />
                );
              } else if (item.type === "price") {
                return (
                  <PricePicker
                    optionPickerData={item}
                    setWhere={props.setWhere}
                    where={props.where}
                    filterData={props.filterData}
                    setFilterData={props.setFilterData}
                  />
                );
              } else if (item.type === "rating") {
                return (
                  <div class="my-4">
                    <label class="text-sm	text-black font-semibold capitalize mb-1 block">VendorCode</label>
                    <RatingsBadges
                      ratingText="1"
                      isIcon={true}
                      ratingIcon="material-symbols:star"
                      clicked={e => {
                        return console.log(e);
                      }}
                    />
                    <RatingsBadges
                      ratingText="2"
                      isIcon={true}
                      ratingIcon="material-symbols:star"
                      clicked={e => {
                        console.log(e);
                      }}
                    />
                    <RatingsBadges
                      ratingText="India"
                      isIcon={false}
                      clicked={e => {
                        console.log(e);
                      }}
                    />
                  </div>
                );
              } else {
                return (
                  <OptionPicker
                    optionPickerData={item}
                    setWhere={props.setWhere}
                    where={props.where}
                    filterData={props.filterData}
                    setFilterData={props.setFilterData}
                  />
                );
              }
            }}
          </For>
          <div class="my-4">
            <CommonButton
              labelText="Apply"
              clicked={e => {
                console.log(e);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
