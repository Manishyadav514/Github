import React from "react";

const BlogStyles = () => (
  <style key="storystyle" jsx global>
    {`
      .storyContent a,
      .storyContent a *,
      .storyContent a span {
        color: darkblue;
        text-decoration: underline;
        font-weight: bold;
      }

      .storyContent span a {
        margin-right: 2px;
      }

      .wp-block-heading {
        font-weight: bold;
      }

      .storyContent iframe {
        width: 100%;
        max-height: 700px;
      }
      .storyContent .pull-right {
        float: right;
      }
      .storyContent .fullwidth {
        width: 100%;
      }
      .storyContent .text-center {
        text-align: center;
      }
      .storyContent .text-right {
        text-align: right;
      }
      .storyContent .text-left {
        text-align: left;
      }

      .storyContent {
        scroll-behavior: smooth;
      }
      .storyContent h1 {
        padding-bottom: 1rem 0;
        line-height: 1.7rem;
      }
      .storyContent video {
        width: 100%;
      }
      .storyContent p {
        line-height: 24px !important;
        padding: 5px 0;
        margin: 4px 0 !important;
      }

      .storyContent div.rating-price {
        display: flex;
      }
      .storyContent div.plumb-product-details {
        display: flex;
        justify-content: space-between;
        width: 100%;
      }
      .storyContent div.rating {
        display: flex;
        align-items: center;
      }
      storyContent div.rating .value {
        font-size: 20px;
      }
      .storyContent > div {
        margin-bottom: 1rem !important;
      }
      .storyContent .wp-block-image figcaption {
        padding-top: 8px;
      }
      .storyContent .wp-block-image figcaption,
      .storyContent .img-credit {
        text-align: center;
        font-size: 15px;
      }
      .storyContent .wp-block-embed-twitter .wp-block-embed__wrapper {
        padding-top: 0;
      }
      .storyContent .wp-block-embed-twitter .wp-block-embed__wrapper .twitter-tweet {
        margin: 0 auto;
      }
      .storyContent img {
        margin: 0 auto 8px;
      }

      .storyContent img.star-rating {
        margin: 0 5px;
        height: 12px;
      }
      .storyContent img.product-arrow-icon {
        margin: 0;
        margin-left: 5px;
      }
      .storyContent figure {
        width: 100%;
        margin: 1rem auto;
        height: 100%;
      }
      .storyContent .wp-block-embed-reddit iframe {
        height: 600px;
      }

      .storyContent .instagram-media {
        margin: 12px auto 12px !important;
      }

      @media screen and (max-width: 767px) {
        .storyContent .instagram-media {
          width: calc(100% - 30px) !important;
          margin: 12px 15px !important;
        }
      }
      .storyContent pre {
        overflow: hidden;
      }
      .MyGlammXOProducts.plumb-product a {
        display: grid;
        padding: 0 12px;
        border-radius: 2px;
        border: solid 1px #f3f3f3;
        margin: 12px auto;
        background: #fff;
        max-width: 350px;
      }

      .MyGlammXOProducts.plumb-product .redirection .productPrice {
        font-size: 16px;
        font-weight: bold;
      }

      .MyGlammXOProducts.Featured .ml {
        width: 70%;
      }

      .MyGlammXOProducts.Featured .product-brand {
        font-size: 10px !important;
        font-weight: 300;
        font-style: italic;
      }

      .MyGlammXOProducts.Featured .buyButton .product-add {
        font-size: 14px;
        letter-spacing: 0.6px;
        color: #fb2376;
        text-transform: uppercase;
        display: block;
        padding: 15px 0;
      }

      .MyGlammXOProducts.Featured .productImage {
        margin: 0 auto 8px;
        height: 314px;
        width: 100%;
      }

      .MyGlammXOProducts.Featured .custom-oxhi8 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        text-transform: uppercase;
      }

      .MyGlammXOProducts.Related .redirection .productName {
        text-transform: uppercase;
        padding: 0 !important;
        font-weight: 600 !important;
        font-family: "Playfair Display" !important;
        float: unset;
        margin-bottom: 5px;
        border-bottom: none;
      }

      .MyGlammXOProducts.Related.plane-product em {
        color: #aca7a7;
        font-size: 10px;
      }

      .MyGlammXOProducts.Related .productImage.plane-product-image {
        height: 100%;
        object-fit: contain;
        width: 100% !impotant;
      }

      .MyGlammXOProducts.Related.plane-product .redirection .buyButton .product-add-text {
        font-size: 12px;
        color: #fb2376;
        text-transform: uppercase;
        height: 30px;
      }

      .MyGlammXOProducts.Related .redirection {
        max-width: 500px;
        margin: 0 auto !important;
        align-items: center;
        border-radius: 5px;
        background-color: #fff;
        display: grid;
        grid-template-columns: 130px 1fr;
      }

      .MyGlammXOProducts.Related .redirection {
        font-size: 12px;
        border-radius: 5px;
        margin: 12px auto;
        overflow: hidden;
        text-transform: capitalize;
        background-color: #fff4f7;
      }

      .MyGlammXOProducts.Related .redirection .custom-1wmgg3w {
        max-height: 100px;
        object-fit: contain;
        overflow: hidden;
        height: 100%;
        width: 100%;
      }

      .MyGlammXOProducts.Related.plane-product .redirection .custom-1fnq44q {
        padding: 8px 24px 8px 12px;
        background-color: #fff4f7;
      }

      .MyGlammXOProducts.Related .redirection .productPrice {
        padding: 4px 0;
        font-size: 16px !important;
      }

      @media screen and (max-width: 767px) {
        .MyGlammXOProducts.Related.plane-product .redirection.plane-product-link {
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

export default BlogStyles;
