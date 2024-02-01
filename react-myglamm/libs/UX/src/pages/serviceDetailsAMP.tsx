import Head from "next/head";
import React, { ReactElement } from "react";
import ServiceDetailsAMPCarousel from "@libComponents/AMP/ServiceDetailsAMPCarousel";
import ServiceDetailsCommentList from "@libComponents/AMP/ServiceDetailsCommentList";
import ServiceDetailsOverview from "@libComponents/AMP/ServiceDetailsOverview";
import { useRouter } from "next/router";
import ServiceDetailsAPI from "@libAPI/apis/ServiceDetailsAPI";
import ServiceDetailAMPLayout from "@libLayouts/ServiceDetailAMPLayout";
import ampStyle from "@libComponents/AMP/AMPStyle";

import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const ServiceDetailsAMP = ({ data, url }: any) => {
  const router = useRouter();

  const { overview, comments } = data;

  const showComments = router.asPath.includes("reviews.amp");
  const { images, name, cityName, location, subCatId, slug } = overview.data[0];
  const { service_category } = overview.relationalData;
  const subCatName = service_category?.[subCatId?.[0]]?.name || "";
  const subCatSlug = service_category?.[subCatId?.[0]]?.slug || "";

  return (
    <>
      <Head>
        <script async src="https://cdn.ampproject.org/v0.js" />
        <script async custom-element="amp-sidebar" src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js" />
        <script async custom-element="amp-accordion" src="https://cdn.ampproject.org/v0/amp-accordion-0.1.js" />
        <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js" />
        <script async custom-element="amp-fit-text" src="https://cdn.ampproject.org/v0/amp-fit-text-0.1.js" />
        <link rel="canonical" href={url.replace(".amp", "")} />
      </Head>
      <main>
        <ServiceDetailsAMPCarousel images={images} />
        <section>
          <h1>{name}</h1>
          <p>
            {location}, {cityName}
          </p>
          <p>
            <a href={`/${cityName?.replace(/ /g, "-").toLowerCase()}/${subCatSlug}`} title={name} aria-label={subCatName}>
              {subCatName}
            </a>
          </p>
        </section>
        <Tabs link={slug} />
        <section>
          {showComments ? <ServiceDetailsCommentList comments={comments} /> : <ServiceDetailsOverview data={overview} />}
        </section>
        <style amp-custom jsx>
          {ampStyle}
        </style>
      </main>
    </>
  );
};

const Tabs = ({ link }: any) => {
  return (
    <ul className="tabs">
      <li>
        <h2>
          <a href={`${link}.amp.html`} aria-label="OverView">
            OverView
          </a>
        </h2>
      </li>
      <li>
        <h2>
          <a href={`${link}/reviews.amp.html`} aria-label="Reviews">
            Reviews
          </a>
        </h2>
      </li>
    </ul>
  );
};

ServiceDetailsAMP.getLayout = (page: ReactElement) => <ServiceDetailAMPLayout>{page}</ServiceDetailAMPLayout>;

ServiceDetailsAMP.getInitialProps = async (ctx: any) => {
  try {
    const showComments = ctx.req.url.includes("reviews");
    const response: any = { overview: null, comments: [] };
    const serviceDetailsData = new ServiceDetailsAPI();
    const { city, slug } = ctx.query;
    const slugName = `/${city}/${slug.split(".")[0]}`;
    const res = await serviceDetailsData.getServiceDetailsData(slugName);

    if (!res.data?.data?.data?.[0]) {
      ctx.res.statusCode = 404;
      ctx.res.write("Page Not Found");
      return ctx.res.end();
    }

    response.overview = res.data.data;
    const entitiId = response.overview?.data?.[0].id;

    if (showComments) {
      const result = await serviceDetailsData.getServiceDetailsComments(entitiId);
      response.comments = result.data.data;
    }

    const url = `${GBC_ENV.NEXT_PUBLIC_DOMAIN_URL}${ctx.req.url}`;

    return {
      data: response,
      url,
    };
  } catch (err) {
    console.log("err", err);
    ctx.res.statusCode = 404;
    ctx.res.write("Page Not Found");
    return ctx.res.end();
  }
};

export default ServiceDetailsAMP;
