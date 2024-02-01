import ImageComponent from "@libComponents/CustomNextImage";
import useTranslation from "@libHooks/useTranslation";
import React from "react";

const PDPSubFooter = () => {
  const { t } = useTranslation();
  const { title, subTitle, text, imgSrc } = t("curtlyFreeDetails") || {
    title: "GLAMOUROUS, FABULOUS <br/> & CRUELTY-FREE",
    subTitle: "India’s #1 D2C Makeup Brand*",
    text: "is dedicated to beauty that’s good for you & for the planet",
    imgSrc: "https://files.myglamm.com/site-images/original/cruelty-free-1_3.png",
  };

  return (
    <>
      <div className="py-5 bg-white text-center ">
        <p className="text-color1 text-xl font-bold mb-2 uppercase">  <span dangerouslySetInnerHTML={{ __html: title }} /> </p>
        <span className="w-full mb-2 block ">
          <ImageComponent src={imgSrc} alt={text} className="mx-auto bg-color2 rounded-full" width={"80px"} height={"80px"} />
        </span>
        <p className="text-13 capitalize">{subTitle}</p>
        <p className="text-13 capitalize">{text}</p>
      </div>
    </>
  );
};

export default PDPSubFooter;
