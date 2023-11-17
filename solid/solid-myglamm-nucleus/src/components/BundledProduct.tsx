import { CommonIcon } from "./CommonIcon.jsx";
import StatusHandler from "./StatusHandler.jsx";
import clsx from "clsx";
interface bundledProductProps {
  title: string;
  tag: string;
  price: number;
  deletePrice?: number;
  code?: string;
  language: string;
  productAvailable: number;
}

const BundledProduct = ({ title, tag, price, deletePrice, code, language, productAvailable }: bundledProductProps) => {
  const deleteFunction = (e: any) => {
    e.preventDefault, alert("You clicked on bundled-product-delete!");
  };
  const editFunction = (e: any) => {
    e.preventDefault, alert("You clicked on bundled-product-edit!");
  };
  const handleStatus = (e: any) => {
    e.preventDefault, alert(`bundled-product-status to ${e.target.value}`);
  };
  const viewProduct = (e: any) => {
    e.preventDefault, alert(`view-product`);
  };

  return (
    <div class="rounded-[3px] border border-[#e8e9ec] flex flex-col justify-between">
      <div class="h-[220px] flex flex-row ">
        <div class="h-full w-[250px]">
          <img
            class="h-full w-full"
            alt="image"
            src="https://s3.ap-south-1.amazonaws.com/files.myglamm.net/myglamm-alpha/800x800/sleek-cp_52.jpg"
          ></img>
        </div>
        <div class="w-[316px] h-full px-4 py-5 mi-w-[50px]">
          <div class="h-[55px] mb-1 text-lg font-semibold capitalize">{title}</div>
          <div class="mb-3">
            <span class="w-20 bg-[var(--primary-light-color)] text-primary capitalize font-normal text-[14px] p-2 ">
              {tag}
            </span>
          </div>
          <div class="flex flex-row gap-3 mb-2">
            <div class="text-lg font-normal capitalize">{`INR ${price}`}</div>
            {deletePrice && <del class="text-lg text-[#aaadb7]  font-normal capitalize">{`INR ${deletePrice}`}</del>}
          </div>
          <div class="flex flex-row gap-3">
            <div class="text-[15px] text-[#808593]   font-normal leading-6 mb-1">SKU</div>
            <div class="text-[12px]  leading-6 text-[#212529] mb-1">{code}</div>
          </div>
          <div class="flex flex-row justify-between">
            <p class="text-[14px] text-[#808593] uppercase ">{language}</p>
            <span
              class={clsx(
                "text-[14px] flex justify-center align-middle items-center gap-2 cursor-pointer",
                productAvailable === 0 ? "text-red-600" : "text-[#808593]"
              )}
              onClick={e => {
                viewProduct(e);
              }}
            >
              {`${productAvailable} Products`}
              <span class="text-primary">
                <CommonIcon rotate="90" icon="ic:baseline-remove-red-eye" />
              </span>
            </span>
          </div>
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

export { BundledProduct };
