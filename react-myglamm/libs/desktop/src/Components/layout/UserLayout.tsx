import React, { Fragment, ReactElement, useEffect } from "react";
import dynamic from "next/dynamic";

import { ValtioStore } from "@typesLib/ValtioStore";

import { SHOW_LOGIN_MODAL } from "@libStore/valtioStore";

import { useSelector } from "@libHooks/useValtioSelector";

import LoadSpinner from "@libComponents/Common/LoadSpinner";

import Layout from "./layout";
import Breadcrumbs from "../breadcrumb";

const UserSideLayout = dynamic(() => import("../user/UserSideLayout"), { ssr: false });

interface UserLayProps {
  children: ReactElement;
  header: string;
}

const UserLayout = ({ children, header }: UserLayProps) => {
  const { userProfile } = useSelector((store: ValtioStore) => store.userReducer);

  useEffect(() => {
    if (!userProfile?.id) SHOW_LOGIN_MODAL({ show: true }); // Loggined user only
  }, []);

  return (
    <Layout>
      <main className="bg-white">
        <div className="max-w-screen-xl mx-auto px-16">
          <Breadcrumbs navData={[{ name: header }]} />

          {userProfile?.id ? (
            <UserSideLayout children={children} />
          ) : (
            <div className="w-screen relative h-96">
              <LoadSpinner />
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default UserLayout;
