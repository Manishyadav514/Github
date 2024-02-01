import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";

const EditOrderComboProducts = (props: any) => {
  const { products, setSelectedProduct, loadProductShades } = props;
  const { t } = useTranslation();
  return (
    <div className="mb-2 flex bg-white">
      <div className="w-4/12 p-2 pr-0">
        {products.map((childProduct: any, index: number) => (
          <div
            className={`bg-color2 p-2 relative ${index < products.length - 1 ? "pb-4" : ""}`}
            key={`${childProduct.productId}_${index}`}
          >
            <div className="flex justify-center">
              <ImageComponent src={childProduct?.imageUrl || DEFAULT_IMG_PATH} alt={childProduct?.name} className="w-24 h-24" />
            </div>
            {index < products.length - 1 && (
              <span className="flex justify-center absolute inset-x-0 mx-auto z-10 -bottom-0.5 opacity-70 text-2xl leading-3">
                +
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="w-8/12 p-3 flex flex-col justify-between">
        <div>
          <p className="font-bold text-sm line-clamp-2">{products[0]?.parentProductName || ""}</p>
          <span className="text-xs border-dashed border-b border-stone-300 mt-3">Items in this combo</span>
          {products.map((childProduct: any, index: number) => (
            <div key={`${childProduct.productId}_${index}`} className="mt-3 mb-6">
              <p className="text-xs text-gray-500">{`${childProduct.quantity}x ${
                childProduct.name.includes("-")
                  ? childProduct.name.slice(0, childProduct.name.lastIndexOf("-"))
                  : childProduct.name
              }`}</p>

              {childProduct?.shadeLabel && (
                <div className="flex items-center justify-between mt-2 mb-3">
                  <div className="flex items-center">
                    <img src={childProduct.shadeImage} alt={childProduct.shadeLabel} className="w-3 h-3 rounded-sm" />
                    <span className="text-xs ml-1 ">{`- ${childProduct.shadeLabel}`}</span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(childProduct);
                      loadProductShades(childProduct);
                    }}
                    className="border-color1 text-color1 text-xs border-b leading-tight"
                  >
                    {t("changeShade") || "Change Shade"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs  w-full">
          {products?.length && products[0]?.totalPrice > products[0]?.price ? (
            <div className="flex items-center">
              <span className="font-semibold mr-1.5 text-xs">{formatPrice(products[0]?.price, true) || ""}</span>
              <del className="text-gray-400 text-xs">{formatPrice(products[0]?.totalPrice, true) || ""}</del>
            </div>
          ) : (
            <span className="font-semibold mr-1 text-sm">{formatPrice(products[0]?.totalPrice, true) || ""}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditOrderComboProducts;
