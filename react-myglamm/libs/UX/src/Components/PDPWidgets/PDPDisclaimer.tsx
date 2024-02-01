import useTranslation from "@libHooks/useTranslation";
import React from "react";

const PDPDisclaimer = () => {
  const { t } = useTranslation();

  const disclaimerList = t("disclaimerList") || [
    "All products that will be shipped will have a shelf-life of a minimum of 8 months to 12 months.",
    "Colours of makeup products may vary due to the differences in computer monitors and phone screen resolutions.",
    "Products containing natural ingredients may change colour and fragrance without losing effectiveness.",
    " Even products containing natural ingredients can trigger existing allergies. Hence, a patch test is always recommended. In case of rashes, please consult a specialist.",
    " For external use only. Store in a cool and dry place.",
  ];

  if (!disclaimerList?.length) return null;

  return (
    <section className="bg-white pt-6 px-4">
      <div className="bg-color2 p-4 rounded-md">
        <p className="text-15 font-bold pb-3"> {t("disclaimer") || "Disclaimer"} </p>
        <ul className="pl-4">
          {disclaimerList.map((list: string) => (
            <li key={list} className="text-13 pb-2">
              {list}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PDPDisclaimer;
