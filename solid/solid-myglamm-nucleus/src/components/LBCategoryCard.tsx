import StatusHandler from "./StatusHandler.jsx";
import { CommonIcon } from "./CommonIcon.js";

interface LBCategoryCardProps {
  title: string;
  categoryAvailable: string;
}

const LBCategoryCard = ({ title, categoryAvailable }: LBCategoryCardProps) => {
  const deleteFunction = (e: any) => {
    e.preventDefault, alert("You clicked on bundled-product-delete!");
  };
  const editFunction = (e: any) => {
    e.preventDefault, alert("You clicked on bundled-product-edit!");
  };
  const handleStatus = (e: any) => {
    e.preventDefault, alert(`bundled-product-status to ${e.target.value}`);
  };

  return (
    <div class=" w-[350px] rounded-[3px]  border border-[#e8e9ec] flex flex-col justify-between">
      <div class="w-full px-3 py-5 flex flex-row justify-between ">
        <div class="flex  items-center text-[#FCEEF5]">
          <CommonIcon icon="material-symbols:folder-open-rounded" height={70}  width={70}  />
        </div>

        <div class="flex flex-col w-60">
        <div class="truncate mb-3 text-lg font-semibold capitalize">
        {title}
        </div>
          <div class="mb-2 text-[16px] text-[#808593]">{`${categoryAvailable} Sub Category`}</div>
        </div>
      </div>
      <StatusHandler
        deleteFunction={deleteFunction}
        editFunction={editFunction}
        handleStatus={handleStatus}
        currentStatus={true}
      />
    </div>
  );
};

export { LBCategoryCard };
