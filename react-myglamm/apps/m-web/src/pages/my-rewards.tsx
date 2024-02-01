import dynamic from "next/dynamic";
import { ReactElement } from "react";

import { SHOP } from "@libConstants/SHOP.constant";

import MyRewards from "@libPages/my-rewards";

import CustomLayout from "@libLayouts/CustomLayout";

import MyglammxoRewards from "./myglammxo-rewards";

const Layout = dynamic(() => import("@libLayouts/Layout" /* webpackChunkName: "DefaultLayout" */));

const MyRewardsPage = () => (SHOP.IS_MYGLAMM ? <MyRewards /> : <MyglammxoRewards />);

MyRewardsPage.getLayout = (page: ReactElement) => {
  if (SHOP.IS_MYGLAMM) {
    return <Layout>{page}</Layout>;
  }

  return (
    <CustomLayout header="My Rewards" fallback="My Rewards">
      {page}
    </CustomLayout>
  );
};

export default MyRewardsPage;
