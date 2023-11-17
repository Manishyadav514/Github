import { CommonIcon } from "./CommonIcon";

const StatusManipulator = ({
  editFunction,
  deleteFunction,
  handleStatus,
  currentStatus,
}) => {
  return (
    <div class="h-[60px] flex justify-between items-center p-2 border-t border-[#e8e9ec] ">
      <div>
        <select
          id="couponStatus"
          class="block px-2 py-3 bg-white text-base text-gray-900"
          onChange={(e) => {
            handleStatus(e);
          }}
        >
          <option
            value="active"
            class={`${
              currentStatus && "bg-secondary"
            } w-8 hover:bg-slate-400 text-primary cursor-pointer`}
          >
            Active
          </option>
          <option selecetd value="inactive">
            Inactive
          </option>
        </select>
      </div>
      <div class="flex flex-row gap-3 text-primary">
        <span class="cursor-pointer" onClick={(e) => editFunction(e)}>
          <CommonIcon icon="ph:pencil-light" />
        </span>
        <span class="cursor-pointer" onClick={(e) => deleteFunction(e)}>
          <CommonIcon icon="ri:delete-bin-6-line" />
        </span>
      </div>
    </div>
  );
};

export default StatusManipulator;
