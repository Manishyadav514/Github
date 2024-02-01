import ConfigText from "@libComponents/Common/ConfigText";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPKitShadeModalV2 from "@libComponents/PopupModal/PDPKitShadeModalV2";
import useTranslation from "@libHooks/useTranslation";
import React, { useState } from "react";

const PDPKitShadeSelectionV2 = ({ comboShades, changeProductShade, activeKit, setActiveKit }: any) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean | undefined>();
  return (
    <div className="my-2">
      <section className="bg-white border-b border-gray-300 px-4 p-3">
        <p className="text-sm font-bold">CUSTOMIZE YOUR KIT</p>
        <p className="text-gray-600 text-xs mt-2">
          Pick from a Wide Variety of Shades that you love. Remember, it’s all about you!
        </p>
      </section>
      <section className="bg-white">
        <div className="px-3">
          {comboShades.map((products: any, index: number) => {
            const product = products?.productDetails?.[0];
            const prodImg = product?.assets?.find((x: any) => x.type === "image");
            const shades = products?.productDetails;
            const { shadeLabel } = product?.cms?.[0]?.attributes;
            if (products?.productTag?.toLowerCase().includes("shipping")) {
              return <></>;
            }
            return (
              <div className="w-full pt-3 pb-4 flex border-b border-dashed border-gray-300" key={index}>
                <div className="w-1/5">
                  <ImageComponent alt={prodImg?.name} style={{ width: "64px" }} src={prodImg?.imageUrl["200x200"]} />
                </div>
                <div className="w-4/5">
                  <p className="text-sm font-bold truncate">{product?.productTag}</p>
                  <p className="text-gray-500 text-10 flex justify-between">
                    <span>{shadeLabel ?? " "}</span>
                    {product.inStock === false && (
                      <p className="uppercase font-semibold pr-2 text-gray-400 text-xs mt-1">
                        <ConfigText configKey="outOfStock" />
                      </p>
                    )}
                  </p>
                  <div className="flex pt-2 justify-between ">
                    <div className="flex">
                      {shades?.length &&
                        shades.slice(0, 5).map((prod: any, i: number) => {
                          const { shadeImage } = prod?.cms?.[0]?.attributes || {};
                          return shadeImage ? (
                            <span className={`border rounded-md p-px ${i === 0 ? " border-black " : "border-white"}`}>
                              <img src={shadeImage} alt="shade" className="h-5 w-5 rounded-md" />
                            </span>
                          ) : (
                            <></>
                          );
                        })}
                      {shades?.length > 5 && (
                        <span
                          style={{ fontSize: "8px" }}
                          className="mx-1 bg-color2 w-5 h-5 flex items-center justify-center rounded-full mt-0.5 text-gray-500"
                        >
                          +{shades?.length - 5}
                        </span>
                      )}
                    </div>
                    {shades?.length > 1 && (
                      <button
                        style={{ borderRadius: "4px" }}
                        className="bg-color1 text-11 text-white px-1"
                        onClick={() => {
                          setActiveKit(index);
                          setShowModal(true);
                        }}
                      >
                        View All {t("shades")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="h-1 w-full bg-white -mt-1"></div>
      {showModal && (
        <PDPKitShadeModalV2
          shades={comboShades[activeKit]?.productDetails}
          showModal={showModal}
          setShowModal={setShowModal}
          variant={t("shades")}
          changeProductShade={changeProductShade}
        />
      )}
    </div>
  );
};

export default PDPKitShadeSelectionV2;
