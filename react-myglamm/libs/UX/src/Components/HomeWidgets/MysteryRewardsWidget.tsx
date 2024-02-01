import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";
import MysteryRewardAPI from "@libAPI/apis/MysteryRewardApi";
import MysteryCard from "@libComponents/MysteryRewards/MysteryCard";
import Head from "next/head";
import React, { useEffect, useState } from "react";

const MysteryRewardsWidget = ({ item, icid }: any) => {
  const [rewards, setRewards] = useState([]);
  const [relationalData, setRelationalData] = useState<any>();
  const widgetMeta = JSON.parse(item?.meta?.widgetMeta || "{}");


  useEffect(() => {
    if (checkUserLoginStatus()?.memberId) {
      const MysteryRewardApi = new MysteryRewardAPI();
      MysteryRewardApi.getMysteryRewards()
        .then(({ data }: any) => {
          setRewards(data.data.data);
          setRelationalData(data.data.relationalData);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, []);


  return (
    <>
      {checkUserLoginStatus()?.memberId && rewards?.length > 0 && (
        <>
          <Head>
            <style>
              {`

            .lineFadeBlack{
              height: 0.5px;
              transform: rotate(-360deg);
              background-image: linear-gradient(to right, rgba(0, 0, 0, 0.01) -1%, #000 51%, rgba(0, 0, 0, 0.01) 100%);
            }

            .mysteryCard {
              -webkit-animation: MoveUpDownCard 10s infinite  ;
              animation: MoveUpDownCard 10s infinite ;
              pointer-events: none;
            }
            
            @-webkit-keyframes MoveUpDownCard {
              0%{
                transform: translateY(0px);
              }
              10%,20%{
                transform: translateY(-64px);
              }
              20%,60%{
                transform: translateY(-64px);
              }
              70%,100%{
                transform: translateY(0px);
              }
            }
            
            @keyframes MoveUpDownCard {
              0%{
                transform: translateY(0px);
              }
              10%,20%{
                transform: translateY(-64px);
              }
              20%,60%{
                transform: translateY(-64px);
              }
              70%,100%{
                transform: translateY(0px);
              }
            }
            `}
            </style>
          </Head>
          <section className="w-full mb-5" style={{ background: `${widgetMeta.background || "#FFF8ec"}`, height: "540px" }}>
            <div
              className="py-10 bg-cover bg-center"
              style={{ backgroundImage: "url(https://files.myglamm.com/site-images/original/widget-pattern.png)" }}
            >
              <span className="flex gap-1 mx-4">
                <h1 className="text-3xl font-bold"> {item?.commonDetails?.title} </h1>
                <h3 className="text-sm self-center font-bold leading-8 pt-1.5"> {item?.commonDetails?.subTitle}</h3>
              </span>
              <span className="my-2 block">
                {widgetMeta?.listPoints && Array.isArray(widgetMeta?.listPoints) && (
                  <>
                    <div className="lineFadeBlack w-full" />
                    <div className=" flex overflow-x-scroll whitespace-nowrap items-center mx-4  my-3">
                      {widgetMeta?.listPoints?.map((data: any) => {
                        return (
                          <li key={data} className="pr-4 text-xs">
                            {data}
                          </li>
                        );
                      })}
                    </div>
                    <div className="lineFadeBlack w-full" />
                  </>
                )}
                <div className=" flex overflow-x-scroll whitespace-nowrap items-center  my-4">
                  {rewards?.map((reward: any, index: number) => {
                    return (
                      <MysteryCard
                        icid={!icid ? "" : `?icid=${icid}_${item.label.toLowerCase()}_${index + 1}`}
                        key={reward?.id}
                        title={reward?.title}
                        slug={reward?.slug}
                        rewardImg={reward?.thumnailImage?.couponImage}
                        brandData={relationalData?.discountCodeVendor?.[reward.discountCodeVendor]?.meta?.mysteryReward}
                      />
                    );
                  })}
                </div>
              </span>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default MysteryRewardsWidget;
