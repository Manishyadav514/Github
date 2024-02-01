import React, { useEffect, useState } from "react";

import Link from "next/link";
import { useInView } from "react-intersection-observer";

import { getLookBookIntialProps } from "@libUtils/looksUtils";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import useTranslation from "@libHooks/useTranslation";

import LookBookHead from "@libComponents/Looks/LookBookHead";

import Breadcrumbs from "../Components/breadcrumb";
import LookCard from "../Components/looks/lookCard";

const LookBook = ({ parentCategory }: any) => {
  const { t } = useTranslation();

  const subCategories = parentCategory?.data?.filter((x: any) => x.parentId !== "0");
  const selectedCategory = subCategories.find((x: any) => x.isSelected);

  const [subCategoryData, setSubCategoryData] = useState<any>();

  function getSubCategoryData(append = false) {
    const widgetApi = new WidgetAPI();

    widgetApi.getLooksSubcategory(selectedCategory?.id, append ? subCategoryData?.data?.length : 0).then(({ data: res }) => {
      setSubCategoryData({
        id: selectedCategory?.id,
        data: append ? [...(subCategoryData?.data || []), ...(res?.data?.data || [])] : res?.data?.data,
      });
    });
  }

  useEffect(() => {
    getSubCategoryData();
  }, [selectedCategory]);

  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) getSubCategoryData(true);
  }, [inView]);

  return (
    <main className="bg-white">
      <LookBookHead selectedCategory={selectedCategory} />

      <div className="bg-white max-w-screen-xl mx-auto px-16">
        <Breadcrumbs navData={[{ name: t("looks") || "looks" }]} />

        <div className="flex justify-between pt-6">
          <ul className="list-none w-1/4 pl-5 pr-4">
            <li className={`my-5 capitalize font-semibold`}>
              <Link href="/lookbook/looks">{t("looks") || "looks"}</Link>
            </li>

            {subCategories.map((cat: any) => (
              <li
                key={cat.id}
                className={`mb-3 capitalize ${selectedCategory?.id === cat.id ? "font-bold" : "hover:font-bold"}`}
              >
                <Link href={cat.urlManager.url}>{cat?.cms?.[0]?.content?.name}</Link>
              </li>
            ))}
          </ul>

          <section className="pr-8 pl-16">
            <h1 className="text-3xl text-center capitalize mb-6">{t("looks") || "looks"}</h1>

            <div className="grid grid-cols-2 gap-8">
              {subCategoryData?.data.map((look: any, index: number) => (
                <LookCard
                  look={look}
                  index={index}
                  key={look.id}
                  lookRef={index === subCategoryData?.data?.length - 7 ? ref : null}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

LookBook.getInitialProps = getLookBookIntialProps;

export default LookBook;
