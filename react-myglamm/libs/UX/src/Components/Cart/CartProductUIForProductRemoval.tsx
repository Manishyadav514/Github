import ImageComponent from "@libComponents/Common/LazyLoadImage";

import { formatPrice } from "@libUtils/format/formatPrice";

import { cartProduct } from "@typesLib/Cart";

type ProductUIType = {
  product: cartProduct;
};

const ProductUI = ({ product }: ProductUIType) => {
  return (
    <>
      <ImageComponent alt={product.name} src={product.imageUrl} className="mr-4 w-20 h-20" />
      <div className="font-semibold overflow-hidden pl-2">
        <p className="text-xs truncate">{product.name}</p>
        <p className="font-light opacity-50 text-xs truncate my-1">{product.subtitle}</p>
        <div className="flex gap-1 items-center my-1">
          {product.shadeImage ? (
            <img src={product.shadeImage} alt={product.shadeLabel} className="w-3.5 h-3.5 rounded" />
          ) : null}
          <span className="uppercase text-xxs text-gray-600 pt-0.5 truncate">{product.shadeLabel}</span>
        </div>
        <div className="flex text-center my-3 items-center">
          {/* <span className="font-semibold mr-1">{formatPrice(product.offerPrice, true)}</span>
            {product.offerPrice < product.price && (
              <del className="text-xxs opacity-75 text-gray-600 my-auto">{formatPrice(product.price, true)}</del>
            )} */}
          {product.totalPrice > product.price ? (
            <>
              <span className="font-semibold mr-1.5 text-sm">{formatPrice(product.price, true)}</span>
              <del className="text-gray-400 text-sm">{formatPrice(product.totalPrice, true)}</del>
            </>
          ) : (
            <span className="font-semibold mr-1 text-sm">{formatPrice(product.totalPrice, true)}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductUI;
