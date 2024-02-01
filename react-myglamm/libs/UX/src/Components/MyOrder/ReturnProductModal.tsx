import React, { useEffect, useState } from "react";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PopupModal from "../PopupModal/PopupModal";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import { formatPrice } from "@libUtils/format/formatPrice";

export const ProductCard = ({ product, t, onToggle }: any) => {
  const handleChange = (productSelected: any, event: any) => {
    onToggle(productSelected, event);
  };
  return (
    <div
      className="flex my-1 bg-white items-center"
      style={{
        marginTop: "25px",
      }}
      key={product.id}
    >
      <div className="mr-1" style={{ width: "8%" }}>
        {!product.checked ? (
          <button
            type="button"
            aria-label="checkbox"
            className="border border-pink bg-white m-auto table"
            style={{ outline: "none", width: "19px", height: "19px" }}
            onClick={() => handleChange(product, true)}
          />
        ) : (
          <img
            src="https://files.myglamm.com/site-images/original/checkbox.png"
            style={{ width: "19px", height: "19px" }}
            onClick={() => handleChange(product, false)}
            className="m-auto"
            alt={product.name}
            role="presentation"
          />
        )}
      </div>

      <ImageComponent className="mr-2" style={{ width: "90px", height: "90px" }} src={product.imageUrl} alt={product.name} />

      <div className="w-2/3">
        <h6 className="text-sm m2-3 mb-4" style={{ width: "100%", paddingRight: "36px" }}>
          {product.name}
        </h6>
        <p className="mr-4 text-xs mb-3" style={{ color: "#949494" }}>
          {t("qty")} <span className="ml-4 text-xs font-bold text-black">{product.quantity}</span>
        </p>
        {!product.isFree &&
          !product.isProductFree &&
          !product.isPreProductFree &&
          (product.price > product.offerPrice ? (
            <div className="flex w-full items-center">
              <h2 className="font-bold text-lg mr-2">{formatPrice(product.offerPrice, true)}</h2>
              <h2 className="font-thin line-through mr-2" style={{ color: "#9b9b9b", marginTop: "2px" }}>
                {formatPrice(product.price, true)}
              </h2>
            </div>
          ) : (
            <div className="flex flex-start items-center w-full">
              <h2 className="font-bold text-lg ">{formatPrice(product.offerPrice, true)}</h2>
            </div>
          ))}
        {(product.isFree || product.isProductFree || product.isPreProductFree) && <div>Free</div>}
      </div>
    </div>
  );
};

const ReturnProductModal = ({ show, onRequestClose, handleReturnProduct, orderId, productList, t }: any) => {
  const [productListArr, setProductListArr] = useState(productList);
  const [selectedProduct, setSelectedProduct] = useState<any>();

  useEffect(() => {
    setProductListArr(productList);
  }, [productList]);

  const onToggle = (productSelected: any, event: any) => {
    setProductListArr(
      productListArr.map((element: any) => {
        if (productSelected.productId === element.productId) {
          if (event) {
            element.checked = true;
            setSelectedProduct(productSelected);
            selectExchangeProductAdobeClick(productSelected);
          } else {
            element.checked = false;
            setSelectedProduct(undefined);
          }
        } else {
          element.checked = false;
        }
        return element;
      })
    );
  };

  // Adobe Analytics(122) - Add trigger when user clicks Replace  on My Order Page : Replace Product
  const selectExchangeProductAdobeClick = (productSelected: any) => {
    (window as any).digitalData = {
      common: {
        assetType: "my order",
        ctaName: "replace select product",
        linkName: "web|hamburger|account|my account|my orders",
        linkPageName: "web|hamburger|account|my account|my orders",
        newAssetType: "my account",
        newLinkPageName: "my order",
        pageLocation: "",
        platform: ADOBE.PLATFORM,
        subSection: "my order",
      },
      product: [
        {
          PWP: "",
          hasTryOn: "no",
          isPreOrder: "no",
          productDiscountedPrice: formatPrice(productSelected.unitPrice - productSelected.offerPrice),
          productOfferPrice: formatPrice(productSelected.offerPrice),
          productPrice: formatPrice(productSelected.unitPrice),
          productQuantity: 1,
          productRating: 0,
          productSKU: productSelected.sku,
          productTotalRating: 0,
          stockStatus: "in stock",
        },
      ],
      user: window.digitalData.user || {},
    };
    Adobe.Click();
  };

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <div
        style={{
          padding: "33px 12px 90px",
          borderRadius: "10px",
          background: "#fff",
        }}
      >
        <h4
          style={{
            fontSize: "18px",
            display: "inline",
            fontWeight: "bold",
            padding: "0px 2px",
            letterSpacing: "-0.1px",
            backgroundSize: "100% 75%",
            backgroundRepeat: "no-repeat",
            transition: "background-size 0.4s ease 0s",
            backgroundImage: "linear-gradient(transparent 74%, #f3caca 0px)",
          }}
        >
          Choose a product that you want to Exchange
        </h4>
        <div style={{ overflowY: "scroll", maxHeight: "400px", marginTop: "10px" }}>
          {productList &&
            productList.map((product: any, index: any) => (
              <ProductCard
                product={product}
                t={t}
                index={index}
                productList={productList}
                onToggle={onToggle}
                key={product.productId}
              />
            ))}
        </div>
      </div>

      <div className="flex items center bg-white z-40 pb-2" style={{ boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.19)" }}>
        <div
          aria-hidden="true"
          className="w-1/2 flex items-center justify-centerfont-thin text-sm ml-2 mt-2"
          onClick={onRequestClose}
        >
          {t("noThanks")}
        </div>
        <div
          aria-hidden="true"
          className="w-1/2 flex text-center items-center justify-center bg-black content-center mr-2 text-white text-sm font-semibold rounded mt-2 h-10"
          style={{
            backgroundImage: "linear-gradient(to left, #000000, #454545)",
          }}
          onClick={() => {
            handleReturnProduct(selectedProduct, orderId);
          }}
        >
          Exchange This Product
          <img style={{ margin: "5px" }} src="https://files.myglamm.com/site-images/original/return.png" alt="return" />
        </div>
      </div>
    </PopupModal>
  );
};

export default ReturnProductModal;
