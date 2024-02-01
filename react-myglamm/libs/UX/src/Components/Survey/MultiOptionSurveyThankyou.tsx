import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPAvgRating from "@libComponents/PDP/PDPAvgRating";
import useTranslation from "@libHooks/useTranslation";
import { formatPrice } from "@libUtils/format/formatPrice";
import Tickmark from "../../../public/svg/check-mark.svg";

const MultiOptionSurveyThankyou = ({
  products,
  ratings,
  headerImage,
  backgroundColor,
  priceLabel,
  choosePDPProduct,
}: {
  products: any;
  ratings: any;
  headerImage: string;
  priceLabel?: string;
  backgroundColor: string;
  choosePDPProduct: (e: any, product: any, index: number, flag: boolean) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        backgroundSize: "100% 100%",
        backgroundColor: backgroundColor ? backgroundColor : "#e3e3e9",
      }}
    >
      <div className="w-full flex justify-center items-center bg-cover bg-center bg-no-repeat bg-top">
        <ImageComponent className="img-responsive text-center" src={headerImage} />
      </div>
      <form className="flex flex-wrap justify-center items-center ml-4 mt-1 mb-4">
        {products?.data?.map((product: any, index: number) => (
          <div key={index} className="w-44 mb-2">
            <div className="w-40 ml-1 mb-1 border rounded-lg bg-white p-2 border-gray-200 shadow-sm mt-4">
              <div className="flex p-3" onClick={e => choosePDPProduct(e, product, index, true)}>
                <ImageComponent
                  className="img-responsive text-center"
                  src={product.assets[0].imageUrl["200x200"]}
                  alt={product.cms[0].metadata.title}
                />
              </div>
              <div className="flex mt-2 mb-1 h-5">
                <PDPAvgRating
                  size={9}
                  avgRating={ratings?.[product?.id]?.avgRating}
                  totalCount={ratings?.[product?.id]?.totalCount}
                />
              </div>
              <h2 className="text-xs font-bold mt-2 mb-0.5 truncate">{product.productTag}</h2>
              <div className="flex mt-2">
                <span className="line-through text-gray-400 mr-2 text-xs">{formatPrice(product.offerPrice, true)}</span>
                <span className="font-semibold text-xs uppercase text-green-600">{priceLabel || "₹1 ONLY"}</span>
              </div>
              <div className="relative -bottom-5">
                <button
                  type="submit"
                  onClick={e => choosePDPProduct(e, product, index, false)}
                  className="flex justify-center items-center text-xs text-white w-5/6 h-7 shadow-lg rounded-full font-semibold mx-auto bg-themePink"
                >
                  <Tickmark className="mr-1" width="12px" height="12px" fill={"#ffffff"} />
                  {t("choose") || "CHOOSE"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </form>
    </div>
  );
};

export default MultiOptionSurveyThankyou;
