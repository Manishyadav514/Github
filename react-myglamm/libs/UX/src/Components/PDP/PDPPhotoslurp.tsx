import React, { useEffect, useState } from "react";
import { SLUG } from "@libConstants/Slug.constant";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import PhotoSlurp from "@libComponents/HomeWidgets/PhotoSlurp-homewidget";

function PDPPhotoslurp({ product }: any) {
  const [photoSlurp, setPhotoslurp] = useState<any>();

  useEffect(() => {
    const getPhotoSlurp = async () => {
      const pSwhere: any = {
        where: {
          slugOrId: SLUG().PDP_PHOTOSLURP_EN,
        },
      };
      const widgetApi = new WidgetAPI();
      const { data } = await widgetApi.getWidgets(pSwhere, 5, 0);
      setPhotoslurp(data?.data?.data?.widget);
    };
    window.requestIdleCallback(getPhotoSlurp);
  }, [product.id]);

  return <>{photoSlurp?.length > 0 ? <PhotoSlurp item={photoSlurp[0]} productSku={product.sku} /> : null}</>;
}

export default PDPPhotoslurp;
