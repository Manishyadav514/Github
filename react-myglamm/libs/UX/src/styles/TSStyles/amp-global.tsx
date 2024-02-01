export const AMPGlobalStyles = `
  .text-sm {
    font-size: .875rem;
    line-height: 1.25rem;
  }
  .amp-logo {
    margin-top: 6px;
  }

  header {
    z-index: 99;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  html {
    -webkit-tap-highlight-color: transparent;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
  body {
    position: relative;
    background: #f4f4f4;
    overflow: unset;
    font-family: sans-serif;
  }
  section {
    background-color: #fff;
  }
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  strong {
    font-weight: 600;
  }
  em {
    font-style: italic;
  }
  div,
  svg {
    display: block;
  }
  a {
    color: inherit;
    text-decoration: inherit;
  }
  a {
    background-color: transparent;
  }
  img,
  video {
    max-width: 100%;
    height: auto;
  }
  audio,
  canvas,
  embed,
  iframe,
  img,
  object,
  svg,
  video {
    display: block;
    vertical-align: middle;
  }
  [role="button"],
  button {
    cursor: pointer;
  }
  button {
    background-color: transparent;
    background-image: none;
    padding: 0;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.15;
    margin: 0;
  }
  body.no-scroll {
    overflow: hidden;
  }
  #portrait-overlay {
    display: none;
  }
  @media screen and (min-width: 780px) {
    #portrait-overlay {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 99999;
    }
    #portrait-overlay p {
      margin: 0.5rem 0;
    }
  }
  .ReactModal__Body--open,
  .ReactModal__Html--open,
  .ReactModal__Overlay--after-open {
    overflow: hidden;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-between{
    justify-content:space-between
  }
  .flex-col {
    flex-direction: column;
  }
  .flex {
    display: flex;
  }
  .w-full {
    width: 100%;
  }
  .shadow {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  }
  .top-0 {
    top: 0;
  }
  .sticky {
    position: -webkit-sticky;
    position: sticky;
  }
  .h-12 {
    height: 3rem;
  }
  .items-center {
    align-items: center;
  }
  .flex-row {
    flex-direction: row;
  }
  .bg-white {
    background-color: #fff;
  }
  .bg-black-cart-button {
    background-color: rgba(0, 0, 0);
  }
  .min-h-screen {
    min-height: 100vh;
  }
  .pb-2 {
    padding-bottom: 0.5rem;
  }
  .p-2 {
    padding: 0.5rem
  }
  .p-3 {
    padding: 0.75rem;
  }
  .pb-3 {
    padding-bottom: 0.75rem;
  }
  .pt-3 {
    padding-top: 0.75rem;
  }
  .pb-1 {
    padding-bottom: 0.25rem;
  }
  .mt-4 {
    margin-top: 1rem;
  }
  .text-lg {
    font-size: 1.125rem;
  }
  .text-gray-600 {
    color: rgb(75 85 99/var(--tw-text-opacity));
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .flex-1 {
    flex: 1 1 0%;
  }
  .h-8 {
    height: 2rem;
  }
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .m-2 {
    margin: 0.5rem;
  }
  .m-auto {
    margin: auto;
  }
  .mx-auto {
    margin: 0 auto;
  }
  .my-auto {
    margin: auto 0;
  }
  .my-2 {
    margin: 0.5rem 0;
  }
  .block {
    display: block;
  }
  .pt-4 {
    padding-top: 1rem;
  }
  .pb-4 {
    padding-bottom: 1rem;
  }
  .px-10 {
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
  .px-12 {
    padding-left: 3rem;
    padding-right: 3rem;
  }
  .pb-20 {
    padding-bottom: 5rem;
  }
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .z-40 {
    z-index: 40;
  }
  .text-2xl {
    font-size: 1.5rem;
  }
  .fixed {
    position: fixed;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-xl {
    font-size: 1.25rem;
  }
  .text-gray-700 {
    color: #4a5568;
  }
  .text-center {
    text-align: center;
  }
  .pl-0 {
    padding-left: 0;
  }
  .pl-2 {
    padding-left: 0.5rem;
   }
  .p-3 {
    padding: 0.75rem;
    padding-left: 0.75rem;
  }
  .p-2 {
    padding: 0.5rem;
  }
  .pl-1{
    padding-left:0.25rem
  }
  .ml-3 {
    margin-left: 0.75rem;
  }
  .ml-2 {
    margin-left: 0.5rem;
  }
  .leading-tight {
    line-height: 1.25;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .text-xs {
    font-size: 0.75rem;
  }
  .text-custom{
    font-size:11.2px;
    letter-spacing:0.22px;
    line-height: 1.54;
  }
  .text-rating{
    font-size:10px;
  }
  .leading-normal {
    line-height: 1.5;
  }
  .h-12 {
    height: 3rem;
  }
  .h-32 {
    height: 8rem;
  }
  .font-semibold {
    font-weight: 600;
  }
  .-mt-3 {
    margin-top: -0.75rem;
  }
  .mb-3 {
    margin-bottom: 0.75rem;
  }
  .mb-1 {
    margin-bottom: 0.25rem;
  }
  .w-1\\/4 {
    width: 25%;
  }
  .w-3\\/4 {
    width: 75%;
  }
  .text-base {
    font-size: 1rem;
  }
  .inline-block {
    display: inline-block;
  }
  .w-1\\/3 {
    width: 33.333333%;
  }
  .text-white {
    color: #fff;
  }
  .pl-8 {
    padding-left: 2rem;
  }
  .pl-6 {
    padding-left: 1.5rem;
  }
  .pl-4 {
    padding-left: 1rem;
  }
  .-mt-4 {
    margin-top: -1rem;
  }
  .font-hairline {
    font-weight: 100;
  }
  .w-40 {
    width: 10rem;
  }
  .border-rating{
    border-radius: 3px;
    border: solid 0.5px #ebebeb;
    padding:2px
  }
  .ticker-section {
    height: 40px;
    font-size: 11px;
    background: #fee8e8;
  }
  .ticker-section a {
    display: table;
    color: #000;
  }
  .ticker-section .ticker-pink-txt {
    color: var(--color1);
  }
  .ticker-section .ico-ticker-gift {
    background: url(https://files.myglamm.com/site-images/original/ticker-gift.png);
    background-repeat: no-repeat;
    background-size: cover;
    z-index: 9999;
    padding: 2px 0 0 23px;
  }
  .ticker-section .ico-ticker-gift .ticker-refer {
    display: table-cell;
    vertical-align: middle;
    width: 81%;
    padding-right: 8px;
  }
  .ticker-section .ico-ticker-percentage {
    background: url(https://files.myglamm.com/site-images/original/ticker-percentage-offer.png) no-repeat 0 50%;
    padding: 2px 0 0 23px;
  }
  .ticker-section .ico-ticker-percentage .ticker-refer {
    display: table-cell;
    vertical-align: middle;
    width: 81%;
    padding-right: 8px;
  }
  .ticker-section .ticker-refer-now {
    color: var(--color1);
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    display: table-cell;
    vertical-align: middle;
    width: 19%;
  }
  .CenterModal.shadow-lg.glammPopup {
    background-color: #fff;
    border-radius: 20px;
  }
  .modal-dialog {
    background-color: #fff;
    border-radius: 20px;
  }
  .modal-content {
    padding: 30px 12px;
  }
  .modal-head {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 18px;
  }
  .close {
    font-size: 62px;
    position: absolute;
    right: 6px;
    top: -22px;
    z-index: 1;
    color: #000;
    opacity: 1;
  }
  .birthday-txt {
    font-weight: 700;
    font-size: 23px;
  }
  .birthday-modal .close {
    font-size: 45px;
    position: absolute;
    right: 10px;
    top: 4px;
    z-index: 1;
    color: #000;
    opacity: 9;
  }
  .select-box {
    width: 100%;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 6px;
    margin: 8px 0;
  }
  .popupSubmit {
    width: 100%;
    margin-top: 20px;
    margin-bottom: 30px;
    background: #000;
    color: #fff;
    padding: 5px;
    border-radius: 3px;
  }
  .glammPopup {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 90%;
  }
  .birthDayForm {
    margin: 10px 10px 10px 10px;
  }
  .popup-heading {
    margin: 0 42px;
  }

  .footer-container {
    position: relative;
    right: 0;
    left: 0;
    bottom: 0;
    padding: 1rem 0;
    z-index: 100;
    background-color: #000;
    font-family: inherit;
  }
  .footer-container .footer-content-container {
    display: flex;
    justify-content: center;
    padding-bottom: 1.5rem;
  }
  .footer-container .glaminsider-image {
    display: block;
    width: auto;
    margin: 0 auto;
    padding: 0 1rem;
    height: 5rem;
  }
  .footer-container .mobile-input-container {
    display: flex;
    justify-content: center;
    background-color: #fff;
    margin: 0.75rem 1rem;
    border-radius: 0.5rem;
  }
  .footer-container .social-container {
    display: flex;
    margin-bottom: 1rem;
  }
  .footer-container .social-image-container {
    width: 25%;
    height: 3rem;
    padding: 1.25rem 0.75rem;
  }
  .footer-container .social-image {
    height: 1.5rem;
    width: 1.5rem;
  }
  .footer-container .download-text {
    color: #fff;
    text-align: center;
    padding-top: 0.75rem;
    font-weight: 300;
    font-size: 1rem;
  }
  .footer-container .appstore-image-container {
    display: flex;
    margin-bottom: 1rem;
    justify-content: center;
  }
  .footer-container .android-icon-container {
    display: flex;
    justify-content: flex-end;
    width: 50%;
    height: 3rem;
    padding-left: 0.5rem;
    padding-right: 0.25rem;
  }
  .footer-container .ios-icon-container {
    width: 50%;
    height: 3rem;
    padding-right: 0.5rem;
    padding-left: 0.25rem;
  }
  .footer-container .appstore-image {
    height: 2.5rem;
    width: auto;
  }
  .footer-container .copyright-container {
    padding: 0 1rem;
  }
  .footer-container .copyright-text {
    display: flex;
    justify-content: center;
    padding: 0.25rem 0;
    border-top-width: 1px;
  }
  .mt-1 {
    margin-top: 0.25rem;
  }
  .product-card {
    border: 1px solid rgb(211,211,211);
   }
   border {
      border: 1px solid black;
   }
   .product-heading {
     display:flex;
      }
   .rounded-full {
    border-radius: 9999px;
   }
   .rounded {
     border-radius: 0.25rem;
   }
    .border-black {
      border: 1px solid black;
    }
    .bg-black{
      background-color: black;
    }
    .text-lg{
      font-size: 1.125rem; 
      letter-spacing: 0.1em;
    } 
    .font-extrabold{
      font-weight: 800;
    }
    .flex{
      display: flex;
    }
    .flex-wrap{
      flex-wrap: wrap;
    }
    .text-center{
      text-align: center;
    }
    .mb-6{
      margin-bottom: 1.5rem 
    }
    .text-xs{
      font-size: .75rem;
      line-height: 1rem; 
    }
    .mx-1{
      padding: 0 0.25rem
    }
    .h-10{
      height: 2.5rem
    }
    .Blogs a {
      color: darkblue;
      text-decoration: underline;
      font-weight: bold;
    }
    .Blogs span a {
      margin-right: 2px;
    }
    .Blogs p:has(span b:empty), .Blogs p span:empty, .Blogs p:empty {
      display: none;
    }
    .pt-0 {
      padding-top: 0;
    }
    .p-4 {
      padding: 1rem;
    }
    .prose {
      --tw-prose-body: #374151;
      --tw-prose-headings: #111827;
      --tw-prose-lead: #4b5563;
      --tw-prose-links: #111827;
      --tw-prose-bold: #111827;
      --tw-prose-counters: #6b7280;
      --tw-prose-bullets: #d1d5db;
      --tw-prose-hr: #e5e7eb;
      --tw-prose-quotes: #111827;
      --tw-prose-quote-borders: #e5e7eb;
      --tw-prose-captions: #6b7280;
      --tw-prose-code: #111827;
      --tw-prose-pre-code: #e5e7eb;
      --tw-prose-pre-bg: #1f2937;
      --tw-prose-th-borders: #d1d5db;
      --tw-prose-td-borders: #e5e7eb;
      --tw-prose-invert-body: #d1d5db;
      --tw-prose-invert-headings: #fff;
      --tw-prose-invert-lead: #9ca3af;
      --tw-prose-invert-links: #fff;
      --tw-prose-invert-bold: #fff;
      --tw-prose-invert-counters: #9ca3af;
      --tw-prose-invert-bullets: #4b5563;
      --tw-prose-invert-hr: #374151;
      --tw-prose-invert-quotes: #f3f4f6;
      --tw-prose-invert-quote-borders: #374151;
      --tw-prose-invert-captions: #9ca3af;
      --tw-prose-invert-code: #fff;
      --tw-prose-invert-pre-code: #d1d5db;
      --tw-prose-invert-pre-bg: rgb(0 0 0/50%);
      --tw-prose-invert-th-borders: #4b5563;
      --tw-prose-invert-td-borders: #374151;
      font-size: 1rem;
      line-height: 1.75;
      color: var(--tw-prose-body);
      max-width: 65ch;
    }
    .prose h2 {
      color: var(--tw-prose-headings);
      font-weight: 700;
      font-size: 1.5em;
      margin-top: 1em;
      margin-bottom: 1em;
      line-height: 1.3333333;
    }
    .prose :where(p):not(:where([class~=not-prose] *)) {
      margin-top: 1.25em;
      margin-bottom: 1.25em;
    }
    .prose img {
      margin-top: 2em;
      margin-bottom: 2em;
    }
    .prose p {
      word-break: break-word;
    }
    [dir=ltr] .prose-sm :where(ul):not(:where([class~=not-prose] *)) {
      padding-left: 1.5714286em;
    }
    .py-6 {
      padding-top: 1.5rem;
      padding-bottom: 1.5rem;
    }
    .w-6 {
      width: 1.5rem;
    }
    .mb-2 {
        margin-bottom: 0.5rem;
    }
    .text-xxs {
      font-size: .6rem;
    }
    .px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .w-16 {
      width: 4rem;
    }
    .h-16 {
        height: 4rem;
    }
    .text-black {
      --tw-text-opacity: 1;
      color: rgb(0 0 0/var(--tw-text-opacity));
    }
    .to-red-200 {
      --tw-gradient-to: #fecaca;
    }
    .via-transparent {
      --tw-gradient-stops: var(--tw-gradient-from),transparent,var(--tw-gradient-to,rgb(0 0 0/0));
    }
    .from-transparent {
      --tw-gradient-from: transparent;
    }
    .bg-gradient-to-b {
      background-image: linear-gradient(180deg,var(--tw-gradient-stops));
    }
    .w-max {
      width: max-content;
    }
    .h-4 {
      height: 1rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .ml-1 {
      margin-left: 0.25rem;
    }
    .overflow-y-scroll {
      overflow-y: scroll;
    }
    .overflow-hidden {
      overflow: hidden;
    }
    .h-auto {
      height: auto;
    }
    .inline-flex {
      display: inline-flex;
    }
    .mt-2\\.5 {
      margin-top: 0.625rem;
    }
    ol, ul {
      list-style: unset;
      margin: 0;
      padding: 0;
    }
    [dir=ltr] .mr-3\\.5 {
      margin-right: 0.875rem;
    }
    .w-80 {
      width: 20rem;
    }
    .rounded-3xl {
      border-radius: 1.5rem;
    }
    img, video {
      max-width: 100%;
      height: auto;
    }
    audio, canvas, embed, iframe, img, object, svg, video {
      display: block;
      vertical-align: middle;
    }
    .my-4 {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
    .text-gray-500 {
      --tw-text-opacity: 1;
      color: rgb(107 114 128/var(--tw-text-opacity));
    }
    .mr-1 {
      margin-right: 0.25rem;
    }
    .mx-0\\.5 {
      margin-left: 0.125rem;
      margin-right: 0.125rem;
    }
    .line-through {
      text-decoration-line: line-through;
    }
    .text-gray-400 {
      --tw-text-opacity: 1;
      color: rgb(156 163 175/var(--tw-text-opacity));
    }
    .mt-0\\.5 {
        margin-top: 0.125rem;
    }
    .text-2xl {
      font-size: 1.5rem;
      line-height: 2rem;
    }
    .pt-10 {
      padding-top: 2.5rem;
    }
    .py-5 {
      padding-top: 1.25rem;
      padding-bottom: 1.25rem;
    }
    .grid-cols-2 {
        grid-template-columns: repeat(2,minmax(0,1fr));
    }
    .grid {
        display: grid;
    }
    .h-28 {
      height: 7rem;
    }
    .px-5 {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
    .h-44 {
      height: 11rem;
    }
    .pt-12 {
      padding-top: 3rem;
    }
    .tracking-widest {
      letter-spacing: .1em;
    }
    .max-w-xs {
      max-width: 20rem;
    }
    .pt-5 {
      padding-top: 1.25rem;
    }
    .mx-5 {
        margin-left: 1.25rem;
        margin-right: 1.25rem;
    }
    .max-w-xs {
      max-width: 20rem;
    }
    .py-1 {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    .py-3 {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }
    .pr-3 {
      padding-right: 0.75rem;
    }
    .w-auto {
      width: auto;
    }
    .pb-5 {
      padding-bottom: 1.25rem;
    }
    .mx-4 {
      margin-left: 1rem;
      margin-right: 1rem;
    }
    .pb-6 {
      padding-bottom: 1.5rem;
    }
    .font-thin {
      font-weight: 100;
    }
    .text-11 {
        font-size: 11px;
    }
    .border-gray-600 {
      --tw-border-opacity: 1;
      border-color: rgb(75 85 99/var(--tw-border-opacity));
    }
    .border-t {
        border-top-width: 1px;
    }
`;
