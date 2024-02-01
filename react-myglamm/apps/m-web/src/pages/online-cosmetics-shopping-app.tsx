import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CustomLayout from "@libLayouts/CustomLayout";
import { formatPrice } from "@libUtils/format/formatPrice";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const AppInstall = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen">
      <Head>
        <meta
          key="description"
          name="description"
          content="Download the online cosmetic shopping App & get exclusive offers on makeup & beauty products online. Get 150 Off on your 1st purchase. Also, tell us what you want & get a free lipstick from MyGlamm."
        />
        <title key="title">Download Online Cosmetic Shopping App for Best Makeup & Beauty Product Offers - MyGlamm</title>
        <meta
          key="og:title"
          property="og:title"
          content="Download Online Cosmetic Shopping App for Best Makeup & Beauty Product
          Offers - MyGlamm"
        />
        <meta
          key="og:description"
          property="og:description"
          content="Download the online cosmetic shopping App & get exclusive offers on makeup & beauty products online. Get 150 Off on your 1st purchase. Also, tell us what you want & get a free lipstick from MyGlamm."
        />
        <link
          key="canonical"
          rel="canonical"
          href={`${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${router.asPath.split("?")[0]}`}
        />
      </Head>

      <div className="pb-8 py-2 bg-color2">
        <div className="py-8 px-4 flex justify-center">
          <div>
            <img src="https://files.myglamm.com/site-images/original/homescreen-iphone.png" alt="homescreen" />
          </div>
          <div>
            <img src="https://files.myglamm.com/site-images/original/tryon-iphone.png" alt="tryon screen" />
          </div>
        </div>
        <div className="bg-white w-full flex flex-col  -mt-36 pt-20 rounded-t-3xl">
          <div className="pl-6 pt-6">
            <p className="text-xl pb-1 uppercase font-bold">this is your chance to</p>
            <p className="text-4xl font-bold uppercase text-black pb-2">live glamorous</p>

            <ul className="mb-4 text-sm  mx-4 font-bold">
              <li className="mb-2">Get 150 off offer + coupon code</li>
              <li className="mb-2">Virtual Try on</li>
              <li className="mb-2">Communities</li>
              <li className="mb-2">myglammQUICKIES</li>
            </ul>
          </div>
          <div className="w-full flex flex-col bg-color2 rounded-t-3xl">
            <div className="mx-6 py-4">
              <p className="text-lg  pb-1 font-bold">Download the App now and get {formatPrice(300, true)} off</p>
              <p className="text-sm  pb-1">use coupon code </p>
              <div className="w-32 font-bold border-color1 text-xs bg-white px-1 py-2 text-center couponText uppercase  border border-pink border-dotted">
                APP599
              </div>
            </div>
            <div className="flex justify-between mx-6">
              <a
                href="https://myglamm.in/e27jJl7Ihib"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12"
                aria-label="Google Play"
              >
                <ImageComponent
                  delay={6000}
                  className="h-12 w-auto"
                  src="https://files.myglamm.com/site-images/original/ico-google-app.png"
                  alt="Google Play"
                />
              </a>
              <a
                href="https://myglamm.in/e27jJl7Ihib"
                target="_blank"
                rel="noopener noreferrer"
                className="h-12"
                aria-label="Appstore"
              >
                <ImageComponent
                  delay={6000}
                  alt="Appstore"
                  className="h-12 w-auto"
                  src="https://files.myglamm.com/site-images/original/ico-appstore.png"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

AppInstall.getLayout = (page: ReactElement) => (
  <CustomLayout header="downloadApp" fallback="Download App">
    {page}
  </CustomLayout>
);

export default AppInstall;
