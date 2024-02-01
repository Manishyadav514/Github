import React from "react";
import TopSellingWidgets from "@libComponents/SearchTopSellingWidgets/TopSellingWidgets";
import TopSearches from "@libComponents/Search/TopSearches";

const TopSellingWidgetsContainer = ({ topSellingWidgets, getData, searchQueries }: any) => (
  <section className="px-5">
    <TopSearches getData={getData} searchQueries={searchQueries} isGlammStudioPage={false} />
    {/* This will display search top selling  widgets */}
    {topSellingWidgets && <TopSellingWidgets widgets={topSellingWidgets} />}
  </section>
);

export default TopSellingWidgetsContainer;
