import React from "react";
import { useState } from "react";

import useTranslation from "@libHooks/useTranslation";

import Adobe from "@libUtils/analytics/adobe";
import { formatPrice } from "@libUtils/format/formatPrice";

import { DecoySubscription, SelectedSubscription, SubscriptionFrequency } from "@typesLib/PDP";

import { ADOBE } from "@libConstants/Analytics.constant";

import { PDP_STATES } from "@libStore/valtio/PDP.store";

import PDPIconTag from "./PDPIconTag";

interface PDPSubscriptionsProps {
  data: DecoySubscription[];
  defaultSelectedPack?: number;
  defaultSelectedFrequency?: string;
  setSelectedSubscription: (selected: SelectedSubscription) => void;
}

const PDPSubscriptions = ({
  data,
  defaultSelectedPack,
  defaultSelectedFrequency,
  setSelectedSubscription,
}: PDPSubscriptionsProps) => {
  const { t } = useTranslation();

  const [activeFrequency, setActiveFrequency] = useState(defaultSelectedFrequency);
  const [activePack, setActivePack] = useState(defaultSelectedPack ? defaultSelectedPack - 1 : 0);

  const changeActivePack = (subscription: DecoySubscription, index: number) => {
    setActivePack(index);

    /* Priority set for the default frequency selected on change of active pack. (auto selected --> tag --> config --> first one) */
    const frequencySelected =
      subscription?.subscriptionsFrequencies?.find((x: any) => x.frequency === activeFrequency) ||
      subscription.subscriptionsFrequencies?.find((x: any) => x.tag === "Most Popular" || x.tag?.includes("Most Popular")) ||
      (subscription.subscriptionsFrequencies?.[t("subscriptionConfig")?.defaultFrequency || 0] as SubscriptionFrequency);

    PDP_STATES.showBestOffer = frequencySelected.showBestOffer;
    setSelectedSubscription({
      quantity: subscription.quantity,
      decoyPriceId: subscription.id,
      subscriptionId: frequencySelected?.id,
      frequency: frequencySelected.frequency,
    });
  };

  const LightningIconSVG = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" height="8px" width="8px">
        <g transform="translate(0 -1036.4)">
          <path
            fill="#fff"
            d="m3.4724 8.5186 3.0305-7.0711h6.9448l-5.0192 5.0823h4.1353l-8.1128 9.0914 2.0834-7.1342z"
            transform="translate(0 1036.4)"
          />
        </g>
      </svg>
    );
  };

  const adobeClickEventPack = (ctaName: string, pack: number) => {
    // On Click - On Pack
    (window as any).digitalData = {
      common: {
        linkName: `web|subscription|pack of ${pack}`,
        linkPageName: `Subscription`,
        newLinkPageName: "Subscription",
        assetType: "Subscription pack selection",
        newAssetType: "Subscription pack selection",
        subSection: "Subscription pack  selection",
        platform: ADOBE.PLATFORM,
        ctaName: `Subscription|${ctaName} of ${pack}`,
        pageLocation: "PDP",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  const adobeClickEventSubscription = (ctaName: string, frequency = "") => {
    // On Click - On Subscription Frequency
    (window as any).digitalData = {
      common: {
        linkName: `web|subscription|${frequency} frequency`,
        linkPageName: `Subscription`,
        newLinkPageName: "Subscription",
        assetType: "Subscription frequency",
        newAssetType: "Subscription frequency",
        subSection: "Subscription frequency",
        platform: ADOBE.PLATFORM,
        ctaName: `Subscription|${ctaName}|${frequency}`,
        pageLocation: "PDP",
      },
      user: Adobe.getUserDetails(),
    };
    Adobe.Click();
  };

  return (
    <div className="py-2">
      <div className="bg-white p-2">
        <div className="flex justify-between items-end mb-2">
          {data?.map((subscription, index: number) => {
            const { offerPrice, price, unitOfferPrice, quantity, tag } = subscription || {};
            return (
              <div className="flex flex-col px-1" key={index}>
                {tag?.includes("Most Popular") && <PDPIconTag text={tag} Icon={LightningIconSVG} />}
                <div
                  className={`${
                    activePack === index ? "" : "opacity-50 border border-color2"
                  } border border-color1 rounded w-28`}
                  onClick={() => {
                    adobeClickEventPack("Pack", quantity);
                    changeActivePack(subscription, index);
                  }}
                >
                  <div className="rounded bg-color2 p-2 font-semibold text-xs">Pack of {quantity}</div>
                  <div className="flex flex-col p-2">
                    <div className="flex space-x-1">
                      <p className="text-sm font-semibold">{formatPrice(offerPrice, true)}</p>
                      <p className="text-gray-400 text-sm">
                        <del>{formatPrice(price, true)}</del>
                      </p>
                    </div>
                    <p className="text-10">[{formatPrice(unitOfferPrice, true)}/unit]</p>
                  </div>
                </div>

                <div className={`flex justify-center ${activePack === index ? "" : "opacity-0"}`}>
                  <div className="w-4 border-solid border-t-color1 border-t-8 border-x-transparent border-x-8 border-b-0" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex space-x-1 ml-2 text-sm">
          <span className="font-medium">Get More Discount</span>
          <p>on future repeat deliveries.</p>
        </div>

        <div>
          {data?.map(({ subscriptionsFrequencies, quantity, id: decoyPriceId }, index: number) => {
            if (activePack !== index) return null;

            return (
              <div className="m-2" key={index}>
                {[...(subscriptionsFrequencies || [])]
                  ?.sort((a, b) => a.order - b.order)
                  .map(
                    (
                      {
                        id,
                        subscriptionTitle,
                        offerPrice,
                        unitOfferPrice,
                        discountLabel,
                        subscriptionSubtitle,
                        frequency,
                        tag,
                        showBestOffer,
                      },
                      index: number
                    ) => {
                      const MOST_POPULAR = tag?.includes("Most Popular");

                      return (
                        <div className="mb-3" key={index}>
                          <div className="ml-6">{MOST_POPULAR && <PDPIconTag text={tag} Icon={LightningIconSVG} />}</div>
                          <label>
                            <div className="flex items-center space-x-1">
                              <input
                                id={id}
                                type="radio"
                                className="radio-input"
                                value={id}
                                name="subscription"
                                defaultChecked={activeFrequency === frequency}
                                onClick={() => {
                                  PDP_STATES.showBestOffer = showBestOffer;
                                  setSelectedSubscription({
                                    quantity: quantity,
                                    decoyPriceId: decoyPriceId,
                                    subscriptionId: id,
                                    frequency: frequency,
                                  });
                                  adobeClickEventSubscription("Frequency", frequency);
                                  setActiveFrequency(frequency);
                                }}
                              />
                              <div className="font-medium text-sm pl-1">{subscriptionTitle}</div>
                              <div className="font-medium text-sm	">{formatPrice(offerPrice, true)}</div>
                              <div className="text-10">[{formatPrice(unitOfferPrice, true)}/unit]</div>
                              <div className="bg-color2 rounded text-10 px-1">{discountLabel}</div>
                            </div>
                            <div className="text-10 ml-7">{subscriptionSubtitle}</div>
                          </label>
                        </div>
                      );
                    }
                  )}
                <style>{`
                    .radio-input {
                      -webkit-appearance: none;
                      -moz-appearance: none;
                      appearance: none;
                      background-clip: content-box;
                      width: 18px;
                      height: 18px;
                      border: 1px solid #979797;
                      padding: 4px;
                      display: inline-block;
                      border-radius: 50%;
                    }
                    .radio-input:checked {
                      background-color: var(--color1);
                      border: 1px solid var(--color1);
                    }
                  `}</style>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PDPSubscriptions;
