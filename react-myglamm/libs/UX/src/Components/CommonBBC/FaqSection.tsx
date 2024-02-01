import { IS_DESKTOP } from "@libConstants/COMMON.constant";
import { getStaticUrl } from "@libUtils/getStaticUrl";
import React, { useState } from "react";

type FaqDataType = {
  id: number;
  title: string;
  text: string;
};

interface PropTypes {
  faqData: FaqDataType[];
}

const FaqSection = ({ faqData }: PropTypes) => {
  const [activeFaq, setActiveFaq] = useState<FaqDataType | null>(null);
  const handleCollapseToggle = (elem: FaqDataType) => {
    if (elem === activeFaq) {
      setActiveFaq(null);
    } else {
      setActiveFaq(elem);
    }
  };

  return (
    <div className="bg-white pt-6 ">
      <p className=" font-bold text-base px-6 lg:px-0">FAQs on Ovulation Calculator</p>
      {faqData?.map(elem => {
        return (
          <div key={elem?.id} className="border-b border-gray-300" onClick={() => handleCollapseToggle(elem)}>
            <div className=" mb-0 relative flex justify-between items-center w-full px-6 pt-6 pb-3 text-sm text-gray-800 text-left bg-white border-0 rounded-none">
              <h3 className="w-5/6">{elem?.title}</h3>
              <img
                alt="arrow"
                src={IS_DESKTOP ? getStaticUrl("/svg/arrow-faq-ico.svg") : getStaticUrl("/images/bbc-g3/arrow-faq-ico.svg")}
                className={`${elem === activeFaq ? "rotate-180" : "rotate-0"} mb-5 transition lg:pt-3`}
              />
            </div>
            <div className={`${elem === activeFaq ? "block" : "hidden"} pb-4 px-5 `}>
              <div dangerouslySetInnerHTML={{ __html: elem?.text }} className="bg-gray-100 text-xs p-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FaqSection;
