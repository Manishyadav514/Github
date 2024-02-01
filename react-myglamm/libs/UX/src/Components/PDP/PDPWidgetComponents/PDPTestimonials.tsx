import React from "react";
import { PDPProd } from "@typesLib/PDP";
import useTranslation from "@libHooks/useTranslation";

const PDPTestimonials = ({ product }: { product: PDPProd }) => {
  const { t } = useTranslation();
  const imagesUrls = product?.cms?.[0]?.content?.testimonials?.items;

  if (!imagesUrls?.length) {
    return null;
  }

  return (
    <div className="px-4 py-5 border-b-4 border-themeGray bg-white">
      <p className="font-bold text-15 pb-4"> {t("testimonials") || "Testimonials"} </p>
      <ul className="flex list-none gap-2 overflow-x-scroll">
        {imagesUrls.map((data: any) => {
          return (
            <li className="flex-sliderChild">
              <img src={data?.imageUrl} alt="testimonials images" style={{aspectRatio:"1/1.4",maxWidth:"170px",maxHeight:"240px"}} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PDPTestimonials;
