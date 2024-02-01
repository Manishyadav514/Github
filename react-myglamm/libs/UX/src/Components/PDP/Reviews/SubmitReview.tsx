import React, { useEffect, useState } from "react";
import useTranslation from "@libHooks/useTranslation";
import { ADOBE } from "@libConstants/Analytics.constant";
import { useSelector } from "@libHooks/useValtioSelector";
import Adobe from "@libUtils/analytics/adobe";
import { GAProductReviewSubmitted } from "@libUtils/analytics/gtm";
import dynamic from "next/dynamic";
import { SHOP } from "@libConstants/SHOP.constant";
import Spinner from "@libComponents/Common/LoadSpinner";

import { getVendorCode } from "@libUtils/getAPIParams";

import { ValtioStore } from "@typesLib/ValtioStore";

const HorizontalRating = dynamic(
  () => import(/* webpackChunkName: "HorizontalRating" */ "@libComponents/PDP/Reviews/HorizontalRating"),
  {
    ssr: false,
  }
);

import ReviewStars from "./ReviewStars";
import ProductAPI from "@libAPI/apis/ProductAPI";
import GoodPointsCoinIcon from "@libComponents/Common/GoodPointsCoinIcon";
import { showSuccess } from "@libUtils/showToaster";
import { formatPrice } from "@libUtils/format/formatPrice";
import Image from "next/legacy/image";
import PopupModal from "@libComponents/PopupModal/PopupModal";
import { PDP_STATES } from "@libStore/valtio/PDP.store";
import { PDPProd } from "@typesLib/PDP";
import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";
import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import { getLocalStorageValue } from "@libUtils/localStorage";
import { LOCALSTORAGE } from "@libConstants/Storage.constant";

interface ReviewModalProps {
  product: PDPProd;
  reviewFormModal: boolean;
  hideReviewFormModal?: () => void;
}

const SubmitReview = ({ product, reviewFormModal, hideReviewFormModal }: ReviewModalProps) => {
  const { categories, ratings } = product;

  const [subRatingHeaders, setSubRatingHeaders] = useState<Array<any>>([]);
  const [hasSubmit, setSubmit] = useState<boolean>(false);
  const [starsSelected, setSelected] = useState<any>(5);
  const [btnDisable, setDisable] = useState<boolean>(true);
  const [text, setText] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<Array<any>>([]);
  const [isFilePicked, setFilePicked] = useState(false);
  const [uploadImageUrl, setUploadImageUrl] = useState<Array<any>>([]);
  const [isSpinnerOn, setisSpinnerOn] = useState(false);
  const [isVideoSpinnerOn, setisVideoSpinnerOn] = useState(false);
  const [isImageSpinnerOn, setisImageSpinnerOn] = useState(false);
  const [videoLimit, setVideoLimit] = useState<number>(0);
  // const [imageLimit, setImageLimit] = useState<number>(0);
  const [mediaLimit, setMediaLimit] = useState<number>(0);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [productStarRatingReset, setProductStarRatingReset] = useState(false);
  const [starSubRatingReset, setStarSubRatingReset] = useState(false);
  const [subRatingStarValue, setSubRatingStarValue] = useState<Array<any>>([]);
  const [showCommentError, setShowCommentError] = useState<boolean>(false);
  const [showSubRatingError, setSubRatingError] = useState<boolean>(false);
  // const [showReviewFo,setShowReviewForm] = useState<boolean>(showReview)

  let invalidRating = "";

  const { t } = useTranslation();
  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);
  // const quotes = t("reviewsTitle")
  //   ? ["", t("reviewsTitle")[0], t("reviewsTitle")[1], t("reviewsTitle")[2], t("reviewsTitle")[3], t("reviewsTitle")[4]]
  //   : [""];


  const handleStarIcon = (starSelected: number) => {
    setSelected(starSelected);
    setDisable(false);
  };

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

  const onSubmitReview = () => {
    setShowCommentError(false);
    setSubRatingError(false);
    if (checkUserLoginStatus()) {
      let localProfile: any = {};
      if (!profile?.id) {
        localProfile = getLocalStorageValue(LOCALSTORAGE?.PROFILE, true);
      }
      if (validateSubRating() && text?.trim() !== "" && title?.trim() !== "") {
        let subRating = {};
        if (subRatingStarValue) {
          subRating = subRatingStarValue.reduce((obj, item) => Object.assign(obj, { [item.title]: parseInt(item.value) }), {});
        }
        setIsSubmittingReview(true);
        const payload = {
          reviewContent: text,
          reviewerId: profile?.id || localProfile?.id,
          reviewTitle: title,
          reviewerInfo: {
            firstName: profile?.firstName || localProfile?.firstName,
            lastName: profile?.lastName || localProfile?.lastName,
            email: profile?.email || localProfile?.email,
            mobile: profile?.phoneNumber || localProfile?.phoneNumber,
            additional: {
              sku: product.sku,
            },
          },
          itemId: product?.id,
          itemType: product?.urlShortner?.type,
          rating: parseInt(starsSelected, 10),
          subRating,
          meta: {
            productName: product?.cms[0]?.content?.name,
            images: uploadImageUrl || [],
          },
          userAgent: window.navigator.userAgent,
          vendorCode: getVendorCode(),
        };
        const api = new ProductAPI();
        api
          .createReviews(payload)
          .then(() => {
            setSubmit(true);
            adobeSubmitReview(product);
            prepareWebengageSubmitReviewDataLayer(product, payload);
            setIsSubmittingReview(false);
            showSuccess("Review submitted successfully");
            setText("");
            setTitle("");
            setFilePicked(false);
            setSelectedFile([]);
            getSubRatingHeaders();
            setSelected(5);
            setProductStarRatingReset(true);
            setStarSubRatingReset(true);
            hideModal();
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
        text?.trim() === "" || title?.trim() === "" ? setShowCommentError(true) : setSubRatingError(true);
      }
    } else {
      SHOW_LOGIN_MODAL({ type: "onlyMobile", show: true, onSuccess: onSubmitReview });
    }
  };

  const ToastError = ({ invalidRatingFor }: any) => (
    <div className="inline-flex items-center justify-center w-full">
      <div className="bg-red-600 mr-2" style={{ borderRadius: "30px", padding: "5px 11px 2px 9px" }}>
        X
      </div>
      <div className="w-full">{text?.trim() === "" ? "Please write a comment." : `Please select all star ratings.`}</div>
    </div>
  );

  const attachBlob = (files: any) =>
    files.map((s: any) => {
      if (!s.imageSrc) {
        const imgSrc = URL.createObjectURL(s);
        s.imageSrc = imgSrc;
      }
      return s;
    });

  const changeHandler = (event: any) => {
    let duplicate = false;
    const fileType = event?.target?.files[0]?.type?.slice(0, 5);
    selectedFile?.map((val: any) => {
      if (val.name === event.target.files[0].name) {
        duplicate = true;
      }
    });

    if (checkUserLoginStatus()) {
      if (!duplicate) {
        setisSpinnerOn(true);
        if (fileType === "image") {
          setisImageSpinnerOn(true);
        } else if (fileType === "video") {
          setisVideoSpinnerOn(true);
        }

        setSelectedFile(attachBlob([...selectedFile, ...event.target.files]));
        setFilePicked(true);

        // const formData = new FormData();
        const imageFormData = new FormData();
        const videoFormData = new FormData();
        const uploadFileList = [...event.target.files];
        const imageUrls: any[] = [];

        if (Array.isArray(uploadFileList) && uploadFileList.length > 0) {
          setMediaLimit(mediaLimit + 1);
          setVideoLimit(fileType === "video" ? videoLimit + 1 : videoLimit + 0);
          uploadFileList.forEach((file: any, index: number) => {
            if (file.type.match("image")) {
              imageFormData.append(`my_file`, file);
            } else {
              videoFormData.append(`my_file`, file);
            }
            // formData.append(`my_file`, file);
          });
        }

        const api = new ProductAPI();
        if (fileType === "image") {
          api
            .uploadImage(imageFormData)
            .then((res: any) => {
              if (res?.data) {
                res.data.forEach((image: any) => {
                  imageUrls.push(image.original);
                });
                setUploadImageUrl([...uploadImageUrl, ...imageUrls]);
                setisSpinnerOn(false);
                setisImageSpinnerOn(false);
              }
            })
            .catch((error: any) => {
              setisSpinnerOn(false);
              setisImageSpinnerOn(false);
            });
        } else {
          api
            .uploadVideo(videoFormData)
            .then((res: any) => {
              if (res?.data) {
                res.data.forEach((image: any) => {
                  imageUrls.push(image.original);
                });
                setUploadImageUrl([...uploadImageUrl, ...imageUrls]);
                setisSpinnerOn(false);
                setisVideoSpinnerOn(false);
              }
            })
            .catch((error: any) => {
              setisSpinnerOn(false);
              setisVideoSpinnerOn(false);
            });
        }
      } else {
        alert("File already exist");
      }
      event.target.value = "";
    } else {
      SHOW_LOGIN_MODAL({
        type: "onlyMobile",
        show: true,
        onSuccess: () =>
          setTimeout(() => {
            changeHandler(event);
          }, 200),
      });
    }
  };

  // Adobe Analytics(132) - On Click - PDP - Submit Review
  const adobeSubmitReview = (productAdobe: any) => {
    let ddlStockStatus = "";
    let ddlIsPreOrder = "";
    const prepareDatalayer = async () => {
      ddlStockStatus = productAdobe.inStock ? `in stock` : `out of stock`;
      ddlIsPreOrder = productAdobe.productMeta.isPreOrder ? `yes` : `no`;
    };
    prepareDatalayer();

    (window as any).digitalData = {
      common: {
        linkName: `web|${categories.childCategoryName} - ${productAdobe.productTag}|product description page|submit review`,
        linkPageName: `web|${productAdobe.productTag}|product description page`,
        newLinkPageName: `${product.productTag}|product description page`,
        assetType: "product",
        newAssetType: "product",
        subSection: `${categories.childCategoryName} - ${productAdobe.productTag}`,
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
          productRating: ratings?.avgRating || "",
          productTotalRating: ratings?.totalCount || "",
          stockStatus: `${ddlStockStatus}`,
          isPreOrder: `${ddlIsPreOrder}`,
          PWP: "",
          hasTryOn: "no",
          starCount: "",
        },
      ],
    };
    Adobe.Click();
  };

  // #region // *WebEngage [18] - Product Review Submitted : Prepare Function
  const prepareWebengageSubmitReviewDataLayer = (productWebEngage: any, reviewDetails: any) => {
    const webengageDataLayer = {
      productCategory: categories.subChildCategoryName,
      productSubCategoryName: productWebEngage.productTag,
      productName: productWebEngage?.cms[0]?.content?.name,
      productSku: productWebEngage.sku,
      starRating: reviewDetails.rating,
      userType: profile?.id ? "Member" : "Guest",
    };
    GAProductReviewSubmitted(webengageDataLayer);
  };
  // #endregion // WebEngage [18] - Product Review Submitted : Prepare Function

  const RenderUploadedImage = () => (
    <>
      {selectedFile.map((file: any, index: number) => {
        const imgSrc = file.imageSrc;

        const fileType = file.type.slice(0, 5);
        return (
          <li key={imgSrc} className="inline-block mr-2.5 relative">
            <div className="flex items-center justify-center w-24 h-24">
              {fileType === "image" ? (
                <>
                  <img
                    src={imgSrc}
                    alt="reviewImg"
                    className={`rounded w-24 h-24 object-cover ${
                      index === selectedFile.length - 1 && /*isSpinnerOn*/ isImageSpinnerOn ? "opacity-70" : ""
                    }`}
                  />
                  {index === selectedFile.length - 1 && isImageSpinnerOn ? (
                    <Spinner className="w-6 absolute" />
                  ) : (
                    <div className="absolute -top-2 right-2">
                      <svg
                        width="14"
                        height="14"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto opacity-70 absolute"
                        onClick={() => {
                          setSelectedFile([...selectedFile.slice(0, index), ...selectedFile.slice(index + 1)]);
                          setUploadImageUrl([...uploadImageUrl.slice(0, index), ...uploadImageUrl.slice(index + 1)]);
                          setMediaLimit(mediaLimit - 1);
                        }}
                      >
                        <path
                          d="M11.952 2.048a7.011 7.011 0 0 0-9.904 0 7.013 7.013 0 0 0 0 9.905A6.983 6.983 0 0 0 7 14a6.982 6.982 0 0 0 4.952-2.047 7.012 7.012 0 0 0 0-9.905zM9.888 9.064a.583.583 0 1 1-.825.825L7 7.825 4.938 9.888a.584.584 0 0 1-.826-.825L6.175 7 4.112 4.937a.583.583 0 1 1 .825-.825L7 6.175l2.063-2.063a.583.583 0 1 1 .825.825L7.825 7l2.063 2.064z"
                          fill=""
                          fillRule="nonzero"
                        />
                      </svg>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="relative">
                    <video
                      className={`rounded w-24 h-24 object-cover ${
                        index === selectedFile.length - 1 && isVideoSpinnerOn ? "opacity-70" : ""
                      }`}
                    >
                      <source src={imgSrc} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <span className="absolute top-2 right-2">
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M15.0833 9.93047L0.499919 19.6527L0.499919 0.208252L15.0833 9.93047Z"
                          fill="white"
                        />
                      </svg>
                    </span>
                  </div>
                  {index === selectedFile.length - 1 && isVideoSpinnerOn ? (
                    <Spinner className="w-6 absolute" />
                  ) : (
                    <div className="absolute -top-2 right-2">
                      <svg
                        width="14"
                        height="14"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto opacity-70 absolute"
                        onClick={() => {
                          setSelectedFile([...selectedFile.slice(0, index), ...selectedFile.slice(index + 1)]);
                          setUploadImageUrl([...uploadImageUrl.slice(0, index), ...uploadImageUrl.slice(index + 1)]);
                          setVideoLimit(videoLimit - 1);
                          setMediaLimit(mediaLimit - 1);
                        }}
                      >
                        <path
                          d="M11.952 2.048a7.011 7.011 0 0 0-9.904 0 7.013 7.013 0 0 0 0 9.905A6.983 6.983 0 0 0 7 14a6.982 6.982 0 0 0 4.952-2.047 7.012 7.012 0 0 0 0-9.905zM9.888 9.064a.583.583 0 1 1-.825.825L7 7.825 4.938 9.888a.584.584 0 0 1-.826-.825L6.175 7 4.112 4.937a.583.583 0 1 1 .825-.825L7 6.175l2.063-2.063a.583.583 0 1 1 .825.825L7.825 7l2.063 2.064z"
                          fill=""
                          fill-rule="nonzero"
                        />
                      </svg>
                    </div>
                  )}
                </>
              )}
            </div>
          </li>
        );
      })}
    </>
  );

  const getSubRatingHeaders = async () => {
    let arr: any = [];
    const api = new ProductAPI();

    await api.getsubRatings(product.id).then(res => {
      if (res?.data?.data[0]?.subRatings.length > 0) {
        setSubRatingHeaders(res?.data?.data[0]?.subRatings || []);

        res?.data?.data[0]?.subRatings.map((rating: any) => {
          let temp = { title: rating, value: 0 };

          arr.push(temp);
        });

        setSubRatingStarValue(arr);
      }
    });
  };

  useEffect(() => {
    getSubRatingHeaders();
  }, []);

  const handleSubRatingStarIcon = (key: any, value: any) => {
    const elementsIndex = subRatingStarValue.findIndex(element => element.title == key);
    let newArray = [...subRatingStarValue];
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      value,
    };
    setSubRatingStarValue(newArray);
  };

  const hideModal = () => {
    if (hideReviewFormModal) return hideReviewFormModal();

    PDP_STATES.modalStates.SubmitReviewModal = false;
  };

  return (
    <PopupModal show={reviewFormModal} onRequestClose={hideModal}>
      <div className="bg-white rounded-t-xl overflow-scroll" style={{ maxHeight: "95vh" }}>
        <div className="pb-5">
          <div className="sticky top-0 bg-white">
            <h1 className="text-sm font-semibold px-5 pt-5">{t("writeReview")}</h1>
            <div className="border border-t-0 border-l-0 border-r-0 border-gray-200 py-1" />
            <div className="flex items-center pb-2">
              <div>
                <Image
                  height={120}
                  width={120}
                  alt={product?.assets?.[0]?.name}
                  src={product?.assets?.[0]?.imageUrl?.["200x200"]}
                />
              </div>
              <div className="flex flex-col items-start mr-3 pl-2">
                <p className="text-sm font-semibold">{product?.cms?.[0].content?.name}</p>

                <div className="flex mt-3 -ml-1">
                  <ReviewStars
                    adobeAssetType={ADOBE.ASSET_TYPE.PDP}
                    getSelectedStars={handleStarIcon}
                    size="1.5rem"
                    star={ratings?.avgRating}
                    preSelectedStart={starsSelected}
                    reset={productStarRatingReset}
                    resetValue={5}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-3" style={{ background: "rgba(250, 226, 216, 0.4)" }}>
            {SHOP.ENABLE_GLAMMPOINTS && (
              <div className="" style={{ lineHeight: "18px" }}>
                <p className="text-sm font-semibold my-3 uppercase">{t("uploadPhotosnVideos")}</p>
                <ul className="px-5">
                  <li className="mb-4">
                    <p className="inline text-xs">
                      Earn <GoodPointsCoinIcon className="mx-1 h-4 w-4 inline" /> 25 Good Points for Writing a Review &
                      Additional <GoodPointsCoinIcon className="mx-1 h-4 w-4 inline" />5 Good Points for Uploading Photos and
                      Videos.{" "}
                    </p>
                  </li>
                  {t("lblStandAChanceToGetFeatured") && (
                    <li className="mb-4">
                      <p className="inline text-xs">{t("lblStandAChanceToGetFeatured")}</p>
                    </li>
                  )}
                </ul>
              </div>
            )}
            {mediaLimit > 2 && !isSpinnerOn && <li className="text-red-600 px-3 my-2 text-sm">Upload limit reached</li>}

            {!isVideoSpinnerOn && videoLimit > 1 && mediaLimit < 3 && (
              <li className="text-red-600 px-3 my-2 text-sm">Video limit reached</li>
            )}

            <div className="flex justify-between">
              <div className="w-full mr-2 font-semibold rounded-sm outline-none relative">
                <input
                  id="upload_image"
                  type="file"
                  name="file"
                  onChange={changeHandler}
                  accept="image/*"
                  //multiple
                  hidden
                  disabled={isImageSpinnerOn || mediaLimit > 2}
                />
                <label
                  htmlFor="upload_image"
                  className="px-5 py-2 border border-black font-semibold capitalize rounded text-black flex"
                  style={{ background: "rgba(250, 226, 216, 0.4)" }}
                >
                  <>
                    {isImageSpinnerOn ? (
                      <>
                        <div className="mx-auto">
                          <Spinner className="w-5 inline-flex mr-2 relative" />
                          <span className="text-xs relative mt-1">{t("uploading") || `Uploading ...`}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex mx-auto">
                          <span className="mr-2 mt-0.5">
                            <svg
                              width="17"
                              height="17"
                              viewBox="0 0 17 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              aria-labelledby="upload image"
                            >
                              <path
                                d="M13.1395 9.5699C12.9501 9.5699 12.7685 9.64517 12.6346 9.77916C12.5007 9.91315 12.4254 10.0949 12.4254 10.2844V10.5559L11.3686 9.49846C10.9954 9.12804 10.491 8.92019 9.96538 8.92019C9.43972 8.92019 8.93536 9.12804 8.5622 9.49846L8.06234 9.99858L6.2914 8.22673C5.91301 7.86636 5.41062 7.66537 4.88821 7.66537C4.36581 7.66537 3.86341 7.86636 3.48503 8.22673L2.42818 9.28412V5.28317C2.42818 5.09368 2.50341 4.91196 2.63733 4.77797C2.77125 4.64399 2.95288 4.56871 3.14227 4.56871H8.14089C8.33027 4.56871 8.5119 4.49344 8.64582 4.35945C8.77974 4.22547 8.85497 4.04374 8.85497 3.85426C8.85497 3.66477 8.77974 3.48305 8.64582 3.34906C8.5119 3.21508 8.33027 3.1398 8.14089 3.1398H3.14227C2.5741 3.1398 2.02921 3.36562 1.62746 3.76758C1.2257 4.16954 1 4.71471 1 5.28317V13.8566C1 14.4251 1.2257 14.9703 1.62746 15.3722C2.02921 15.7742 2.5741 16 3.14227 16H11.7113C12.2795 16 12.8244 15.7742 13.2261 15.3722C13.6279 14.9703 13.8536 14.4251 13.8536 13.8566V10.2844C13.8536 10.0949 13.7784 9.91315 13.6444 9.77916C13.5105 9.64517 13.3289 9.5699 13.1395 9.5699ZM3.14227 14.5711C2.95288 14.5711 2.77125 14.4958 2.63733 14.3618C2.50341 14.2278 2.42818 14.0461 2.42818 13.8566V11.306L4.49903 9.23411C4.60394 9.13408 4.7433 9.07829 4.88821 9.07829C5.03313 9.07829 5.17248 9.13408 5.27739 9.23411L7.54105 11.4989L10.6116 14.5711H3.14227ZM12.4254 13.8566C12.4244 13.9934 12.3793 14.1262 12.2969 14.2353L9.07634 10.9988L9.5762 10.4987C9.6274 10.4464 9.68851 10.4049 9.75595 10.3765C9.82339 10.3482 9.8958 10.3336 9.96895 10.3336C10.0421 10.3336 10.1145 10.3482 10.182 10.3765C10.2494 10.4049 10.3105 10.4464 10.3617 10.4987L12.4254 12.5778V13.8566ZM15.7888 3.347L13.6465 1.20363C13.5786 1.13858 13.4985 1.0876 13.4109 1.05359C13.237 0.982135 13.042 0.982135 12.8682 1.05359C12.7805 1.0876 12.7004 1.13858 12.6325 1.20363L10.4902 3.347C10.3558 3.48153 10.2802 3.664 10.2802 3.85426C10.2802 4.04452 10.3558 4.22699 10.4902 4.36152C10.6247 4.49606 10.8071 4.57164 10.9972 4.57164C11.1874 4.57164 11.3698 4.49606 11.5042 4.36152L12.4254 3.43273V7.42654C12.4254 7.61602 12.5007 7.79775 12.6346 7.93173C12.7685 8.06572 12.9501 8.14099 13.1395 8.14099C13.3289 8.14099 13.5105 8.06572 13.6444 7.93173C13.7784 7.79775 13.8536 7.61602 13.8536 7.42654V3.43273L14.7748 4.36152C14.8412 4.42849 14.9201 4.48164 15.0071 4.51791C15.0942 4.55418 15.1875 4.57286 15.2818 4.57286C15.376 4.57286 15.4694 4.55418 15.5564 4.51791C15.6434 4.48164 15.7224 4.42849 15.7888 4.36152C15.8557 4.2951 15.9088 4.21608 15.9451 4.12902C15.9813 4.04196 16 3.94858 16 3.85426C16 3.75994 15.9813 3.66656 15.9451 3.5795C15.9088 3.49243 15.8557 3.41341 15.7888 3.347Z"
                                fill="black"
                                stroke="#FDF3EF"
                                strokeWidth="0.5"
                              />
                            </svg>
                          </span>

                          <span className="text-xs relative mt-1">{t("uploadImage") || `Upload Image`}</span>
                        </div>
                      </>
                    )}
                  </>
                </label>
              </div>
              <div className="w-full font-semibold rounded-sm outline-none relative">
                <input
                  id="upload_video"
                  type="file"
                  name="file"
                  onChange={changeHandler}
                  accept="video/*"
                  //multiple
                  hidden
                  disabled={isVideoSpinnerOn || videoLimit > 1 || mediaLimit > 2}
                />
                <label
                  htmlFor="upload_video"
                  className="px-5 py-2 border border-black font-semibold capitalize rounded text-black flex"
                  style={{ background: "rgba(250, 226, 216, 0.4)" }}
                >
                  <>
                    {isVideoSpinnerOn ? (
                      <>
                        <div className="mx-auto">
                          <Spinner className="w-5 inline-flex mr-2 relative" />
                          <span className="text-xs relative mt-1">{t("uploading") || `Uploading ...`}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex mx-auto">
                          <span className="mr-2 mt-0.5">
                            <svg
                              width="21"
                              height="16"
                              viewBox="0 0 21 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              role="img"
                              aria-labelledby="upload video"
                            >
                              <path
                                d="M13.7273 1C13.9523 1 14.1681 1.09219 14.3272 1.25628C14.4864 1.42038 14.5758 1.64294 14.5758 1.875V5.55L18.9989 2.35625C19.0625 2.31027 19.1371 2.28319 19.2146 2.27794C19.2921 2.27269 19.3696 2.28949 19.4384 2.3265C19.5073 2.3635 19.565 2.4193 19.6053 2.48781C19.6455 2.55632 19.6668 2.6349 19.6667 2.715V13.285C19.6668 13.3651 19.6455 13.4437 19.6053 13.5122C19.565 13.5807 19.5073 13.6365 19.4384 13.6735C19.3696 13.7105 19.2921 13.7273 19.2146 13.7221C19.1371 13.7168 19.0625 13.6897 18.9989 13.6438L14.5758 10.45V14.125C14.5758 14.3571 14.4864 14.5796 14.3272 14.7437C14.1681 14.9078 13.9523 15 13.7273 15H1.84848C1.62345 15 1.40764 14.9078 1.24852 14.7437C1.08939 14.5796 1 14.3571 1 14.125V1.875C1 1.64294 1.08939 1.42038 1.24852 1.25628C1.40764 1.09219 1.62345 1 1.84848 1H13.7273ZM12.8788 2.75H2.69697V13.25H12.8788V2.75ZM7.78788 4.5L11.1818 8H8.63636V11.5H6.93939V8H4.39394L7.78788 4.5ZM17.9697 5.23587L14.5758 7.68587V8.31413L17.9697 10.7641V5.235V5.23587Z"
                                fill="black"
                                stroke="#FDF3EF"
                                strokeWidth="0.8"
                              />
                            </svg>
                          </span>
                          <span className="text-xs relative mt-1">{t("uploadVideo") || "Upload Video"}</span>
                        </div>
                      </>
                    )}
                  </>
                </label>
              </div>
            </div>

            <p className="mt-5 mb-2 font-semibold text-sm uppercase">{t("lblWriteReviewHere")}</p>

            <div>
              <input
                type="text"
                value={title}
                placeholder={t("addATitle") || "Add a title"}
                onChange={(event: any) => setTitle(event?.target.value)}
                className="review w-full px-2 py-2 border-2 border-gray outline-none placeholder-gray-500 text-sm mb-3"
                role="textbox"
                aria-label="review title"
              />
              <textarea
                rows={3}
                placeholder={t("writeYourExperience") || `Write something about your experience`}
                className="review w-full px-2 py-1 border-2 border-gray outline-none placeholder-gray-500 text-sm"
                onChange={(event: any) => setText(event?.target.value)}
                value={text}
              />
              {showCommentError && <div className="text-xs mb-4 text-color1">! {t("errorReviewContent")}</div>}
            </div>
          </div>
          {isFilePicked && Array.isArray(selectedFile) ? (
            <>
              <div className="overflow-y-scroll">
                <ul className="mt-2.5 pl-5 mb-5 inline-flex">
                  <RenderUploadedImage />
                </ul>
              </div>
            </>
          ) : (
            <p className="hidden">Select a file to show details</p>
          )}

          {subRatingHeaders.length > 0 && (
            <>
              <div className="flex justify-start px-5">
                <div className="relative text-sm text-black font-bold uppercase">
                  {t("pdpHorizontailReviewTitle") || `Tell us what you think`}
                </div>
              </div>
              <div className="px-5">
                {subRatingHeaders.length > 0 &&
                  subRatingHeaders.map((subRating: any, index: number) => {
                    return (
                      <HorizontalRating
                        key={index}
                        size="1.5rem"
                        t={t}
                        title={subRating}
                        handleSubRatingStarIcon={handleSubRatingStarIcon}
                        reset={starSubRatingReset}
                      />
                    );
                  })}
                {showSubRatingError && <div className="text-xs mt-2 text-color1">! {t("errorReviewSubRatings")}</div>}
              </div>
            </>
          )}

          <div className="px-5 flex justify-between">
            <button
              type="button"
              onClick={hideModal}
              disabled={isImageSpinnerOn || isVideoSpinnerOn || isSubmittingReview}
              className="w-full mr-2 py-2 text-black border border-black font-semibold rounded-sm outline-none mt-5 relative capitalize"
            >
              {t("cancel")?.toLowerCase()}
            </button>
            <button
              type="button"
              onClick={onSubmitReview}
              disabled={isImageSpinnerOn || isVideoSpinnerOn || isSubmittingReview}
              className="w-full py-2 text-white font-semibold uppercase bg-ctaImg rounded-sm outline-none mt-5 relative"
            >
              <span className="text-sm">{t("submitReview") || `Submit Review`}</span>
              {isSubmittingReview && <Spinner className="absolute inset-0 w-8 mx-auto inline-flex" />}
            </button>
          </div>
        </div>
      </div>
    </PopupModal>
  );
};

export default SubmitReview;
