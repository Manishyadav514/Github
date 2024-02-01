import { VendorCodes } from "@typesLib/APIFilters";

import { SITE_CODE } from "@libConstants/GLOBAL_SHOP.constant";

export const getVendorGlobalStyles = (vendor?: VendorCodes) => {
  // @ts-ignore
  return VENDOR_STYLES[vendor || SITE_CODE()];
};

const VENDOR_STYLES = {
  mgp: `
    :root {
      --color1: #ff9797;
      --color2: #fee8e8;
      --color3: #ffe1d5;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, #000000, #454545);
      --themePink: #f70665;
      --offerPDP: #fff5f5;
      --pdpConcern: #FFECEC;
    }
  `,
  lit: `
  :root {
    --color1: #ff9797;
    --color2: #fee8e8;
    --color3: #ffe1d5;
    --themeGray: #f4f4f4;
    --btnBg: linear-gradient(to left, #000000, #454545);
    --themePink: #f70665;
    --offerPDP: #fff5f5;
    --pdpConcern: #FFECEC;
  }
`,
  mnm: `
    :root {
      --color1: #000;
      --color2: #dbb757;
      --color3: #dbb757;
      --color4: #000;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to right, #000000 50%, #dbb757);
      --themePink: #f70665;
      --offerPDP: #fff5f5;
      --pdpConcern: #FFECEC;
    }
  `,
  stb: `
    :root {
      --color1: #222e62;
      --color2: #c4d5e5;
      --color3: #e3e4e9;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #222e62;
      --offerPDP: #E3E4E9;
      --pdpConcern: #C4D4E4;
    }
    
    body {
      font-size: 14px;
    }
  `,
  orb: `
    :root {
      --color1: #222e62;
      --color2: #c4d5e5;
      --color3: #e3e4e9;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #222e62;
      --offerPDP: #E3E4E9;
      --pdpConcern: #C4D4E4;
    }
    
    body {
      font-size: 14px;
    }
  `,
  bbc: `
    :root {
      --color1: #fc88b0;
      --color2: #fac4cb;
      --color3: #fee8e8;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #fc88b0;
      --offerPDP: #FFE4EA;
      --pdpConcern: #FAC4CA;
    }
    
    body {
      font-size: 14px;
    }
    
    .clearfix::after {
      content: "";
      clear: both;
      display: table;
    }
    
    // datepicker
    .DatePicker__input {
      text-align: left !important;
      outline: none !important;
    }
    
    .Calendar__day.-selected,
    .Calendar__day.-selectedEnd,
    .Calendar__day.-selectedStart {
      background: #fc88b0 !important;
    }
    
    .DatePicker__calendarContainer {
      top: 50px !important;
    }
    
    .DatePicker__calendarArrow {
      top: 42px !important;
    }
  `,
  orh: `
    :root {
      --color1: #5a856e;
      --color2: #d6eec5;
      --color3: #14472c;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #5a856e;
      --offerPDP: #D8EACB;
      --pdpConcern: #D6EEC5;
    }
    
    body {
      font-size: 0.9rem;
    }
  `,
  srn: `
    :root{
      --color1: #fe75a1;
      --color2: #f0e7f0;
      --color3: #fdeffd;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #fe75a1;
      --offerPDP: #FFE4EA;
      --pdpConcern: #EFE6EF;
    }
  `,
  blu: `
    :root{
      --color1: #fe75a1;
      --color2: #f0e7f0;
      --color3: #fdeffd;
      --themeGray: #f4f4f4;
      --btnBg: linear-gradient(to left, var(--color1), var(--color1));
      --themePink: #fe75a1;
      --offerPDP: #FFE4EA;
      --pdpConcern: #EFE6EF;
    }
  `,
  tmc: `
  body {
    font-size: 14px;
  }
  
  :root {
    --color1: #3d76c9;
    --color2: #edf6fa;
    --color3: #edf6fa;
    --themeGray: #f4f4f4;
    --btnBg: linear-gradient(to left, var(--color1), var(--color1));
    --themePink: #3d76c9;
    --offerPDP: #EDF5FF;
    --pdpConcern: #EDF6FA;
  }
  
  /*  ingredients list css start */
  .PDPAccordion {
    .swiper {
      ul {
        &.ingredients-list {
          display: block;
          overflow-x: unset;
          li {
            margin: 0px 0px 30px;
            padding-left: 0px;
            width: 100%;
            display: flex;
            display: -webkit-flex;
            align-items: center;
            flex-direction: row;
            .ingredients-list-img {
              img {
                margin: 0px;
                width: 100%;
                height: 100%;
              }
            }
            .ingredients-list-desc {
              h4 {
                margin: 0px;
                font-weight: 800;
              }
            }
          }
        }
      }
      .ingredients-desc {
        p {
          margin-bottom: 16px;
        }
        ul {
          &.ingredients-list {
            li {
              .ingredients-list-desc {
                p {
                  margin: 0px;
                }
              }
            }
          }
        }
      }
    }
    .qa-list {
      padding: 0px;
      list-style: none;
    }
  }
  .ingredients-list-img {
    margin-right: 13px;
    width: 54px;
    height: 54px;
    flex-shrink: 0;
  }
  .ingredients-list-desc {
    flex-grow: 1;
  }
  .PDPAccordion .swiper ul.ingredients-list li .ingredients-list-desc h4,
  .PDPAccordion .swiper .ingredients-desc p {
    font-size: 13px;
    line-height: 19px;
    text-align: left;
  }
  .ingredients-table {
    width: 100%;
    overflow-x: auto;
    margin-bottom: 30px;
    .table {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    thead {
      th {
        font-weight: 800;
        background-color: #eaf0f8;
        text-transform: uppercase;
      }
    }
    tbody {
      tr {
        background-color: #f4f4f4;
        &:nth-child(even) {
          background: rgba(49, 104, 184, 0.1);
        }
      }
    }
  }
  h6 {
    &.ingredients-tab-title {
      margin: 10px 0px 12px;
      font-size: 14px;
      line-height: 19px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: center;
      color: #000;
    }
  }
  .ingredients-table th,
  .ingredients-table td {
    padding: 10px;
    font-size: 10px;
    line-height: 14px;
    color: #000;
    letter-spacing: 0.5px;
  }
  .ingredients-table thead tr th:first-child,
  .ingredients-table tbody tr td:first-child {
    max-width: 140px;
  }
  .ingredients-table thead tr th:nth-child(2),
  .ingredients-table tbody tr td:nth-child(2) {
    max-width: 100px;
  }
  .ingredients-table tbody tr td:first-child,
  .ingredients-table tbody tr td:nth-child(2) {
    word-break: break-word;
  }
  .ingredients-table tbody th,
  .ingredients-table tbody td {
    text-align: left;
    font-weight: 400;
  }
  .more-dtl-desc p,
  .more-dtl-desc ul,
  .more-dtl-desc ol {
    margin-bottom: 16px;
  }
  .more-dtl-desc ul,
  .more-dtl-desc ol {
    margin-top: 4px;
    list-style-position: inside;
  }
  .more-dtl-desc ul li,
  .more-dtl-desc ol li {
    margin-bottom: 16px;
  }
  .more-dtl-desc {
    ol {
      list-style: decimal inside;
    }
    strong {
      font-weight: 900;
      text-transform: capitalize;
    }
  }
  .more-dtl-desc p,
  .more-dtl-desc strong,
  .more-dtl-desc li {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: #000;
  }
  .qa-list {
    li {
      margin-top: 0px;
      margin-bottom: 24px;
      padding-left: 0px;
    }
  }
  .qa-question,
  .qa-ans {
    font-size: 14px;
    line-height: 20px;
    color: #000;
    font-weight: 400;
  }
  .qa-ans {
    margin: 0px;
  }
  .qa-question {
    margin-top: 0px;
    margin-bottom: 8px;
    font-weight: 800;
  }
  `,
  popxo: `
  :root {
    --color1: #fb2376;
    --color2: #ffeef4;
    --color3: #ffeef4;
    --themeGray: #f4f4f4;
    --btnBg: linear-gradient(to left, #000000, #454545);
    --themePink: #f70665;
    --offerPDP: #fff5f5;
    --pdpConcern: #FFECEC;
  }
  `,
  twk: `
  :root {
    --color1: #b7cfcb;
    --color2: #dbb6b7;
    --color3: #dbb6b7;
    --themeGray: #f4f4f4;
    --btnBg: linear-gradient(to left, #3F3F41, #3F3F41);
    --themePink: #f70665;
    --offerPDP: #fff5f5;
    --pdpConcern: #FFECEC;
  }
  `,
};
