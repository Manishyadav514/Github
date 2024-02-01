import React, { ReactElement, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MysteryRewardHeader from "@libComponents/Header/MysteryRewardHeader";
import RewardPreview from "@libComponents/MysteryRewards/RewardPreview";
import MysteryRewardAPI from "@libAPI/apis/MysteryRewardApi";
import { isClient } from "@libUtils/isClient";
import { mysteryRewardPageLoad } from "@libAnalytics/MysteryRewards.Analytics";
import { isWebview } from "@libUtils/isWebview";
import Head from "next/head";

const DragAndDropLogo = dynamic(
  () => import(/* webpackChunkName: "DragAndDropLogo" */ "@libComponents/MysteryRewards/DragAndDropLogo"),
  { ssr: false }
);

const RewardRedeem = dynamic(
  () => import(/* webpackChunkName: "RewardRedeem" */ "@libComponents/MysteryRewards/RewardRedeem"),
  { ssr: false }
);

const ConfettiModal = dynamic(() => import("@libComponents/OrderSummary/ConfettiModal"), { ssr: false });

const MysteryRewardsDetails = ({ reward, brandData }: any) => {
  const [showDragAndDrop, setShowDragAndDrop] = useState<boolean>(false);
  const [scrollUp, setScrollUp] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponData, setCouponData] = useState();
  const [innerHeight, setInnerHeight] = useState<any>("100vh");

  useEffect(() => {
    if (isClient()) {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !isWebview()) {
        setInnerHeight(window.document.documentElement.clientHeight);
      } else {
        setInnerHeight(window.innerHeight);
      }
      mysteryRewardPageLoad();
    }
  }, []);

  useEffect(() => {
    if (showDragAndDrop) {
      setTimeout(() => setShowConfetti(true), 0);

      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [showDragAndDrop]);

  const { primaryColor, backgroundColor, brandLogo, headerLogo, logoSkeleton, g3Logo, site, name } = brandData;

  return (
    <>
      <Head>
        <style>
          {`
      .moveUpDown {
        -webkit-animation: MoveUpDown 1.2s infinite alternate;
        animation: MoveUpDown 1.2s infinite alternate;
      }

      @-webkit-keyframes MoveUpDown {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-7px);
        }
      }

      @keyframes MoveUpDown {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-7px);
        }
      }

      .blinkArrow,.blinkArrow1,.blinkArrow2 {
        animation: fadeIn   infinite;
        -webkit-animation: fadeIn   infinite;
        animation-duration: 1.5s
      }

      .blinkArrow1{
        animation-duration: 1.6s

      }
      .blinkArrow2{
        animation-duration: 1.7s
      }

      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      @-webkit-keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }

      .lineFadeBlack{
        height: 0.5px;
        transform: rotate(-360deg);
        background-image: linear-gradient(to right, rgba(0, 0, 0, 0.01) -1%, #000 51%, rgba(0, 0, 0, 0.01) 100%);
      }

      .redeemList ul,.redeemList ol{
        list-style-position: inside; 
        text-indent:-20px; 
        margin-left:20px;
     }
     
     
     @media screen and (max-height: 650px){
       .reward-preview{
        margin-top: 12px;
        margin-bottom: 12px;
       }
     
       .reward-preview .reward-details{
         margin-top: 12px;
         margin-bottom: 12px;
       }
     
       .drag, .drop{
         height: 30px;
         max-width: 124px;
       }
     
       .drag-drop{
         padding-bottom: 12px;
       }
       .drag-drop-line{
         margin-top: 8px;
         margin-bottom: 8px;
       }
     
       .reward-title{
         margin-bottom: 8px;
       }
     }
     
`}
        </style>
      </Head>
      <section className="fixed top-0 left-0 h-full bottom-0 right-0" style={{ background: backgroundColor }}>
        <div
          className="flex flex-col overflow-hidden"
          style={{
            backgroundImage: "url(https://files.myglamm.com/site-images/original/widget-pattern.png)",
            color: primaryColor,
            height: innerHeight,
            touchAction: "none",
          }}
        >
          {showConfetti && <ConfettiModal show={showConfetti} />}
          <MysteryRewardHeader headerLogo={headerLogo} vendorCode={reward.discountCodeVendor} />
          <RewardPreview reward={reward} scrollUp={scrollUp} hide={showDragAndDrop} g3Logo={g3Logo} couponData={couponData} />
          <div className="mx-2  bg-white rounded-t-3xl flex flex-col flex-grow">
            {!showDragAndDrop ? (
              <DragAndDropLogo
                setShowDragAndDrop={setShowDragAndDrop}
                brandLogo={brandLogo}
                setCouponData={setCouponData}
                rewardId={reward?.id}
                logoSkeleton={logoSkeleton}
                backgroundColor={backgroundColor}
                vendorCode={reward.discountCodeVendor}
                title={reward?.title}
              />
            ) : (
              <>
                <RewardRedeem
                  scrollUp={scrollUp}
                  setScrollUp={setScrollUp}
                  couponData={couponData}
                  reward={reward}
                  site={site}
                  name={name}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
MysteryRewardsDetails.getLayout = (children: ReactElement) => <>{children}</>;

MysteryRewardsDetails.getInitialProps = async (ctx: any) => {
  const mysteryRewardApi = new MysteryRewardAPI();
  try {
    const { data } = await mysteryRewardApi.getReward(ctx.query.slug);

    if (!data.data.data?.length) {
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Page Not Found");
      }

      return {
        errorCode: 404,
      };
    }

    const relationalData = data.data?.relationalData?.discountCodeVendor?.[data.data?.data?.[0].discountCodeVendor];

    return {
      reward: data.data?.data?.[0],
      brandData: {
        ...relationalData?.meta?.mysteryReward,
        site: relationalData?.meta?.site,
        name: relationalData?.name,
      },
    };
  } catch (error) {
    console.error(error);

    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }
  }
};
export default MysteryRewardsDetails;
