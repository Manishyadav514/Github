import React, { useState, useEffect, ReactElement } from "react";
import Head from "next/head";

import InfiniteScroll from "react-infinite-scroll-component";

import useWislist from "@libHooks/useWishlist";
import useTranslation from "@libHooks/useTranslation";

import { formatPrice } from "@libUtils/format/formatPrice";

import MoveToBag from "@libComponents/Wishlist/MoveToBag";
import ImageComponent from "@libComponents/Common/LazyLoadImage";
import EmptyWishlist from "@libComponents/Wishlist/EmptyWishlist";

import CustomLayout from "@libLayouts/CustomLayout";

import { ADOBE } from "@libConstants/Analytics.constant";

import { checkUserLoginStatus } from "@checkoutLib/Storage/HelperFunc";

import WishlistAPI from "@libAPI/apis/WishlistAPI";

import { CONFIG_REDUCER, ADOBE_REDUCER } from "@libStore/valtio/REDUX.store";

import Delete from "../../public/svg/delete.svg";

const Wishlist = () => {
  const { t } = useTranslation();
  const { removeProduct } = useWislist();
  const memberId = checkUserLoginStatus()?.memberId;

  const [wishlistProducts, setWishlistProducts] = useState<any>();
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!checkUserLoginStatus()) {
      setWishlistProducts([]);
    } else {
      getWishlist();
    }
  }, []);

  const getWishlist = (productIds?: any) => {
    if (memberId) {
      const wishlistApi = new WishlistAPI();
      wishlistApi
        .getWishlist(memberId, productIds, 0, wishlistProducts?.length || 10)
        .then(({ data: res }) => {
          if (res.data.data) {
            setWishlistProducts(res.data.data);
          } else {
            setWishlistProducts(undefined);
          }
        })
        .catch(() => setWishlistProducts([]));
    }
  };

  const fetchMore = () => {
    if (memberId) {
      const wishlistApi = new WishlistAPI();
      wishlistApi.getWishlist(memberId, undefined, wishlistProducts.length).then(({ data: res }) => {
        if (res.data.data.length) {
          setWishlistProducts([...wishlistProducts, ...res.data.data]);
        } else {
          setHasMore(false);
        }
      });
    }
  };

  const handleRemoveProduct = (productId: string) => {
    if (!(window as any).confirm("Are you sure you want to remove this product from your Wishlist?")) {
      return;
    }
    removeProduct(productId).then((res: any) => {
      if (res?.length) {
        getWishlist(res);
      } else {
        setWishlistProducts([]);
      }
    });
  };

  // Adobe Analytics[59] - Page Load - Home
  useEffect(() => {
    if (wishlistProducts?.length > 0) {
      const pageload = {
        common: {
          pageName: "web|wishlist summary page|my wishlist",
          newPageName: `my ${ADOBE.ASSET_TYPE.WISHLIST}`,
          subSection: ADOBE.ASSET_TYPE.WISHLIST,
          assetType: ADOBE.ASSET_TYPE.WISHLIST,
          newAssetType: ADOBE.ASSET_TYPE.WISHLIST,
          platform: ADOBE.PLATFORM,
          pageLocation: "",
          technology: ADOBE.TECHNOLOGY,
        },
      };

      ADOBE_REDUCER.adobePageLoadData = pageload;
    }
  }, [wishlistProducts]);

  if (wishlistProducts?.length) {
    return (
      <div className="p-2">
        <Head>
          <title>{t("myWishlist") || "My Wishlist"}</title>
        </Head>

        <InfiniteScroll
          dataLength={wishlistProducts.length || 0}
          next={fetchMore}
          hasMore={hasMore}
          loader
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>{t("yayYouHaveSeenItAll")}</b>
            </p>
          }
        >
          {wishlistProducts.map((product: any) => (
            <div className="bg-white mb-2 px-2 py-5 flex relative" key={product.productId}>
              <ImageComponent src={product.imageURL} className="h-16 w-16" alt={product.productName} />

              <div className="w-4/5 pl-2">
                <p className="text-sm font-semibold mb-1 w-11/12 truncate">{product.productName}</p>
                <p className="text-sm opacity-50 mb-1 w-11/12 truncate">{product.productSubTitle}</p>
                <span className="text-xxs font-semibold text-gray-600 uppercase">{product.shadeLabel || ""}</span>

                <div className="flex mt-5">
                  <div className="flex w-3/5 m-auto">
                    <span className="font-semibold mr-1">{formatPrice(product.priceOffer, true)}</span>
                    {product.priceOffer < product.priceMRP && (
                      <del className="text-xxs text-gray-500 mx-0 my-auto">{formatPrice(product.priceMRP, true)}</del>
                    )}
                  </div>
                  <MoveToBag product={product} type={product.isPreOrder ? 3 : 1} />
                </div>
              </div>

              <Delete
                className="absolute"
                style={{ right: "0.6rem", top: "1.2rem " }}
                onClick={() => handleRemoveProduct(product.productId)}
                role="img"
                aria-labelledby="remove from wishlist"
              />
            </div>
          ))}
        </InfiniteScroll>
      </div>
    );
  }
  if (wishlistProducts?.length === 0) {
    return <EmptyWishlist />;
  }
  return null;
};

Wishlist.getLayout = (page: ReactElement) => (
  <CustomLayout header="myWishlist" fallback="My Wishlist" showCart>
    {page}
  </CustomLayout>
);

export default Wishlist;
