import { For, createSignal } from "solid-js";
import { CommonIcon } from "../CommonIcon";
import { stat } from "fs";

interface DatePickerPropsType {
  optionPickerData: any;
  filterData: any;
  setFilterData: any;
  where: any;
  setWhere: any;
}

export function DatePicker(props: DatePickerPropsType) {
  // "createdAt":{"between":["2023-04-06T18:30:00.000Z","2023-04-15T18:29:59.999Z"]}
  const [selectedDates, setSelectedDates] = createSignal(["", ""]);

  const handleInput = (e: any) => {
    var newSelectedValue = new Date(e.target.value);
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
      [props.optionPickerData.whereField]: { between: [...selectedDates()] }
    });
  };
  return (
    <>
      {props.optionPickerData.name && (
        <label class="text-sm	text-black font-semibold capitalize mb-1 block">{props.optionPickerData.name}</label>
      )}
      <For each={props.optionPickerData.fields}>
        {field => (
          <div class="py-3">
            {field.name && <label class="text-sm	text-gray-400 capitalize mb-1 block">{field.name}</label>}
            <div class="w-3/4 border rounded flex flex-row">
              <input
                id={field.name}
                onInput={e => handleInput(e)}
                type="date"
                class="w-full bg-white text-sm placeholder-black text-[#202841] appearance-none border border-[#e8e9ec] rounded-tl rounded-bl py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
                placeholder="Select date"
              ></input>
              {/* <input
                type="text"
                id={field.name}
                onInput={e => handleInput(e)}
                class="datepicker_input form-control w-full bg-white text-sm placeholder-gray-400 text-[#202841] appearance-none border border-[#e8e9ec] rounded-tl rounded-bl py-[6px] px-3 leading-tight focus:outline-none focus:bg-white focus:border-primary"
                // class=""
                placeholder={field.value || "dd-mm-yyyy"}
                required
              ></input>
              <div class=" flex items-center pointer-events-none px-2">
                <CommonIcon icon="material-symbols:calendar-month-outline-rounded" width={13} height={13} />
              </div> */}
            </div>
          </div>
        )}
      </For>
    </>
  );
}
