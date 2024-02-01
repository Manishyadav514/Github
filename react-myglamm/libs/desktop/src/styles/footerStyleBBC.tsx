import React from "react";

export const FooterStyleBBC = (
  <style jsx global>
    {`
      .footer {
        background-color: #262424;
        color: #fff;
        z-index: 1;
        position: relative;
        animation: 3s fadeIn;
        animation-fill-mode: forwards;
        margin: 10px 0px 0px;
        text-align: center;
        min-height: 500px;
        padding: 28px 0px 0px 0px;
        clear: both;

        .serviceName {
          color: #fff;
        }

        .footerTitle {
          color: #fff;
          font-size: 20px;
          font-weight: 500;
          margin: 5px 0px 15px;
        }

        .socialSectionWrapper {
          padding: 10px 24px 20px;
          margin: 28px;
          border-radius: 15px;
          border: dashed 1px #ffffff;

          .title {
            font-size: 16px;
            font-weight: 600;
            padding-bottom: 15px;
          }

          .socialImg {
            margin: 5px 0px;
          }

          .backgroundSocial {
            grid-template-columns: 0.3fr 1.1fr 0.8fr;
            align-items: center;
            display: grid;
            border-radius: 5px;
            margin: 0% 0 5%;
            padding: 0% 4%;
            color: #fff !important;
            grid-column-gap: 3%;

            .joinText {
              font-size: 18px;
              font-weight: bold;

              span {
                font-size: 13px;
                font-weight: 500;
              }
            }

            .parentText {
              font-size: 14px;
              text-align: left;
              font-weight: 500;
            }
          }

          .instaBtn {
            .backgroundSocial {
              background-image: linear-gradient(81deg, #ffdd55 7%, #ff543e 50%, #c837ab 94%);
            }
          }

          .fbBtn {
            .backgroundSocial {
              background-color: #3b5998;
            }
          }
        }

        .signupBtn {
          display: block;
          width: 100%;
          height: 44px;
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          background: #f888b0;
          border: none;
          cursor: pointer;
          border-radius: 3px;
          margin: 15px auto 0;
          outline: none;
        }

        .downloadSectionWrapper {
          color: #000;
          margin: 15px 0 24px;
          padding: 9px 0 16px;
          border-radius: 15px;
          margin: 0px 28px;
          background-color: #ffffff;

          .downloadSection {
            display: flex;
            justify-content: space-evenly;
            align-items: center;

            .block {
              text-align: center;
              display: grid;
              grid-template-columns: 0.6fr 0.8fr 1fr;
              align-items: center;
              color: #e45867;
              grid-column-gap: 3%;
              padding: 0px 5%;

              .countText {
                font-size: 26px;
                font-weight: bold;

                span {
                  font-size: 20px;
                }
              }

              .parentText {
                font-size: 12px;
                font-weight: 700;
                text-align: left;
              }

              img {
                width: 100%;
                padding: 5px;
              }
            }
          }

          .socialImgsWrapper {
            margin: 16px 0 0;

            .socialImg {
              border-radius: 4px;
              display: inline-block;
            }

            .appStoreBtn {
              margin: 0 0 0 12px;
            }
          }

          .downloadSectioBottom {
            border-top: solid 1px #eee;
            padding: 10px 0 0;
            .appRatingsBlock {
              .countText {
                font-size: 14px;
                color: #000;
                span {
                  font-size: 25px;
                  font-weight: bold;
                }
              }
            }
          }
        }

        .secondBlock {
          background: #373737;
        }

        .contentWrapper {
          text-align: left;

          .contentSection {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-column-gap: 26px;
            padding: 25px 028px;

            p {
              min-height: 55px;
              font-weight: 500;
            }

            .serviceName {
              font-size: 12px;
              line-height: 2.17;
              color: #bdbdbd;
              display: block;
            }
          }
        }

        .addressWrapper {
          text-align: left;
          padding: 28px 28px;

          .companyName {
            font-size: 16px;
            line-height: 1.63;
            margin: 23px 0px 5px 0px;
          }

          .addressText {
            font-size: 13px;
            color: #bdbdbd;
            margin-bottom: 1em;
          }

          .title {
            font-weight: 500;
            margin-bottom: 7px;
          }

          .phoneEmail {
            img {
              width: 18px;
              margin-right: 8px;
            }
          }
        }

        .callNowWrapper {
          color: #fff;
        }

        .title {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          text-transform: uppercase;
          color: #fff;
        }
      }

      @media (min-width: 769px) {
        footer {
          padding: 18px 0 0 0;
        }
        .desktopOuterWrapper {
          padding: 0% 15% 3%;

          .footerTitle {
            max-width: 50%;
            text-align: center;
          }

          .socialSectionWrapper {
            margin: 0px;
            padding: 50px 15% 20px;
          }

          .downloadSectionWrapper {
            margin: 0px;

            .downloadSection {
              .block {
                padding: 0 17% !important;
              }
            }
          }
        }

        .desktopWrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-column-gap: 8%;
        }

        .signupBtn {
          max-width: 308px;
        }

        .secondBlock {
          padding: 4% 15%;

          .contentWrapper {
            display: flex;
            padding-bottom: 30px;

            .contentSection {
              padding: 0px;
              grid-column-gap: 30px;
              margin-left: 30px;
              .contentWrap {
                margin: 0px 5px 0px 0;

                a {
                  display: block;
                }

                // min-width:120px;
              }
            }
          }
        }

        .desktopDivider {
          display: none;
        }

        .addressWrapper {
          display: flex;

          .rightMargin {
            margin-right: 5%;
          }
        }
      }
    `}
  </style>
);
