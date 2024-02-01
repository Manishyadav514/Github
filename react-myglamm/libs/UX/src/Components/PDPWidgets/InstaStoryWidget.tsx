import WidgetAPI from "@libAPI/apis/WidgetAPI";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import InstaStoryPlayer from "../PDP/PDPWidgetComponents/InstaStoryPlayer";

const PhotoSlurpModal = dynamic(
  () => import(/* webpackChunkName: "PhotoSlurpModal" */ "@libComponents/PopupModal/PhotoSlurpModal"),
  { ssr: false }
);

interface slurpWidget {
  item: any;
  productSku?: string;
}

const InstaStoryWidget = ({ item, productSku }: slurpWidget) => {
  const defaultActiveSlurpData = {
    show: false,
    activeSlurpIndex: undefined,
  };

  const [activeSlurpData, setActiveSlurpData] = useState(defaultActiveSlurpData);
  const [allPhotoSlurpInfo, setAllPhotoSlurpInfo] = useState({
    page: 1,
    isLoading: false,
    hasMore: true,
    data: [],
  });

  useEffect(() => {
    window.requestAnimationFrame(() => {
      getPhotoSlurp();
    });
  }, [productSku]);

  /* Opening PhotoSlurp Detail Modal based on Click */
  const handleClick = (index: number) => {
    const activeSlurpDataTemp = JSON.parse(JSON.stringify(activeSlurpData));
    activeSlurpDataTemp.show = true;
    activeSlurpDataTemp.activeSlurpIndex = index;
    setActiveSlurpData(activeSlurpDataTemp);
  };

  /* Get Call for PhotoSlurp and pagination */
  const getPhotoSlurp = () => {
    if (allPhotoSlurpInfo.hasMore) {
      const allPhotoSlurpInfoTemp = JSON.parse(JSON.stringify(allPhotoSlurpInfo));
      allPhotoSlurpInfoTemp.isLoading = false;
      setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
      /* Passing Product SKU for getting photoslurp at Product Level(PDP) */
      let { widgetMeta } = item.meta || {};
      if (productSku) {
        widgetMeta = `${widgetMeta}&product_id=${productSku}`;
      }

      const widgetApi = new WidgetAPI();
      widgetApi
        .getPhotoSlurp(widgetMeta, allPhotoSlurpInfo.page)
        .then(({ data: res }) => {
          if (res.data?.results?.length) {
            const allPhotoSlurpInfoTemp: any = { ...allPhotoSlurpInfo };
            allPhotoSlurpInfoTemp.data = [...res.data.results].filter((x: any) => x.videos?.standard?.url).slice(0, 5);
            allPhotoSlurpInfoTemp.page = allPhotoSlurpInfoTemp.page + 1;
            allPhotoSlurpInfoTemp.hasMore = false;
            setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
          }
        })
        .catch(() => {
          const allPhotoSlurpInfoTemp: any = { ...allPhotoSlurpInfo };
          allPhotoSlurpInfoTemp.isLoading = false;
          setAllPhotoSlurpInfo(allPhotoSlurpInfoTemp);
        });
    }
  };

  if (!allPhotoSlurpInfo?.data?.length) return <></>;

  return (
    <>
      <div className="bg-white py-5 pl-4 border-b-4 border-themeGray">
        <p className="text-sm font-bold pb-4">@MyGlamm In Action</p>
        <InstaStoryPlayer sources={allPhotoSlurpInfo?.data || []} onVideoClick={handleClick} />
      </div>
      {activeSlurpData.activeSlurpIndex !== undefined && (
        <PhotoSlurpModal
          show={activeSlurpData.show}
          photoSlurpData={allPhotoSlurpInfo.data}
          activeSlurpIndex={activeSlurpData.activeSlurpIndex}
          getPhotoSlurp={getPhotoSlurp}
          hide={() => setActiveSlurpData(defaultActiveSlurpData)}
          autoPlay={true}
        />
      )}
    </>
  );
};

export default InstaStoryWidget;
