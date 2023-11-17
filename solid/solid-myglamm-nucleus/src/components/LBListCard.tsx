import StatusHandler from "./StatusHandler.jsx";
import clsx from "clsx";
interface LBListCardProps {
  title: string;
  tag: string;
  date: string;
  language: string;
  productAvailable: number;
}

const LBListCard = ({
  title,
  tag,
  date,
  language,
  productAvailable,
}: LBListCardProps) => {
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
      <div class="h-[250px] w-full py-4">
        <img
          class="h-full w-full object-contain"
          alt="image"
          src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/original/2019-12-08.jpeg"
        ></img>
      </div>
      <div class="w-full px-4 py-5">
        <div class="truncate mb-3 text-lg font-semibold capitalize">
        {title} {title}
        </div>

        <div class="mb-3 flex flex-row justify-between items-center align-middle">
          <span class="w-20 bg-[var(--primary-light-color)] text-primary capitalize font-normal text-[13px] p-2 ">
            {tag}
          </span>
          <span
            class={clsx(
              "text-[13px] flex justify-center align-middle items-center gap-2 cursor-pointer",
              productAvailable === 0 ? "text-red-600" : "text-[#808593]"
            )}
          >
            {`${productAvailable} Products`}
          </span>
        </div>

        <div class="flex flex-row justify-between">
          <p class="text-[15px] text-[#808593] uppercase ">{language}</p>
          <div class="text-[15px] text-[#808593]">{date}</div>
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

export { LBListCard };