import { CommonIcon } from "./CommonIcon";
import { Accordion } from "./Accordion";

interface PreviewPropsType {
  productImg?: string;
  productTitle: string;
  prdSubTitle: string;
  productPrice: number;
  shadeImg?: string;
}

export function ProductPreview({ productImg, productTitle, prdSubTitle, productPrice, shadeImg }: PreviewPropsType) {
  const accordionData = [
    {
      title: "Section 1",
      content: `mmodi eum enim atque at? Et perspiciatis dolore iure
            voluptatem.`,
    },
    {
      title: "Section 2",
      content: `
            voluptatem.`,
    },
  ];

  return (
    <>
      <div class="p-6 w-80 bg-white fixed top-[78px] right-0 h-[calc(100vh-78px)] z-50 overflow-y-auto">
        <div class="flex justify-between">
          <h3 class="text-sm font-semibold text-black">Preview</h3>
          <span class="text-primary">
            <CommonIcon icon="ic:baseline-remove-red-eye" width={16} height={16} />
          </span>
        </div>
        <div class="mt-4 mb-6 border-2 border-dashed border-slate-300 h-60 flex justify-center items-center">
          <img
            src={productImg ? productImg : "/images/svg/product_preview.svg"}
            alt={productTitle}
            class={productImg ? `h-full` : ""}
          />
        </div>
        <p class="mb-4 text-lg font-semibold text-black ">{productTitle}</p>
        <p class="mb-4 text-sm text-slate-400 truncate">{prdSubTitle}</p>
        <p class="mb-4 text-lg font-semibold text-black ">₹{productPrice}</p>
        <div class="w-20 h-20 border-2 border-dashed border-slate-300 flex justify-center items-center">
          <img src={shadeImg ? shadeImg : "/images/svg/product_preview.svg"} alt={productTitle} />
        </div>
        <div class="mt-6">
          <Accordion accordionData={accordionData} isProduct={true} defaultOpenIndex={1}></Accordion>
        </div>
      </div>
    </>
  );
}
