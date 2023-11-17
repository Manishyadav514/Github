import { For, createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon";

interface OptionPickerPropsType {
  optionPickerData: any;
  filterData: any;
  setFilterData: any;
  where: any;
  setWhere: any;
}

export function OptionPicker(props: OptionPickerPropsType) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentStatus, setCurrentStatus] = createSignal(props.optionPickerData.selectedValue);
  const handleOptionSelect = (status?: any) => {
    setIsOpen(false);
    if (!status) {
      const updatedFilterData = props.filterData?.filter((obj: any) => {
        if (obj.whereField === props.optionPickerData.whereField) {
          obj.selectedValue = "";
          setCurrentStatus("");
        }
        return obj;
      });
      props.setFilterData(updatedFilterData);
    } else {
      const updatedFilterData = props.filterData?.filter((obj: any) => {
        if (obj.whereField === props.optionPickerData.whereField) {
          // add signle or array of selectedValue based on the multiple value
          let A = new Set();
          let previousSelectedValues = [
            ...props.filterData?.find((x: any) => x.whereField === props.optionPickerData.whereField).selectedValue
          ];
          let newSelectedValue = props.optionPickerData.multiple
            ? previousSelectedValues.includes(status.value)
              ? previousSelectedValues
              : [...previousSelectedValues, status.value]
            : status.value;
          obj.selectedValue = newSelectedValue;
          setCurrentStatus(newSelectedValue);
        }
        return obj;
      });
      console.log({ updatedFilterData });
      props.setFilterData(updatedFilterData);
      props.setWhere({
        ...props.where,
        [props.optionPickerData.whereField]: props.filterData?.find(
          (x: any) => x.whereField === props.optionPickerData.whereField
        ).selectedValue
      });
      console.log(props.where);
    }
  };
  return (
    <>
      <div class="w-full my-4 flex flex-col">
        {props.optionPickerData?.name && (
          <label class="text-sm	text-black font-semibold capitalize mb-1 block">{props.optionPickerData?.name}</label>
        )}
        <div class="w-full flex justify-between text-start py-[6px] px-3 text-sm font-medium text-[#808593] capitalize border border-[#e8e9ec] bg-white">
          <button
            id="dropdownDelayButton"
            class="w-[90%] text-start cursor-default"
            type="button"
            onclick={() => setIsOpen(!isOpen())}
          >
            {props.optionPickerData.multiple ? (
              <>
                {currentStatus().length > 0 ? (
                  <div class="flex flex-wrap gap-1">
                    <For each={currentStatus()}>
                      {selectedvalue => (
                        <span class="flex flex-row gap-[1px] text-xs text-primary">
                          <p class="flex items-center p-1 rounded-l text-xs bg-secondary hover:bg-primary hover:text-white cursor-pointer">
                            <CommonIcon
                              width={12}
                              height={12}
                              icon="iconoir:cancel"
                              click={() => setCurrentStatus(undefined)}
                            />
                          </p>
                          <p class="capitalize p-1 rounded-r text-xs bg-secondary">
                            {props.optionPickerData.fields?.find((x: any) => x.value === selectedvalue)?.name}
                          </p>
                        </span>
                      )}
                    </For>
                  </div>
                ) : (
                  <p class="text-[#202841]">
                    {currentStatus().length > 0
                      ? props.optionPickerData.fields?.find((x: any) => x.value === currentStatus())?.name
                      : `Select ${props.optionPickerData.name}`}
                  </p>
                )}
              </>
            ) : (
              <p class="text-[#202841]">
                {props.optionPickerData.fields?.find((x: any) => x.value === currentStatus())?.name ||
                  `Select ${props.optionPickerData.name}`}
              </p>
            )}
          </button>
          <span class="w-[10%] flex">
            <p class="w-5 h-5 hover:cursor-pointer">
              {currentStatus() && (
                <CommonIcon
                  width={15}
                  height={15}
                  icon="iconoir:cancel"
                  click={() => {
                    setCurrentStatus("");
                    handleOptionSelect();
                  }}
                />
              )}
            </p>
            <p class="hover:text-black cursor-pointer">
              <CommonIcon
                rotate={`${isOpen() ? "270deg" : "90deg"}`}
                width={15}
                height={13}
                icon="material-symbols:play-arrow-rounded"
                click={() => setIsOpen(!isOpen())}
              />
            </p>
          </span>
        </div>
        <div
          class={`w-full border flex flex-col relative uppercase ${
            isOpen() ? "opacity-1 visible" : "opacity-0 invisible hidden"
          }`}
        >
          {props.optionPickerData.fields?.map(
            (status: any) =>
              !(Array.isArray(currentStatus()) && currentStatus().includes(status.value)) && (
                <div
                  class={`${
                    currentStatus() === status.name ? "font-bold" : "hover:text-primary"
                  } w-full block px-4 py-2 hover:bg-secondary  cursor-pointer`}
                  onClick={() => handleOptionSelect(status)}
                >
                  {status.name}
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
