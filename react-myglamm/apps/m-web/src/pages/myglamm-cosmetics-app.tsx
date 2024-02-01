import React, { ReactElement } from "react";
import Head from "next/head";

import ImageComponent from "@libComponents/Common/LazyLoadImage";
import CustomLayout from "@libLayouts/CustomLayout";

const AppInstall = () => (
  <section className="min-h-screen">
    <Head>
      <meta name="robots" content="noindex" />
    </Head>

    <div className="bg-color2 mt-2">
      <div className="flex justify-center">
        <div>
          <a href="https://myglamm.in/y8SeSlBV3ib" target="_blank" rel="noreferrer" aria-label="download app">
            <img src="https://files.myglamm.com/site-images/original/downloadAppBanner.jpg" alt="homescreen" />
          </a>
        </div>
      </div>
      <div className="bg-white w-full flex flex-col">
        <div className="pl-6 pt-6">
          <p className="text-xl pb-1 uppercase font-bold">this is your chance to</p>
          <p className="text-4xl font-bold uppercase text-black pb-2">live glamorous</p>

          <ul className="mb-4 text-sm  mx-4 font-bold">
            <li className="mb-2">Fill a Survey and Get a Free Lipstick</li>
            <li className="mb-2">Virtual Try on</li>
            <li className="mb-2">Communities</li>
            <li className="mb-2">myglammQUICKIES</li>
          </ul>
        </div>
        <div className="bg-white w-full flex flex-col rounded-t-3xl">
          <div className="flex justify-between mx-6 py-6">
            <a
              href="https://myglamm.in/y8SeSlBV3ib"
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
            <a href="https://myglamm.in/y8SeSlBV3ib" target="_blank" rel="noopener noreferrer" className="h-12" aria-label="Appstore">
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

AppInstall.getLayout = (page: ReactElement) => (
  <CustomLayout header="downloadApp" fallback="Download App">
    {page}
  </CustomLayout>
);

export default AppInstall;
