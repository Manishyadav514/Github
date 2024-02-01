import React from "react";

const ArticleDetailStyles = () => (
  <style key="storystyle" jsx global>
    {`
      .plumb-product a {
        display: grid;
        padding: 0 12px;
        border-radius: 2px;
        border: solid 1px #f3f3f3;
        margin: 12px auto;
        background: #fff;
        max-width: 350px;
      }

      .plumb-product .redirection .productPrice {
        font-size: 16px;
        font-weight: bold;
      }

      .Featured .ml {
        width: 70%;
      }

      .Featured .product-brand {
        font-size: 10px !important;
        font-weight: 300;
        font-style: italic;
      }

      .Featured .buyButton .product-add {
        font-size: 14px;
        letter-spacing: 0.6px;
        color: #fb2376;
        text-transform: uppercase;
        display: block;
        padding: 15px 0;
      }

      .Featured .productImage {
        margin: 0 auto 8px;
        height: 314px;
      }

      .Featured .custom-oxhi8 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        text-transform: uppercase;
      }

      .Related .redirection .productName {
        text-transform: uppercase;
        padding: 0 !important;
        font-weight: 600 !important;
        font-family: "Playfair Display" !important;
      }

      .Related.plane-product em {
        color: #aca7a7;
        font-size: 10px;
      }

      .Related .productImage.plane-product-image {
        height: 100%;
        object-fit: contain;
        width: 100% !important;
      }

      .Related.plane-product .redirection .buyButton .product-add-text {
        font-size: 12px;
        color: #fb2376;
        text-transform: uppercase;
        height: 30px;
      }

      .Related .redirection {
        max-width: 500px;
        margin: 0 auto !important;
        align-items: center;
        border-radius: 5px;
        background-color: #fff;
        display: grid;
        grid-template-columns: 130px 1fr;
      }

      .Related .redirection .custom-1wmgg3w {
        max-height: 100px;
        object-fit: contain;
        overflow: hidden;
        height: 100%;
        width: 100%;
      }

      .Related.plane-product .redirection .custom-1fnq44q {
        padding: 8px 24px 8px 12px;
        background-color: #fff4f7;
      }

      .Related .redirection .productPrice {
        padding: 4px 0;
        font-size: 16px !important;
      }

      @media screen and (max-width: 767px) {
        .Related.plane-product .redirection.plane-product-link {
          grid-template-columns: 120px 1fr;
        }
      }

      @media (min-width: 768px) {
        .wp-block-embed-popxo .wp-block-embed__wrapper {
          padding-top: 25%;
        }
      }
    `}
  </style>
);

export default ArticleDetailStyles;
