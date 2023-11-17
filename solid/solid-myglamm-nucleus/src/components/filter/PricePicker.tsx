import { For } from "solid-js";
import { CommonIcon } from "../CommonIcon";

interface PricePickerPropsType {
  optionPickerData: any;
  filterData: any;
  setFilterData: any;
  where: any;
  setWhere: any;
}

export function PricePicker(props: PricePickerPropsType) {
  // "paymentDetails.orderAmount": { between: [10100, 210000] }, // maximum selected {"lte":39800}
  const handleInput = (e?: any) => {
    if (!e) {
      const updatedFilterData = props.filterData?.filter((obj: any) => {
        if (obj.whereField === props.optionPickerData.whereField) {
          obj.selectedValue = "";
        }
        return obj;
      });
      props.setFilterData(updatedFilterData);
    } else {
      const updatedFilterData = props.filterData?.filter((obj: any) => {
        if (obj.whereField === props.optionPickerData.whereField) {
          const field = props.optionPickerData.fields?.find((x: any) => x.name === e.target.id);
          field.value = e.target.value;
        }
        return obj;
      });
      props.setFilterData(updatedFilterData);
      props.setWhere({
        ...props.where,
        [props.optionPickerData.whereField]: e.target.value
      });
    }
  };
  return (
    <>
      {props.optionPickerData.name && (
        <label class="text-sm	text-black font-semibold capitalize mb-1 block">{props.optionPickerData.name}</label>
      )}
      <For each={props.optionPickerData.fields}>
        {field => (
          <div class="py-3">
            {field.name && <label class="text-sm	text-black capitalize mb-1 block">{field.name}</label>}
            <div class="w-3/4 border rounded flex flex-row">
              <div class="bg-gray-200 flex items-center pointer-events-none px-2">
                <CommonIcon icon="mingcute:currency-rupee-2-line" width={15} height={15} />
              </div>
              <input
                id={field.name}
                onInput={e => handleInput(e)}
                type="number"
                min="1"
                step="1"
                placeholder={field.value}
                class="w-full bg-white text-sm text-[#202841] appearance-none border border-[#e8e9ec] rounded-tr rounded-br py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
              ></input>
            </div>
          </div>
        )}
      </For>
    </>
  );
}
