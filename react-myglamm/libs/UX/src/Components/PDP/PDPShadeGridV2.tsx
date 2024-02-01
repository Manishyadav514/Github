import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSelector } from "@libHooks/useValtioSelector";
import LazyHydrate from "react-lazy-hydration";

import { PDPProd } from "@typesLib/PDP";
import { ValtioStore } from "@typesLib/ValtioStore";

import PDPShade from "./PDPShade";

import ShadeArrowIcon from "../../../public/svg/shade_arrow.svg";
import { PDP_STATES } from "@libStore/valtio/PDP.store";

export interface PDPShadeGridProps {
  setActiveShade?: any;
  isMiniShadeSelection?: boolean;
  isFreeProduct?: boolean;
  product: PDPProd;
  isTryon?: boolean;
  notifyOnShadeClick?: (arg1: any) => void;
}

const horizontalShadeStyle = {
  gridGap: "2px",
  gridTemplateColumns: "repeat(auto-fit, minmax(51px, max-content))",
  gridAutoFlow: "column",
  overflowX: "scroll",
  justifyContent: "flex-start",
} as React.CSSProperties;

function PDPShadeGrid({
  setActiveShade,
  isMiniShadeSelection,
  isFreeProduct,
  product,
  isTryon,
  notifyOnShadeClick,
}: PDPShadeGridProps) {
  const router = useRouter();

  const { userWishlist } = useSelector((store: ValtioStore) => store.userReducer);

  const { shades, id: currentProductId, productTag, urlShortner } = product;

  const [id, setId] = useState(currentProductId);
  const [shadesList, setShadesList] = useState([product, ...shades]);

  const onShadeScroll = () => {
    setShadesList(shades);
  };

  useEffect(() => {
    setId(currentProductId);
    setShadesList([product, ...shades]);
  }, [productTag]);

  const onLinkClick = (url: string) => {
    if (router.asPath.includes("/product") && !isFreeProduct) {
      router.replace(url);
    }
  };

  const onClick = React.useCallback((shade: any) => {
    setId(shade.id);

    if (isTryon) {
      onLinkClick(`/tryon/${router.query.page}${shade.urlShortner?.slug || shade.urlManager?.url}`);
    } else {
      onLinkClick(shade.urlShortner?.slug || shade.urlManager?.url);
      try {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } catch {
        /* NO Response on Failure */
      }
    }

    notifyOnShadeClick?.(shade);
  }, []);

  return (
    <div className="Shades px-2 py-4 bg-white">
      <svg width="0" height="0">
        <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
          <path d="M0.01,0.311 C0.017,0.16,0.137,0.04,0.287,0.033 L0.5,0.024 L0.713,0.033 C0.863,0.04,0.983,0.16,0.99,0.311 L1,0.524 L0.99,0.736 C0.983,0.887,0.863,1,0.713,1 L0.5,1 L0.287,1 C0.137,1,0.017,0.887,0.01,0.736 L0,0.524 L0.01,0.311"></path>
        </clipPath>
      </svg>

      {/* Shade Label */}
      <p className="text-sm  pb-2 text-gray-700">
        <span className="ml-2 uppercase font-bold">{product.cms[0]?.attributes?.shadeLabel}</span>
        {shadesList.length > 6 && !isTryon && (
          // <Link href={`/shade-selection/${urlShortner.slug.split("/")[2]}`} prefetch={false} aria-label="all shades">
          <span
            className="ml-2 font-semibold text-color1 float-right flex items-center"
            onClick={() => {
              PDP_STATES.modalStates.shadeSelectionModal = true;
            }}
          >
            All {shadesList.length} Shades
            <ShadeArrowIcon
              height={20}
              width={20}
              className="ml-2.5"
              role="img"
              aria-labelledby="all shades"
              title="all shades"
            />
          </span>
          // </Link>
        )}
      </p>

      {/* Shade Grid Component */}
      <LazyHydrate whenIdle>
        <div className="w-full grid justify-center px-2" style={horizontalShadeStyle} onScroll={onShadeScroll}>
          {shadesList.map((shade, index: number) => {
            const shadeDetails = shade.cms[0]?.attributes;
            const { shadeImage } = shadeDetails || {};
            const productMeta = shade.productMeta || (shade as any).meta;

            if (!isTryon || (isTryon && productMeta?.tryItOn))
              return (
                <LazyHydrate key={shade.id} whenIdle>
                  <PDPShade
                    shade={shade}
                    id={id}
                    index={index}
                    onClick={onClick}
                    isMiniShadeSelection={isMiniShadeSelection}
                    isFreeProduct={isFreeProduct}
                    setActiveShade={setActiveShade}
                    userWishlist={userWishlist}
                    shadeImage={shadeImage}
                    isPreOrder={productMeta.isPreOrder}
                  />
                </LazyHydrate>
              );
          })}
        </div>
      </LazyHydrate>
    </div>
  );
}

export default PDPShadeGrid;
