import React from "react";
import Link from "next/link";
import useTranslation from "@libHooks/useTranslation";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import PDPFooterLinks from "./PDPFooterLinks";
import { SHOP } from "@libConstants/SHOP.constant";

const CollectionBanner = ({ variantId, banner, index, icid }: any) => (
  <div key={index}>
    <Link
      href={
        !icid
          ? banner.targetLink
          : `${banner.targetLink}?icid=${icid}_multiple-banner_explore more_2_${banner.headerText}_${
              index + 1
            }&layout=${variantId}`
      }
      style={{ paddingBottom: "1px", background: "#fff" }}
      aria-label={banner.assetDetails.name}
      className="block px-1"
    >
      <ImageComponent
        className="px-2 mx-auto w-full"
        style={{ height: "133px" }}
        src={banner.assetDetails.url}
        alt={banner.assetDetails.name}
      />
    </Link>
  </div>
);

function PDPFooter({ footerBanners, icid }: any) {
  const { t } = useTranslation();

  const CategoryGrid = footerBanners?.[0]?.multimediaDetails || [];
  const FooterBanners = footerBanners?.[1]?.multimediaDetails || [];

  if (CategoryGrid.length > 0 || FooterBanners.length > 0) {
    return (
      <section className="PDPFooter bg-white mt-1 pt-5">
        <h2 className="uppercase text-xl text-center font-bold">{t("exploreMore")}</h2>
        <div>
          <div className="flex my-3 mx-1 flex-wrap justify-center" style={{ height: "296px" }}>
            {Array.isArray(CategoryGrid) &&
              CategoryGrid.map((banner: any, index: number) => (
                <div key={banner.targetLink} className="w-1/2 my-2 px-2" style={{ height: "58px" }}>
                  <Link
                    href={
                      !icid
                        ? banner.targetLink
                        : `${banner.targetLink}?icid=${icid}_single-banner_explore more_2_${banner.headerText}_${index + 1}`
                    }
                    aria-label={banner.assetDetails.name}
                  >
                    <ImageComponent
                      style={{ height: "58px" }}
                      src={banner.assetDetails.url}
                      alt={banner.assetDetails.name}
                      className="w-full"
                    />
                  </Link>
                </div>
              ))}
          </div>

          <div className="PDP_Footer-two">
            {FooterBanners?.map((banner: any, index: number) => (
              <React.Fragment key={`pdpfootbanner-${index}`}>
                <CollectionBanner variantId="0" banner={banner} index={index} icid={icid} />
              </React.Fragment>
            ))}
          </div>
          {/* TODO: document why only myglamm */}
          {SHOP.IS_MYGLAMM && <PDPFooterLinks />}
        </div>
      </section>
    );
  }

  return null;
}

export default PDPFooter;
