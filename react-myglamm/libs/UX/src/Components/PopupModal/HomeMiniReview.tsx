import PopupModal from "./PopupModal";
// @ts-ignore
import { ModalContainer, ButtonContianer } from "@libStyles/css/miniPDP.module.css";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Spinner from "@libComponents/Common/LoadSpinner";
import { useSelector } from "@libHooks/useValtioSelector";
import useWebp from "@libHooks/useWebPP";
import Adobe from "@libUtils/analytics/adobe";
import { GAProductReviewSubmitted } from "@libUtils/analytics/gtm";
import { getVendorCode } from "@libUtils/getAPIParams";
import { SHOP } from "@libConstants/SHOP.constant";

import { ValtioStore } from "@typesLib/ValtioStore";
import ProductAPI from "@libAPI/apis/ProductAPI";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import { showError, showSuccess } from "@libUtils/showToaster";
import { formatPrice } from "@libUtils/format/formatPrice";
import { getStaticUrl } from "@libUtils/getStaticUrl";

const ReviewStars = dynamic(() => import(/* webpackChunkName: "ReviewStars" */ "@libComponents/PDP/Reviews/ReviewStars"), {
  ssr: false,
});

const HorizontalRating = dynamic(
  () => import(/* webpackChunkName: "HorizontalRating" */ "@libComponents/PDP/Reviews/HorizontalRating"),
  {
    ssr: false,
  }
);

const HomeMiniReview = ({ t, show, onRequestClose, product, getStarRatingFromMiniRating }: any) => {
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  const { WebPImage } = useWebp();

  const [isSpinnerOn, setisSpinnerOn] = useState(false);
  const [subRatingHeaders, setSubRatingHeaders] = useState<Array<any>>([]);
  const [starSubRatingReset, setStarSubRatingReset] = useState(false);
  const [subRatingStarValue, setSubRatingStarValue] = useState<Array<any>>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [starsSelected, setSelected] = useState<any>(0);
  const [productStarRatingReset, setProductStarRatingReset] = useState(false);
  const [text, setText] = useState<string>("");
  const [uploadImageUrl, setUploadImageUrl] = useState<Array<any>>([]);
  const [selectedFile, setSelectedFile] = useState<Array<any>>([]);
  const [isFilePicked, setFilePicked] = useState(false);
  const strProductShadeName = product?.shadeLabel;
  const [productDetails, setProductDetails] = useState<any>();
  const [productAvgRating, setProductAvgRating] = useState<any>();
  const [showCommentError, setShowCommentError] = useState<boolean>(false);
  const [showSubRatingError, setSubRatingError] = useState<boolean>(false);

  const quotes = t("reviewsTitle")
    ? ["", t("reviewsTitle")[0], t("reviewsTitle")[1], t("reviewsTitle")[2], t("reviewsTitle")[3], t("reviewsTitle")[4]]
    : [""];
  let invalidRating = "";

  /**
   * Handles the main product star rating
   * @param event - return the event handlers of stars
   */
  const handleStarIcon = (starSelected: number) => {
    setSelected(starSelected);
  };

  /**
   * Check if input for all the subrating stars have been prodvided by user.
   */
  const validateSubRating = () => {
    if (subRatingStarValue.length) {
      let tempRating = subRatingStarValue.find(rating => {
        return rating.value === 0;
      });
      invalidRating = tempRating?.title || "";
      return !tempRating;
    }
    return true;
  };

  /**
   * After successful review submit, resets all the form data and closes the popup
   */
  const resetMiniReview = () => {
    setText("");
    setFilePicked(false);
    setSelectedFile([]);
    initializeSubRatingValue();
    setSelected(5);
    setProductStarRatingReset(true);
    setStarSubRatingReset(true);
    getSubRatingHeaders();
    setShowCommentError(false);
    setSubRatingError(false);
  };

  // #region // *WebEngage [18] - Product Review Submitted : Prepare Function
  const prepareWebengageSubmitReviewDataLayer = (productWebEngage: any, reviewDetails: any) => {
    const child = productWebEngage?.data[0]?.categories.filter((c: any) => c.type === "child");
    const productSubCategory = productWebEngage?.relationalData?.categories[child[0]?.id]?.cms[0]?.content?.name;
    const webengageDataLayer = {
      productCategory: productSubCategory,
      productSubCategoryName: productWebEngage?.data[0]?.productTag,
      productName: productWebEngage?.data[0]?.cms[0]?.content?.name,
      productSku: productWebEngage?.data[0]?.sku,
      starRating: reviewDetails.rating,
      userType: profile?.id ? "Member" : "Guest",
    };

    GAProductReviewSubmitted(webengageDataLayer);
  };
  // #endregion // WebEngage [18] - Product Review Submitted : Prepare Function

  const adobeSubmitReview = (productAdobe: any, relationalData: any) => {
    let ddlStockStatus = "";
    let ddlIsPreOrder = "";
    const child = productAdobe?.categories.filter((c: any) => c.type === "child");
    const productSubCategory = relationalData?.categories[child[0]?.id]?.cms[0]?.content?.name;

    const prepareDatalayer = async () => {
      ddlStockStatus = productAdobe.inStock ? `in stock` : `out of stock`;
      ddlIsPreOrder = productAdobe.productMeta.isPreOrder ? `yes` : `no`;
    };
    prepareDatalayer();
    (window as any).digitalData = {
      common: {
        linkName: `web|${productSubCategory} - ${productAdobe.productTag}|product description page|submit review`,
        linkPageName: `web|${productAdobe.productTag}|product description page`,
        newLinkPageName: `${productAdobe.productTag}|product description page`,
        assetType: "product",
        newAssetType: "product",
        subSection: `${productSubCategory} - ${productAdobe.productTag}`,
        platform: "mobile website",
        ctaName: "submit review",
      },
      user: Adobe.getUserDetails(profile),
      product: [
        {
          productSKU: productAdobe.sku,
          productQuantity: 1,
          productOfferPrice: formatPrice(productAdobe.offerPrice),
          productPrice: formatPrice(productAdobe.price),
          productDiscountedPrice: formatPrice(productAdobe.price - productAdobe.offerPrice),
          productRating: productAvgRating?.avgRating || "",
          productTotalRating: productAvgRating?.totalCount || "",
          stockStatus: `${ddlStockStatus}`,
          isPreOrder: `${ddlIsPreOrder}`,
          PWP: "",
          hasTryOn: "no",
          starCount: starsSelected,
        },
      ],
    };
    Adobe.Click();
  };

  /**
   * Function to submit review and subreviews data.
   */
  const onSubmitReview = () => {
    setShowCommentError(false);
    setSubRatingError(false);
    if (profile) {
      if (validateSubRating() && text?.trim() !== "") {
        let subRating = {};
        if (subRatingStarValue) {
          subRating = subRatingStarValue.reduce((obj, item) => Object.assign(obj, { [item.title]: parseInt(item.value) }), {});
        }
        setIsSubmittingReview(true);
        const payload = {
          reviewContent: text,
          reviewerId: profile?.id,
          reviewTitle: quotes[starsSelected],
          reviewerInfo: {
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            email: profile?.email,
            mobile: profile?.phoneNumber,
            additional: {
              sku: product?.sku || "",
            },
          },
          itemId: product?.productId,
          itemType: "product",
          rating: parseInt(starsSelected, 10),
          subRating,
          meta: {
            productName: product?.name,
            images: uploadImageUrl || [],
          },
          userAgent: window.navigator.userAgent,
          vendorCode: getVendorCode(),
        };
        const api = new ProductAPI();
        api
          .createReviews(payload)
          .then(() => {
            adobeSubmitReview(productDetails?.data[0], productDetails?.relationalData);
            prepareWebengageSubmitReviewDataLayer(productDetails, payload);
            setIsSubmittingReview(false);
            showSuccess("Review submitted successfully");
            getStarRatingFromMiniRating(product, parseInt(starsSelected, 10));
            resetMiniReview();
            getStarRatingFromMiniRating();
            onRequestClose();
          })
          .catch((error: any) => {
            setIsSubmittingReview(false);
            alert(error);
          })
          .finally(() => {
            setProductStarRatingReset(false);
            setStarSubRatingReset(false);
            setShowCommentError(false);
            setSubRatingError(false);
          });
      } else {
        text?.trim() === "" ? setShowCommentError(true) : setSubRatingError(true);
      }
    }
  };

  /**
   * A Genric error toasts
   * @param msg - expects the msg paramter which shows the error
   * @returns - returns the <html> oject
   */
  const ToastError = ({ msg }: any) => {
    return (
      <div className="inline-flex items-center justify-center w-full">
        <div className="bg-red-600 mr-2" style={{ borderRadius: "30px", padding: "5px 11px 2px 9px" }}>
          X
        </div>
        <div className="w-full">{msg}</div>
      </div>
    );
  };

  /**
   * function loops through files and return collection to save in state
   */
  const attachBlob = (files: any) =>
    files.map((s: any) => {
      if (!s.imageSrc) {
        const imgSrc = URL.createObjectURL(s);
        s.imageSrc = imgSrc;
      }
      return s;
    });

  /**
   * Upload Image Button event handler
   * @param event
   */
  const changeHandler = (event: any) => {
    if (profile) {
      if (selectedFile.length < 3) {
        setisSpinnerOn(true);
        setSelectedFile(attachBlob([...selectedFile, ...event.target.files]));
        setFilePicked(true);
        const formData = new FormData();
        const uploadFileList = [...event.target.files];
        const imageUrls: any[] = [];
        if (Array.isArray(uploadFileList) && uploadFileList.length > 0) {
          uploadFileList.forEach((file: any, index: number) => {
            formData.append(`my_file`, file);
          });
        }
        const api = new ProductAPI();
        api
          .uploadImage(formData)
          .then((res: any) => {
            if (res?.data) {
              res.data.forEach((image: any) => {
                imageUrls.push(image.original);
              });
              setUploadImageUrl([...uploadImageUrl, ...imageUrls]);
              setisSpinnerOn(false);
            }
          })
          .catch((error: any) => {
            setisSpinnerOn(false);
          });
      } else {
        showError(t("pdpMaxImageSelMsg") || `You are reached to max limit for image selection`);
      }
    }
  };

  /**
   * This function will initalize all the subrating values to 0 and save this array in state.
   * later this array is altered and re-set to state.
   */
  const initializeSubRatingValue = () => {
    let arr: any = [];
    if (subRatingHeaders.length > 0) {
      subRatingHeaders.map((rating: any) => {
        let temp = { title: rating, value: 0 };
        arr.push(temp);
      });
    }
    setSubRatingStarValue(arr);
  };

  /**
   * this function handles the subrating stars for multiple keys.
   * @param key
   * @param value
   */
  const handleSubRatingStarIcon = (key: any, value: any) => {
    const elementsIndex = subRatingStarValue.findIndex(element => element.title == key);
    let newArray = [...subRatingStarValue];
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      value,
    };
    setSubRatingStarValue(newArray);
  };

  /**
   * API call for getting arrList of subrating headers, by which is used to
   * initalized sub rating value
   */
  async function getSubRatingHeaders() {
    if (profile && product?.productId) {
      const api = new ProductAPI();
      await api.getsubRatings(product.productId).then(res => {
        setSubRatingHeaders(res?.data?.data[0]?.subRatings || []);
      });
    }
  }

  async function getProductDetails() {
    if (product?.productId) {
      const where = {
        id: product?.productId,
      };
      const api = new ProductAPI();
      await api.getProduct(where, 0).then((res: any) => {
        setProductDetails(res.data.data);
      });
      await api.getavgRatings(product?.productId, "product").then((res: any) => {
        setProductAvgRating(res.data.data);
      });
    }
  }

  useEffect(() => {
    resetMiniReview();
    if (Object.keys(product).length > 0) {
      getProductDetails();
    }
  }, [product]);

  useEffect(() => {
    initializeSubRatingValue();
  }, [subRatingHeaders]);

  return (
    <PopupModal show={show} onRequestClose={onRequestClose}>
      <section>
        <div className="inline-flex w-full shadow-md mb-2 items-center">
          <div className="w-auto p-2">
            <img src="./svg/group-2.svg" onClick={onRequestClose} className="w-[30px]" />
          </div>
          <div className="w-full py-2 font-bold text-lg ml-4">Review this product</div>
        </div>
        <section className={ModalContainer} style={{ padding: "0px 6px" }}>
          {/* <container> */}
          <div className="px-2 mb-5">
            {/* <Image | Name & Stars> */}
            <div className="inline-flex w-full items-start">
              <div className="w-4/12 p-2">
                {/* <WebPImage
                  width={300}
                  height={300}
                  className="rounded"
                  src={product.imageUrl}
                  alt={product.name}
                /> */}
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="w-8/12 px-2 grid">
                <div className="font-bold w-full text-base">{product.name}</div>
                <div className="font-bold w-full mt-1 text-sm text-gray-400 uppercase">{strProductShadeName}</div>

                <div className="font-bold w-full mt-2 text-sm">You Rated</div>
                <div className="w-full ">
                  <ReviewStars
                    getSelectedStars={handleStarIcon}
                    preSelectedStart={starsSelected}
                    size={"2rem"}
                    reset={productStarRatingReset}
                    resetValue={5}
                  />
                </div>
              </div>
            </div>
            {/* </Image | Name & Stars> */}

            {/* <CommentBox> */}
            <div>
              <p className="mt-4 mb-2 text-left font-semibold text-xl">Leave a comment</p>
              <div>
                <textarea
                  rows={3}
                  placeholder={`Write something about your experience`}
                  className="review border w-full px-2 py-1 border-color1 outline-none placeholder-gray-500 text-sm"
                  onChange={(event: any) => setText(event?.target.value)}
                  value={text}
                />
                {showCommentError && (
                  <div className="text-xs mb-4" style={{ color: "#e66060" }}>
                    ! Please write product review
                  </div>
                )}
              </div>
            </div>
            {/* </CommentBox> */}

            {/* <Upload Image Component> */}
            <div>
              <div className="px-1 mt-3 rounded flex items-center" style={{ background: "#ffecec" }}>
                <div className="mb-3 mt-3 mr-1" style={{ minWidth: "150px", maxWidth: "150px" }}>
                  <input
                    id="upload"
                    type="file"
                    name="file"
                    onChange={changeHandler}
                    accept="image/*"
                    //multiple
                    hidden
                    disabled={isSpinnerOn}
                  />
                  <label
                    htmlFor="upload"
                    className="px-4 py-2 border border-color1 font-semibold capitalize rounded text-red-300 bg-white"
                  >
                    <>
                      {isSpinnerOn ? (
                        <>
                          <Spinner className="w-5 mx-auto inline-flex mr-2 relative mb-1" />
                          <span className="text-xs relative mt-1">{t("uploading") || `Uploading ...`}</span>
                        </>
                      ) : (
                        <>
                          <img alt="upload" src={getStaticUrl("/svg/upload.svg")} className="inline-flex w-4 mr-3" />
                          <span className="text-xs font-semibold relative mt-1">{t("uploadImage") || `Upload Image`}</span>
                        </>
                      )}
                    </>
                  </label>
                </div>

                {SHOP.ENABLE_GLAMMPOINTS && (
                  <div className="mb-3 mt-3 w-3/5" style={{ lineHeight: "18px" }}>
                    <p className="inline text-xs">Upload image with this product & earn extra 5</p>
                    <GoodPointsCoinIcon className="mx-1 inline h-4 w-4" />
                    <p className="inline text-xs">{t("myglammPoints")}</p>
                  </div>
                )}
              </div>
            </div>
            {isFilePicked && Array.isArray(selectedFile) ? (
              <>
                <div className="overflow-y-scroll">
                  <ul className="mt-2.5 inline-flex">
                    {selectedFile.map((file: any, index: number) => {
                      const imgSrc = file.imageSrc;
                      return (
                        <li key={imgSrc} className="inline-block mr-2.5 relative">
                          <div className="flex items-center justify-center w-24 h-24">
                            <img
                              src={imgSrc}
                              alt="reviewImg"
                              className={`rounded w-24 h-24 object-cover ${
                                index === selectedFile.length - 1 && isSpinnerOn ? "opacity-70" : ""
                              }`}
                            />
                          </div>
                          {index === selectedFile.length - 1 && isSpinnerOn ? (
                            <Spinner className="w-6 mx-auto inline-flex absolute inset-0 m-auto" />
                          ) : (
                            <img
                              alt="Remove Icon"
                              role="presentation"
                              src={getStaticUrl("/svg/remove.svg")}
                              className="mx-auto w-6 opacity-50 -top-2.5 -right-2.5 absolute"
                              onClick={() => {
                                setSelectedFile([...selectedFile.slice(0, index), ...selectedFile.slice(index + 1)]);
                                setUploadImageUrl([...uploadImageUrl.slice(0, index), ...uploadImageUrl.slice(index + 1)]);
                              }}
                            />
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </>
            ) : (
              <p className="hidden">Select a file to show details</p>
            )}
            {/* </Upload Image Component> */}

            {/* <HorizontalComment> */}
            {subRatingHeaders.length > 0 && (
              <div className="mt-8">
                <div>
                  <p className="mt-4 text-left font-semibold text-xl">Tell us what you think</p>
                </div>
                {subRatingHeaders.map((subRating: any, index: number) => {
                  return (
                    <HorizontalRating
                      key={index}
                      t={t}
                      title={subRating}
                      handleSubRatingStarIcon={handleSubRatingStarIcon}
                      reset={starSubRatingReset}
                    />
                  );
                })}
                {showSubRatingError && (
                  <div className="text-xs mt-2" style={{ color: "#e66060" }}>
                    ! Please select star rating
                  </div>
                )}
              </div>
            )}
            {/* </HorizontalComment> */}
          </div>
        </section>
        {/* </container> */}
        {/* <Submit Button> */}
        <div className={`flex justify-between bg-white px-3 py-2 relative ${ButtonContianer}`}>
          <button
            type="button"
            onClick={onSubmitReview}
            disabled={isSpinnerOn || isSubmittingReview}
            className="px-4 py-2 text-white font-semibold uppercase w-full bg-ctaImg rounded-sm outline-none"
          >
            <span className="text-sm">{t("pdpCTASubmitReview") || `Submit Review`}</span>
            {isSubmittingReview && <Spinner className="absolute w-6 mx-auto inline-flex" />}
          </button>
        </div>
        {/* </Submit Button> */}
      </section>
    </PopupModal>
  );
};

export default HomeMiniReview;
