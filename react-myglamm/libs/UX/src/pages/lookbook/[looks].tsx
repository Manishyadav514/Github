import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Ripples from "@libUtils/Ripples";
import { ErrorBoundary } from "react-error-boundary";

import Link from "next/link";
import { useRouter } from "next/router";

import { useSelector } from "@libHooks/useValtioSelector";

import LoadSpinner from "@libComponents/Common/LoadSpinner";
import LookBookHead from "@libComponents/Looks/LookBookHead";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import ErrorFallback from "@libComponents/ErrorBoundary/ErrorFallBack";

import WidgetAPI from "@libAPI/apis/WidgetAPI";

import { ValtioStore } from "@typesLib/ValtioStore";

import { getLookBookIntialProps } from "@libUtils/looksUtils";

import ErrorComponent from "../_error";

const LooksPanel = ({ subCategoryData }: any) => {
  const [items, setItems] = useState<{ id: string; data: Array<any> }>(subCategoryData);
  const [hasMore, setHasMore] = useState(subCategoryData.length >= 10);

  const widgetApi = new WidgetAPI();

  function fetchMore() {
    widgetApi.getLooksSubcategory(items.data[0].categoryId, items.data.length).then(({ data }: any) => {
      if (data.data.data.length === 0) {
        setHasMore(false);
      } else {
        setItems({
          id: items.data[0].categoryId,
          data: [...items.data, ...data.data.data],
        });
      }
    });
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <InfiniteScroll
        dataLength={items.data.length}
        loader={<LoadSpinner className="block mx-auto w-10 my-2" />}
        scrollThreshold="850px"
        hasMore={hasMore}
        next={fetchMore}
      >
        <div className="flex flex-wrap pt-2.5 px-4">
          {items.data.map((look: any) => {
            const images = look.assets?.find((asset: any) => asset.type === "image");

            return (
              <div className="w-1/2 p-0.5" key={look.id}>
                <Ripples>
                  <Link href={look.urlManager.url} aria-label={look.assets[0]?.name}>
                    <ImageComponent className="h-full w-full" alt={look.assets[0]?.name} src={images?.imageUrl?.["200x200"]} />
                  </Link>
                </Ripples>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </ErrorBoundary>
  );
};

function Looks({ parentCategory, errorCode }: any) {
  const { profile } = useSelector((store: ValtioStore) => ({
    profile: store.userReducer.userProfile,
  }));
  const widgetApi = new WidgetAPI();

  const [categoryData, setCategoryData] = useState<Array<any>>([]);
  const [subCategoryData, setSubCategoryData] = useState<any>();
  const [defaultTab, setDefaultTab] = useState(0);

  const router = useRouter();
  const RefArray: any = [];

  function getSubCategoryData(categoryId: string, id?: string) {
    widgetApi.getLooksSubcategory(categoryId).then(res => {
      setSubCategoryData({ id: id || categoryId, data: res.data.data.data });
    });
  }

  useEffect(() => {
    if (categoryData.length > 0) {
      let found = false;
      for (let i = 0; i < categoryData.length; i += 1) {
        if (categoryData[i].urlManager.url === router.asPath) {
          getSubCategoryData(categoryData[i].id);
          setDefaultTab(i);
          found = true;
          break;
        }
      }
      if (!found) {
        getSubCategoryData(categoryData[0].id);
        setDefaultTab(0);
      }
    }
  }, [categoryData]);

  useEffect(() => {
    if (parentCategory) {
      const data = parentCategory.data.filter((category: any) => category.parentId !== "0");
      setCategoryData(data);
    }
  }, [parentCategory]);

  useEffect(() => {
    if (subCategoryData && RefArray[defaultTab]) {
      RefArray[defaultTab].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }, [subCategoryData]);

  function handleTabSelect(index: any) {
    setSubCategoryData(undefined);
    const looks = categoryData[index].urlManager.url.split("/")[2];

    router.push(`/lookbook/[looks]?looks=${looks}`, categoryData[index].urlManager.url, {
      shallow: true,
    });

    setDefaultTab(index);
    getSubCategoryData(categoryData[index].id);

    if (RefArray[index]) {
      RefArray[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  }

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  return (
    <React.Fragment>
      {/* SEO */}
      <LookBookHead selectedCategory={categoryData[defaultTab]} />

      <section className="loobookPage w-full">
        {categoryData && (
          <>
            <div className="flex whitespace-nowrap overflow-y-hidden overflow-x-scroll pt-3 mx-4">
              {categoryData.map((category: any, index: number) => (
                <h1
                  aria-hidden
                  key={category.id}
                  ref={r => {
                    RefArray[index] = r;
                  }}
                  onClick={() => handleTabSelect(index)}
                  className={`capitalize text-sm mr-5 ${
                    defaultTab === index ? "border-b-3 border-color1 font-semibold" : "opacity-60"
                  }`}
                >
                  {category.cms[0]?.content.name || category.urlManager.url.split("/")[2]}
                </h1>
              ))}
            </div>

            {subCategoryData ? (
              <LooksPanel subCategoryData={subCategoryData} />
            ) : (
              <LoadSpinner className="w-16 mx-auto h-screen" />
            )}
          </>
        )}
      </section>
    </React.Fragment>
  );
}

Looks.getInitialProps = getLookBookIntialProps;

export default Looks;
