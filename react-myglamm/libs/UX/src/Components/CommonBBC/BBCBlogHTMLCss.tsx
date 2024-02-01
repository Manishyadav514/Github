import React, { Fragment } from "react";

const BBCBlogHTMLCss = ({ additionalClass, staticHtml }: { additionalClass?: string; staticHtml: any }) => (
  <Fragment>
    {staticHtml && (
      <style jsx global>
        {`
          .inner-html {
            background-color: inherit;
          }
          .inner-html .list-decimal {
            list-style: decimal !important;
            padding: 1rem 0;
          }
          .inner-html ol li,
          .inner-html ul li {
            padding-bottom: 0.4rem;
            list-style-position: inside !important;
          }
          .inner-html h1 {
            font-size: 1.25rem !important;
            font-weight: 800 !important;
            padding-bottom: 1rem !important;
          }

          .inner-html h2 {
            font-size: 1.1rem !important;
            line-height: 1.5rem !important;
          }

          .inner-html h3 {
            font-size: 1rem !important;
            padding-top: 1rem !important;
            line-height: 1.7rem !important;
          }
          .inner-html h4 {
            font-size: 0.9rem !important;
          }

          .inner-html h5 {
            font-size: 0.8rem !important;
          }

          .inner-html h6 {
            font-size: 0.7rem !important;
          }

          .inner-html h2,
          .inner-html h3,
          .inner-html h4,
          .inner-html h5,
          .inner-html h6 {
            font-weight: 800 !important;
            padding: 1rem 0 !important;
          }

          .inner-html video {
            width: 100% !important;
          }
          .inner-html div,
          .inner-html p {
            color: #444 !important;
          }
          .inner-html div.rating-price {
            display: flex !important;
          }
          .inner-html div.plumb-product-details {
            display: flex !important;
            justify-content: space-between !important;
            width: 100% !important;
          }
          .inner-html div.rating {
            display: flex !important;
            align-items: center !important;
          }
          .inner-html > div {
            padding-bottom: 1rem !important;
          }
          .inner-html ol {
            list-style: decimal !important;
            padding: 1rem 0 !important;
          }
          .inner-html ul {
            list-style: disc !important;
            padding: 0.4rem 0 !important;
            padding-left: 0.4rem !important;
          }
          .inner-html ol li,
          .inner-html ul li {
            padding-bottom: 0.4rem !important;
            list-style-position: inside !important;
          }
          .inner-html .wp-block-image figcaption {
            padding-top: 8px !important;
          }
          .inner-html .wp-block-image figcaption,
          .inner-html .img-credit {
            text-align: center !important;
            font-size: 15px !important;
          }

          .inner-html blockquote {
            margin: 0 auto 1.2rem !important;
          }
          .inner-html .wp-block-embed .wp-block-embed__wrapper {
            overflow: hidden !important;
            /* padding-top: 55% !important; */
            position: relative !important;
          }
          .inner-html .wp-block-embed .wp-block-embed__wrapper iframe {
            width: 100% !important;
            /* height: 100% !important;
            position: absolute !important; */
            left: 0 !important;
            top: 0 !important;
            border: 0 !important;
          }
          .inner-html .wp-block-embed-popxo .wp-block-embed__wrapper {
            padding-top: 50% !important;
          }
          .inner-html .wp-block-embed-twitter .wp-block-embed__wrapper {
            padding-top: 0 !important;
          }
          .inner-html .wp-block-embed-twitter .wp-block-embed__wrapper .twitter-tweet {
            margin: 0 auto !important;
          }
          .inner-html p {
            font-size: 0.9rem !important;
            text-align: left !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .inner-html p.product-brand {
            justify-self: flex-start !important;
          }
          .inner-html img {
            margin: 0 auto 8px !important;
          }

          .inner-html img.star-rating {
            margin: 0 5px !important;
            height: 12px !important;
          }
          .inner-html img.product-arrow-icon {
            margin: 0 !important;
            margin-left: 5px !important;
          }
          .inner-html figure {
            width: 100% !important;
            margin: 1rem auto !important;
          }
          .inner-html table {
            width: 100% !important;
            text-align: center !important;
            border: 1px solid black !important;
            max-width: 100%;
            overflow-x: scroll;
          }
          .inner-html table tr {
            display: flex !important;
            padding: 1px !important;
          }
          .inner-html table th,
          .inner-html table td {
            border: 1px solid black !important;
            display: table-cell !important;
            width: 100% !important;
            margin: 1px !important;
          }
          .inner-html table th {
            font-weight: 600 !important;
          }
          .inner-html pre {
            overflow: hidden !important;
          }

          .inner-html {
            font-size: 14px;
            overflow-x: auto;
          }

          .inner-html a {
            color: #1890ff;
          }

          .inner-html a > * {
            color: #1890ff;
          }
          .inner-html td {
            border: solid 1px gray;
            padding: 0 5px;
          }
          .inner-html :not(.table-of-content li) {
            list-style: disc;
          }
          .tooltip-arrow-right-wrapper:before {
            content: "";
            display: block;
            width: 0;
            height: 0;
            position: absolute;
            border-top: 8px solid transparent;
            border-bottom: 8px solid transparent;
            border-left: 8px solid #fff;
            right: -6px;
            top: 50%;
            transform: translateY(-50%);
          }
          .modal-close-icon::after {
            display: inline-block;
            content: "⨯";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .about-service-content ul {
            padding-left: 20px;
          }
        `}
      </style>
    )}
    <section className={`${additionalClass || ""} inner-html`}>{staticHtml}</section>
  </Fragment>
);

export default BBCBlogHTMLCss;
