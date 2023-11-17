import { StatusEnum } from "@/constants/api.constant";
import { CommonIcon } from "./CommonIcon";
import { createEffect, createSignal, mergeProps, onCleanup } from "solid-js";

interface statusPickerPropsType {
  status?: number;
}

export function StatusPicker(props: statusPickerPropsType) {
  const statusList = [
    { id: StatusEnum.ACTIVE, name: "Active" },
    { id: StatusEnum.INACTIVE, name: "Inactive" }
  ];
  props = mergeProps({ status: 1 }, props) || {};
  const [isOpen, setIsOpen] = createSignal(false);
  const [currentStatus, setCurrentStatus] = createSignal(statusList.find(obj => obj.id === props.status));
  let ref;
  return (
    <>
      <div>
        <div class="inline-block min-w-[100px] relative">
          <div
            class={`pl-5 flex item-center justify-between cursor-pointer relative before:w-[7px] before:h-[7px] ${
              currentStatus()?.id === StatusEnum.ACTIVE ? "before:bg-green-500" : "before:bg-[var(--primary-color)]"
            } before:absolute before:left-2 before:top-2 before:block before:rounded-full`}
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <span class="mt-[1px]">{currentStatus()?.name}</span> <CommonIcon icon="ic:baseline-arrow-drop-down" />
          </div>
          <div class={`shadow-2xl absolute top-0 left-0 w-full ${isOpen() ? "opacity-1 visible" : "opacity-0 invisible"}`}>
            {statusList.map((status: any) => {
              return (
                <div
                  class={`py-2 pr-2.5 pl-5 ${
                    currentStatus()?.id === status.id
                      ? "bg-[var(--primary-light-color)] text-[var(--primary-color)]"
                      : "bg-white text-black"
                  } text-sm relative before:w-[7px] before:h-[7px] ${
                    status.id === currentStatus()?.id ? "before:bg-green-500" : "before:bg-[var(--primary-color)]"
                  } before:absolute before:left-2 before:top-[13px] before:block before:rounded-full cursor-pointer hover:bg-[var(--primary-light-color)] hover:text-[var(--primary-color)]`}
                  onClick={() => {
                    setIsOpen(false);
                    setCurrentStatus(status);
                  }}
                >
                  {status.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
