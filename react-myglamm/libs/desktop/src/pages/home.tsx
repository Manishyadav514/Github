import React from "react";

import useHomeOnMount from "@libHooks/useHome";

import { getHomeInitialProps } from "@libUtils/homeUtils";

import HomeHead from "@libComponents/Homepage/HomeHead";

import { SHOP } from "@libConstants/SHOP.constant";

import Widgets from "../Components/home/Widgets";
import BrandStory from "../Components/home/brand-story";
import STBBrandStory from "../Components/home/stb-brand-story";

const Home = ({ homeWidgets, slug }: { slug: string; homeWidgets: any[] }) => {
  useHomeOnMount(homeWidgets);

  return (
    <main>
      <HomeHead />

      <Widgets widgets={homeWidgets} slugOrId={slug} />

      {SHOP.SITE_CODE === "mgp" && <BrandStory />}
      {SHOP.SITE_CODE === "stb" && <STBBrandStory />}
    </main>
  );
};

Home.getInitialProps = getHomeInitialProps;

export default Home;
