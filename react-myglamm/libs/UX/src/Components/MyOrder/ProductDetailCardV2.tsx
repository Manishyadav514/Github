import { formatPrice } from "@libUtils/format/formatPrice";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import useTranslation from "@libHooks/useTranslation";
import LoadSpinner from "@libComponents/Common/LoadSpinner";

const ProductDetailCardV2 = (props: any) => {
  const { product, setSelectedProduct, loadProductShades, isLastProductInList, isFreeProduct, shadeAssetsLoading } = props;
  const { t } = useTranslation();
  return (
    <div
      key={product?.productId}
      className={`flex py-4 px-2 ${isLastProductInList ? "" : "border-b border-dashed border-color1"}`}
    >
      <div className="pr-4">
        <div role="presentation" className="h-20 w-20 my-auto">
          <ImageComponent alt={product?.name} src={product?.imageUrl || DEFAULT_IMG_PATH} />
        </div>
      </div>
      <div className="flex flex-col space-y-3 w-full">
        <div className="text-xs">{product?.name?.split("-")[0]}</div>
        <div className="flex justify-between items-center">
          {product?.shadeLabel && (
            <div className="flex items-start">
              <img src={product?.shadeImage} className="w-3 h-3 rounded" />
              <p className={`text-gray-400 text-10 ml-1 font-bold uppercase`}>{product?.shadeLabel}</p>
            </div>
          )}
          {product?.shadeChangeOption &&
            (shadeAssetsLoading ? (
              <LoadSpinner className="w-4" />
            ) : (
              <span
                className="underline underline-offset-2 text-color1 text-10"
                onClick={() => {
                  setSelectedProduct(product);
                  loadProductShades(product);
                }}
              >
                {t("changeShade") || "Change Shade"}
              </span>
            ))}
        </div>
        {isFreeProduct ? (
          <span className="font-semibold mr-1.5 text-xs">Free</span>
        ) : (
          <div className="flex items-end h-full">
            {product?.totalPrice > product?.price ? (
              <div className="flex items-center">
                <span className="font-semibold mr-1.5 text-xs">{formatPrice(product?.price, true)}</span>
                <del className="text-gray-400 text-xs">{formatPrice(product?.totalPrice, true)}</del>
              </div>
            ) : (
              <span className="font-semibold mr-1 text-sm">{formatPrice(product?.totalPrice, true)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailCardV2;
