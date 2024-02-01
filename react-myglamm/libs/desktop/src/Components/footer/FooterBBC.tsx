import React, { Fragment } from "react";

import Link from "next/link";

import { ValtioStore } from "@typesLib/ValtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import { FooterStyleBBC } from "../../styles/footerStyleBBC";

const Footer = () => {
  const { footer } = useSelector((store: ValtioStore) => store.navReducer);

  return (
    <Fragment>
      {FooterStyleBBC}

      <div className="footer" id="bbc-footer">
        <div className="desktopOuterWrapper">
          <div className="footerTitle">Join BabyChakra Community</div>
          <div className="desktopWrap">
            <div className="downloadSectionWrapper">
              <div className="downloadSection">
                <div className="block">
                  <div
                    style={{ backgroundColor: "#e45867" }}
                    className="h-10 w-10 flex justify-center items-center rounded-full"
                  >
                    <img src="https://files.babychakra.com/site-images/original/icons8-google-pixel-6-48.png" alt="bbImage" />
                  </div>
                  <div className="countText">
                    2.25<span>M </span>
                  </div>
                  <div className="parentText"> Parents on BabyChakra</div>
                </div>
              </div>
              <div className="downloadSection downloadSectioBottom">
                <div className="blockWrapper downloadAppWrapper">
                  <div className="appRatingsBlock">
                    <div className="countText">
                      Rating<span> 4.6 </span>
                      <div className="flex justify-center">
                        <svg width="15px" height="15px" viewBox="0 0 54 55" version="1.1" className="custom-star">
                          <title>star</title>
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g
                              id="Guest-BBC-homepage-assets"
                              transform="translate(-2524.000000, -2257.000000)"
                              fill="#FFD142"
                              fillRule="nonzero"
                            >
                              <g id="star" transform="translate(2524.000000, 2257.000000)">
                                <path
                                  d="M28.9268081,3.57423317 L34.6716722,15.5577653 C35.0711671,16.3912311 35.8435947,16.9687508 36.7371458,17.1021928 L49.583669,19.0239768 C51.8340153,19.3608633 52.7318163,22.2068975 51.1040871,23.8399217 L41.8083934,33.1677386 C41.1624017,33.8163544 40.8670305,34.7515425 41.0200285,35.6670423 L43.214063,48.8384273 C43.598683,51.1452245 41.2463381,52.9040342 39.2339888,51.815716 L27.7442607,45.597536 C26.9452709,45.16549 25.9900956,45.16549 25.1911059,45.597536 L13.7013777,51.815716 C11.6890285,52.905128 9.33668355,51.1452245 9.72130363,48.8384273 L11.9153381,35.6670423 C12.0683361,34.7515425 11.7729649,33.8163544 11.1269732,33.1677386 L1.8312795,23.8399217 C0.203550305,22.2058037 1.10135133,19.3597695 3.35169756,19.0239768 L16.1982208,17.1021928 C17.0917719,16.9687508 17.8641995,16.3912311 18.2636944,15.5577653 L24.0085585,3.57423317 C25.0136706,1.47525561 27.9206335,1.47525561 28.9268081,3.57423317 Z"
                                  id="Path-Copy-3"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <svg width="15px" height="15px" viewBox="0 0 54 55" version="1.1" className="custom-star">
                          <title>star</title>
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g
                              id="Guest-BBC-homepage-assets"
                              transform="translate(-2524.000000, -2257.000000)"
                              fill="#FFD142"
                              fillRule="nonzero"
                            >
                              <g id="star" transform="translate(2524.000000, 2257.000000)">
                                <path
                                  d="M28.9268081,3.57423317 L34.6716722,15.5577653 C35.0711671,16.3912311 35.8435947,16.9687508 36.7371458,17.1021928 L49.583669,19.0239768 C51.8340153,19.3608633 52.7318163,22.2068975 51.1040871,23.8399217 L41.8083934,33.1677386 C41.1624017,33.8163544 40.8670305,34.7515425 41.0200285,35.6670423 L43.214063,48.8384273 C43.598683,51.1452245 41.2463381,52.9040342 39.2339888,51.815716 L27.7442607,45.597536 C26.9452709,45.16549 25.9900956,45.16549 25.1911059,45.597536 L13.7013777,51.815716 C11.6890285,52.905128 9.33668355,51.1452245 9.72130363,48.8384273 L11.9153381,35.6670423 C12.0683361,34.7515425 11.7729649,33.8163544 11.1269732,33.1677386 L1.8312795,23.8399217 C0.203550305,22.2058037 1.10135133,19.3597695 3.35169756,19.0239768 L16.1982208,17.1021928 C17.0917719,16.9687508 17.8641995,16.3912311 18.2636944,15.5577653 L24.0085585,3.57423317 C25.0136706,1.47525561 27.9206335,1.47525561 28.9268081,3.57423317 Z"
                                  id="Path-Copy-3"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <svg width="15px" height="15px" viewBox="0 0 54 55" version="1.1" className="custom-star">
                          <title>star</title>
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g
                              id="Guest-BBC-homepage-assets"
                              transform="translate(-2524.000000, -2257.000000)"
                              fill="#FFD142"
                              fillRule="nonzero"
                            >
                              <g id="star" transform="translate(2524.000000, 2257.000000)">
                                <path
                                  d="M28.9268081,3.57423317 L34.6716722,15.5577653 C35.0711671,16.3912311 35.8435947,16.9687508 36.7371458,17.1021928 L49.583669,19.0239768 C51.8340153,19.3608633 52.7318163,22.2068975 51.1040871,23.8399217 L41.8083934,33.1677386 C41.1624017,33.8163544 40.8670305,34.7515425 41.0200285,35.6670423 L43.214063,48.8384273 C43.598683,51.1452245 41.2463381,52.9040342 39.2339888,51.815716 L27.7442607,45.597536 C26.9452709,45.16549 25.9900956,45.16549 25.1911059,45.597536 L13.7013777,51.815716 C11.6890285,52.905128 9.33668355,51.1452245 9.72130363,48.8384273 L11.9153381,35.6670423 C12.0683361,34.7515425 11.7729649,33.8163544 11.1269732,33.1677386 L1.8312795,23.8399217 C0.203550305,22.2058037 1.10135133,19.3597695 3.35169756,19.0239768 L16.1982208,17.1021928 C17.0917719,16.9687508 17.8641995,16.3912311 18.2636944,15.5577653 L24.0085585,3.57423317 C25.0136706,1.47525561 27.9206335,1.47525561 28.9268081,3.57423317 Z"
                                  id="Path-Copy-3"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <svg width="15px" height="15px" viewBox="0 0 54 55" version="1.1" className="custom-star">
                          <title>star</title>
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g
                              id="Guest-BBC-homepage-assets"
                              transform="translate(-2524.000000, -2257.000000)"
                              fill="#FFD142"
                              fillRule="nonzero"
                            >
                              <g id="star" transform="translate(2524.000000, 2257.000000)">
                                <path
                                  d="M28.9268081,3.57423317 L34.6716722,15.5577653 C35.0711671,16.3912311 35.8435947,16.9687508 36.7371458,17.1021928 L49.583669,19.0239768 C51.8340153,19.3608633 52.7318163,22.2068975 51.1040871,23.8399217 L41.8083934,33.1677386 C41.1624017,33.8163544 40.8670305,34.7515425 41.0200285,35.6670423 L43.214063,48.8384273 C43.598683,51.1452245 41.2463381,52.9040342 39.2339888,51.815716 L27.7442607,45.597536 C26.9452709,45.16549 25.9900956,45.16549 25.1911059,45.597536 L13.7013777,51.815716 C11.6890285,52.905128 9.33668355,51.1452245 9.72130363,48.8384273 L11.9153381,35.6670423 C12.0683361,34.7515425 11.7729649,33.8163544 11.1269732,33.1677386 L1.8312795,23.8399217 C0.203550305,22.2058037 1.10135133,19.3597695 3.35169756,19.0239768 L16.1982208,17.1021928 C17.0917719,16.9687508 17.8641995,16.3912311 18.2636944,15.5577653 L24.0085585,3.57423317 C25.0136706,1.47525561 27.9206335,1.47525561 28.9268081,3.57423317 Z"
                                  id="Path-Copy-3"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                        <svg width="15px" height="15px" viewBox="0 0 54 55" version="1.1">
                          <title>half-star</title>
                          <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                            <g id="Guest-BBC-homepage-assets" transform="translate(-2673.000000, -2262.000000)">
                              <g id="star" transform="translate(2524.000000, 2257.000000)">
                                <path
                                  d="M178.111442,8.66802034 L183.856306,20.6515525 C184.255801,21.4850183 185.028229,22.0625379 185.92178,22.19598 L198.768303,24.117764 C201.018649,24.4546505 201.91645,27.3006847 200.288721,28.9337089 L190.993027,38.2615258 C190.347036,38.9101416 190.051664,39.8453296 190.204663,40.7608295 L192.398697,53.9322145 C192.783317,56.2390116 190.430972,57.9978214 188.418623,56.9095031 L176.928895,50.6913231 C176.129905,50.2592772 175.17473,50.2592772 174.37574,50.6913231 L162.886012,56.9095031 C160.873662,57.9989152 158.521318,56.2390116 158.905938,53.9322145 L161.099972,40.7608295 C161.25297,39.8453296 160.957599,38.9101416 160.311607,38.2615258 L151.015914,28.9337089 C149.388184,27.2995909 150.285985,24.4535567 152.536332,24.117764 L165.382855,22.19598 C166.276406,22.0625379 167.048834,21.4850183 167.448328,20.6515525 L173.193192,8.66802034 C174.198305,6.56904277 177.105267,6.56904277 178.111442,8.66802034 Z"
                                  id="Path-Copy-4"
                                  stroke="#FFD142"
                                  strokeWidth="1.96559998"
                                  fillRule="nonzero"
                                />
                                <path
                                  d="M150.152643,7.09378716 L150.152643,50.2236095 L162.918949,56.9095031 C163.721264,57.248787 164.31661,57.3590198 164.704989,57.2402015 C165.313181,57.0541345 166.142299,56.3172167 166.476525,56.0671994 C166.847755,55.789501 166.858347,55.4204869 166.899023,54.9258795 C166.919706,54.6743866 166.919706,54.2283443 166.899023,53.5877527 C166.548931,51.3653433 166.24122,49.4785426 165.97589,47.9273507 C165.71056,46.3761589 165.286926,43.9873184 164.704989,40.7608295 C164.704989,39.7884726 164.967777,38.9553714 165.493353,38.2615258 C166.01893,37.5676802 166.666489,36.9212221 167.436031,36.3221514 L174.789047,28.9337089 C175.521448,27.965789 175.798541,27.1995811 175.620327,26.6350853 C175.50896,26.2823313 175.373455,25.1839506 174.789047,24.7770357 C174.555185,24.6142008 174.048379,24.3944436 173.268629,24.117764 L161.796241,22.410546 C160.682913,22.368354 159.742083,22.0545845 158.973752,21.4692374 C158.518501,21.1224083 158.330624,20.5983315 157.923457,19.7727458 C157.736782,19.3942368 157.38703,18.6925502 156.8742,17.6676862 L152.507007,8.26795273 C151.959306,7.57875871 151.559663,7.18737019 151.308079,7.09378716 C151.056494,7.00020414 150.671349,7.00020414 150.152643,7.09378716 Z"
                                  id="Path-2"
                                  fill="#FFD142"
                                  transform="translate(162.912643, 32.155014) scale(-1, 1) translate(-162.912643, -32.155014) "
                                />
                              </g>
                            </g>
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <figure className="socialImgsWrapper">
                    <a href="https://babyc.in/l/YPtM" target="_blank" rel="noopener noreferrer">
                      <img
                        width={120}
                        src="https://files.babychakra.com/site-images/original/play-store.png"
                        className="socialImg"
                        alt="playstore"
                      />
                    </a>
                    <a href="https://babyc.in/l/AtPE" target="_blank" className="appStoreBtn" rel="noopener noreferrer">
                      <img
                        width={120}
                        src="https://files.babychakra.com/site-images/original/apple-store.png"
                        className="socialImg"
                        alt="appstore"
                      />
                    </a>
                  </figure>
                  <button type="button" className="signupBtn">
                    SIGN UP NOW
                  </button>
                </div>
              </div>
            </div>
            <div className="socialSectionWrapper">
              <p className="title"> Join Us </p>
              <a href="https://www.instagram.com/mybabychakra/" target="_black" className="instaBtn socialBtn">
                <div className="backgroundSocial">
                  <img
                    height="36px"
                    src="https://img.icons8.com/material-outlined/44/ffffff/instagram-new--v1.png"
                    className="socialImg"
                    alt="instagram babychakra"
                  />
                  <div className="joinText">
                    {" "}
                    JOIN 55.6<span>K </span>
                  </div>
                  <div className="parentText"> Parents on Instagram</div>
                </div>
              </a>
              <a href="https://www.facebook.com/babychakra/?fref=ts" target="_black" className="fbBtn socialBtn">
                <div className="backgroundSocial">
                  <img
                    height="36px"
                    src="https://img.icons8.com/material-outlined/44/ffffff/facebook.png"
                    className="socialImg"
                    alt="facebook babychakra"
                  />
                  <div className="joinText">
                    JOIN 680<span>K </span>
                  </div>
                  <div className="parentText"> Parents on facebook</div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="secondBlock">
          <div className="contentWrapper">
            {footer?.map((item: any) => (
              <>
                <div className="contentSection">
                  {item.map((childItem: any) => (
                    <div className="aboutContent contentWrap" key={item.label}>
                      <p className="title"> {childItem.label}</p>
                      {childItem.child.map((subChild: any) => (
                        <Link href={subChild.url} className="serviceName" key={subChild.label}>
                          {subChild.label}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="divider desktopDivider" />
              </>
            ))}
          </div>
          <div className="divider" />
          <div className="addressWrapper">
            <div className="flexBox rightMargin">
              <p className="title"> CONTACT US </p>
              <div className="">© Sanghvi Technologies Pvt. Ltd</div>
              <address className="text-sm">
                Sanghvi House, 105/2, Shivajinagar, <br />
                Pune- 411 005
                {/* 3B-48/49, Phoenix Paragon Plaza, L.B.S Marg,
                <br /> Kurla ( West ) Mumbai 400070 */}
                <br />
                CIN NO - U72200MH2014PTC253152
              </address>
            </div>
            <div className="flexBox">
              <p className="title">CONNECT WITH US</p>
              <div className="phoneEmail text-sm">
                <a href="tel:022-48914748" className="callNowWrapper flex mb-2">
                  <img src="https://img.icons8.com/fluency-systems-filled/20/ffffff/phone-disconnected.png" alt="lazyload" />
                  022-48914748
                </a>
              </div>
              <div className="phoneEmail text-sm">
                <a href="mailto:hello@babychakra.com" className="callNowWrapper flex ">
                  <img src="https://img.icons8.com/ios-glyphs/20/ffffff/new-post.png" alt="lazyload" />
                  hello@babychakra.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Footer;
