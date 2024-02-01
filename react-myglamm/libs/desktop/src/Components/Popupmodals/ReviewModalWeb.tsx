import React, { useState } from "react";

import { PDPProd } from "@typesLib/PDP";
import { ValtioStore } from "@typesLib/ValtioStore";

import useTranslation from "@libHooks/useTranslation";
import { useSelector } from "@libHooks/useValtioSelector";

import Adobe from "@libUtils/analytics/adobe";
import { getImage } from "@libUtils/homeUtils";
import { showError } from "@libUtils/showToaster";
import { getVendorCode } from "@libUtils/getAPIParams";
import { formatPrice } from "@libUtils/format/formatPrice";
import { GAProductReviewSubmitted } from "@libUtils/analytics/gtm";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import PopupModal from "@libComponents/PopupModal/PopupModal";

import ProductAPI from "@libAPI/apis/ProductAPI";

import StarIcon from "../../../../UX/public/svg/star-filled.svg";
import EmptyStarIcon from "../../../../UX/public/svg/star-empty.svg";
import EmojiIcon0 from "../../../../UX/public/svg/stars-selected-0.svg";
import EmojiIcon1 from "../../../../UX/public/svg/stars-selected-1.svg";
import EmojiIcon2 from "../../../../UX/public/svg/stars-selected-2.svg";
import EmojiIcon3 from "../../../../UX/public/svg/stars-selected-3.svg";
import EmojiIcon4 from "../../../../UX/public/svg/stars-selected-4.svg";
import EmojiIcon5 from "../../../../UX/public/svg/stars-selected-5.svg";

interface reviewProps {
  show: boolean;
  product: PDPProd;
  hide: () => void;
}

const ReviewModalWeb = ({ show, product, hide }: reviewProps) => {
  const { t } = useTranslation();

  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  const { cms } = product;

  const [loader, setLoader] = useState(false);
  const [ackScreen, setAckScreen] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [noOfStarsSelected, setNoOfStarsSelected] = useState(0);

  const STAR_EMOJIS = [<EmojiIcon0 />, <EmojiIcon1 />, <EmojiIcon2 />, <EmojiIcon3 />, <EmojiIcon4 />, <EmojiIcon5 />];

  const handleSubmitReview = () => {
    setLoader(true);
    const productApi = new ProductAPI();
    productApi
      .createReviews({
        reviewContent,
        reviewerId: userProfile?.id,
        reviewTitle: "",
        meta: {
          productName: (product.cms.length > 0 && product.cms?.[0].content?.name) || "",
          sku: product.sku,
        },
        reviewerInfo: {
          firstName: userProfile?.firstName,
          lastName: userProfile?.lastName,
          email: userProfile?.email,
          mobile: userProfile?.phoneNumber,
        },
        itemId: product?.id,
        itemType: product?.urlShortner?.type,
        rating: noOfStarsSelected,
        vendorCode: getVendorCode(),
      })
      .then(() => {
        setLoader(false);
        setAckScreen(true);
        prepareWebengageSubmitReviewDataLayer();

        (window as any).digitalData = {
          common: {
            linkName: `web|{category} - ${product.productTag}|product description page|submit review`,
            linkPageName: `web|${product.productTag}|product description page`,
            newLinkPageName: "product description",
            assetType: "product",
            newAssetType: "product",
            subSection: `{category} - ${product.productTag}`,
            platform: "desktop website",
            ctaName: "submit review",
          },
          // user: Adobe.getUserDetails(profile),
          product: [
            {
              productSKU: product.sku,
              productQuantity: 1,
              productOfferPrice: formatPrice(product?.offerPrice),
              productPrice: formatPrice(product?.price),
              productDiscountedPrice: formatPrice(product?.price - product?.offerPrice),
              productRating: product?.ratings?.avgRating,
              productTotalRating: product.ratings?.totalCount,
              stockStatus: product.inStock ? "instock" : "out of stock",
              isPreOrder: product?.productMeta.isPreOrder ? "yes" : "no",
              PWP: "",
              starCount: "",
              hasTryOn: "no",
            },
          ],
        };
        Adobe.Click();
      })
      .catch(error => {
        setLoader(false);
        showError(error.respone?.data?.message || error);
      });
  };

  // #region // *WebEngage [18] - Product Review Submitted : Prepare Function
  const prepareWebengageSubmitReviewDataLayer = () => {
    const webengageDataLayer = {
      productCategory: product.categories.subChildCategoryName,
      productSubCategoryName: product.productTag,
      productName: product?.cms?.[0]?.content?.name,
      productSku: product.sku,
      starRating: noOfStarsSelected,
      userType: userProfile?.id ? "Member" : "Guest",
    };
    GAProductReviewSubmitted(webengageDataLayer);
  };
  // #endregion // WebEngage [18] - Product Review Submitted : Prepare Function

  return (
    <PopupModal type="center-modal" show={show} onRequestClose={hide}>
      <section className="rounded bg-white shadow-lg relative p-4" style={{ width: "650px" }}>
        <button
          type="button"
          onClick={hide}
          style={{ boxShadow: "0 1px 0 #fff" }}
          className="text-5xl font-bold absolute right-4 top-2 opacity-20 text-black hover:opacity-50"
        >
          ×
        </button>

        {/* ACKNOWLEDGE SCREEN */}
        {ackScreen ? (
          <div className="flex flex-col items-center justify-center h-96">
            <img src="https://files.myglamm.com/site-images/original/review-thanks.png" height={72} width={80} />

            <p className="font-bold text-sm py-2">
              {t("thankYouForHelpingOurCommunity") || "Thank you for helping to make our community better"}
            </p>
            <p className="text-xs mb-8">
              {t("reviewsPosted") || "Reviews are typically posted within 72 hours of the time you submit them, stay tuned"}
            </p>

            <button
              type="button"
              onClick={hide}
              className="bg-ctaImg text-white h-12 font-bold text-sm max-w-xs w-full rounded-sm"
            >
              {t("continueShopping")}
            </button>
          </div>
        ) : (
          <>
            {/* REVIEW SCREEN */}
            <h3 className="font-bold text-18 mb-4">{t("reviewThisProduct") || "Review this product"}</h3>

            <div className="flex item-center">
              <img src={getImage(product, "200x200")} alt={cms?.[0]?.content?.name} height={72} width={72} />

              <div>
                <p className="font-bold mb-1">{cms?.[0]?.content?.name}</p>
                <p className="text-gray-400 text-xs font-bold">{cms?.[0].content.subtitle}</p>
              </div>
            </div>

            <div className="flex justify-center">{STAR_EMOJIS[noOfStarsSelected]}</div>

            <div className="flex justify-center py-4">
              {new Array(5).fill("star").map((_, i) => {
                if (noOfStarsSelected <= i) {
                  return (
                    <EmptyStarIcon
                      width={38}
                      height={38}
                      className="mx-1 cursor-pointer"
                      onClick={() => setNoOfStarsSelected(i + 1)}
                    />
                  );
                }
                return (
                  <StarIcon
                    height={38}
                    width={38}
                    className="mx-1 cursor-pointer"
                    onClick={() => setNoOfStarsSelected(i + 1)}
                  />
                );
              })}
            </div>

            <div className="mx-auto max-w-xs py-2">
              <textarea
                cols={4}
                rows={3}
                value={reviewContent}
                spellCheck={false}
                onChange={e => setReviewContent(e.target.value)}
                className="bg-themeGray text-gray-400 w-full mb-4 outline-color1 p-2"
                placeholder={t("writeSomethingAboutYourExperience") || "Write something about your experience (Optional)"}
              />

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={!noOfStarsSelected || loader}
                className="bg-ctaImg text-white font-bold rounded-sm h-12 text-sm w-full relative"
              >
                {t("submitReview")}
                {loader && <LoadSpinner className="w-8 inset-0 absolute m-auto" />}
              </button>
            </div>
          </>
        )}
      </section>
    </PopupModal>
  );
};

export default ReviewModalWeb;
