import useTranslation from "@libHooks/useTranslation";
import { parseLink } from "@libUtils/widgetUtils";
import { useRouter } from "next/router";
import { useEffect } from "react";
import HomeMiniPDP from "./PopupModal/HomeMiniPDP";
import PLPModal from "./PopupModal/PLPModal";
import { SOURCE_STATE } from "@libStore/valtio/SOURCE.store";

const BannerWidget = ({
  showWidget,
  bannerDetails,
  setShowWidget,
  icid,
}: {
  showWidget: boolean;
  setShowWidget: any;
  bannerDetails: any;
  icid: string;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const isProduct = bannerDetails?.slug.includes("/product/");
  const isCollection = bannerDetails?.slug.includes("/collection/");
  const isPLP = bannerDetails?.slug.includes("/buy/");

  if (!bannerDetails?.slug.startsWith("/") || !(isProduct || isCollection || isPLP)) {
    router.push(bannerDetails?.slug);
    return null;
  }

  useEffect(() => {
    if (icid) {
      setTimeout(() => {
        router.push(`?icid=${icid}`, undefined, { shallow: true });
      }, 200);
    }
    if (isProduct) {
      SOURCE_STATE.pdpSource = "home";
    }
  }, []);

  const { slug, discountCode, limit } = parseLink(bannerDetails?.slug);

  if (isProduct) {
    return (
      <HomeMiniPDP
        show={showWidget}
        onRequestClose={() => setShowWidget(false)}
        product={{ URL: slug }}
        productPosition={1}
        t={t}
        themeColor={"#f88d8d"} //f88d8d
        widgetName="Banner Widget"
        discountCode={discountCode}
        icid={icid}
        isMiniPDPBanner={true}
      />
    );
  }

  if (isCollection || isPLP) {
    return (
      <PLPModal
        show={showWidget}
        setShow={setShowWidget}
        header={bannerDetails?.header}
        slug={slug}
        discountCode={discountCode}
        limit={limit}
        url={bannerDetails?.slug}
      />
    );
  }

  return <></>;
};

export default BannerWidget;
