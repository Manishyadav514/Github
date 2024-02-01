import React, { useEffect } from "react";
import parse from "html-react-parser";

import SmallGreyRect from "@libComponents/CommonBBC/SmallGreyRect";
import AuthorHeader from "@libComponents/CommonBBC/AuthorHeader";

import OtherReviewer from "@libComponents/article-details/OtherReviewer";
import ArticleDetailStyles from "@libComponents/article-details/ArticleDetailStyles";

import { GAgenericEvent } from "@libUtils/analytics/gtm";

import { ArticleDetailsContext } from "@libPages/learn/[slug]";
import BBCBlogHTMLCss from "@libComponents/CommonBBC/BBCBlogHTMLCss";
import { getLocalStorageValue } from "@libUtils/localStorage";

// import { dispatchTagManagerEvents } from "@analytics/EventManager";

const getModifiedHtml = (article: any, isXSeoTagPresent: any) => {
  const updatedHTML: any[] = [];
  /* Creating List of elements with anchor hreference to it child - TABLE OF CONTENTS */
  if (isXSeoTagPresent?.slug) {
    const TableJSX = (
      <div className="py-4 table-of-content">
        <h2 className="text-xl pb-2 ">Table of Contents</h2>
        <ol className="list-decimal list-inside">
          {article.map((ele: any) => {
            const { children } = ele.props?.children?.[0]?.props || ele.props?.children?.props || ele.props || {};
            if (ele.type === "h2" && typeof children === "string" && children.trim() !== "") {
              const id = children.split(" ").join("-").toLowerCase();
              updatedHTML.push({ ...ele, props: { ...ele.props, id } });
              return (
                <li className="pb-1 md:pb-2" key={ele.key}>
                  <a className="" href={`#${id}`} style={{ color: "#fc88b0" }}>
                    {children}
                  </a>
                </li>
              );
            }
            updatedHTML.push(ele);
            return null;
          })}
        </ol>
      </div>
    );

    updatedHTML.splice(2, 0, TableJSX);
    return updatedHTML;
  }

  return article;
};

const ArticleSection = () => {
  const articleDetailsInfo = React.useContext<any>(ArticleDetailsContext);
  const isXSeoTagPresent = articleDetailsInfo?.g3_extended_data?.terms?.post_tag?.find((tag: any) => tag.slug === "xseo");

  const onFeaturedCardCTAClick = (productObj: any) => {
    GAgenericEvent("commerce", "Featured Product CTA Clicked", JSON.stringify(productObj));
  };
  const onFeaturedCardClick = (productObj: any) => {
    GAgenericEvent("commerce", "Featured Product Clicked", JSON.stringify(productObj));
  };

  const onFeaturedCardTitleClick = (productObj: any) => {
    GAgenericEvent("commerce", "Featured Product Card Title Clicked", JSON.stringify(productObj));
  };

  const onRelativeCardClick = (productObj: any) => {
    GAgenericEvent("commerce", "Relative Product Clicked", JSON.stringify(productObj));
  };
  const onRelativeCardTitleClick = (productObj: any) => {
    GAgenericEvent("commerce", "Relative Product Card Title Clicked", JSON.stringify(productObj));
  };
  const onRelativeCardCTAClick = (productObj: any) => {
    GAgenericEvent("commerce", "Relative Product CTA Clicked", JSON.stringify(productObj));
  };

  const getProductObjFromElement = (event: any) => {
    const htmlElement = event?.target?.closest(".MyGlammXOProducts");
    const productObj = {
      productName: htmlElement?.dataset?.name,
    };
    return productObj;
  };

  useEffect(() => {
    // Add Product name every where
    const productCards = [...document.getElementsByClassName("productName")];
    productCards?.forEach(element => {
      const item = element.closest(".g3-products") || element.closest(".MyGlammXOProducts");
      if (item) {
        // @ts-ignore
        item.dataset.name = element?.dataset?.name;
      }
    });

    // only single card support
    const featuredCard = document?.getElementsByClassName("custom-1553tge")?.[0]; // featured card
    const relativeCards = [...document.getElementsByClassName("custom-yufudn")];

    const relativeCardCTA = [...document.getElementsByClassName("custom-wedk6d")];
    const featuredCardCTA = document?.getElementsByClassName("custom-5algia")?.[0];

    const featuredCardTitle = document?.getElementsByClassName("ml")?.[0];
    const relativeCardsTitle = [...document.getElementsByClassName("productName")];
    if (featuredCard) {
      featuredCard.addEventListener("click", event => {
        onFeaturedCardClick(getProductObjFromElement(event));
      });
    }
    if (featuredCardCTA) {
      featuredCardCTA.addEventListener("click", event => {
        onFeaturedCardCTAClick(getProductObjFromElement(event));
      });
    }
    if (featuredCardTitle) {
      featuredCardTitle.addEventListener("click", event => {
        onFeaturedCardTitleClick(getProductObjFromElement(event));
      });
    }
    if (relativeCards) {
      relativeCards.forEach(element => {
        element?.addEventListener("click", event => {
          onRelativeCardClick(getProductObjFromElement(event));
        });
      });
    }
    if (relativeCardCTA) {
      relativeCardCTA.forEach(element2 => {
        element2?.addEventListener("click", event => {
          onRelativeCardCTAClick(getProductObjFromElement(event));
        });
      });
    }

    if (relativeCardsTitle) {
      relativeCardsTitle.forEach(element2 => {
        if (!element2?.parentElement?.classList?.contains("ml")) {
          element2?.addEventListener("click", event => {
            onRelativeCardTitleClick(getProductObjFromElement(event));
          });
        }
      });
    }

    // There are only 2 type of cards as of now
    const relativeElements = [...document.getElementsByClassName("product-add-text")];
    const featuredElements = [...document.getElementsByClassName("product-add")];
    const productElements = [...relativeElements, ...featuredElements];
    if (productElements?.length > 0) {
      // Replacing this as this products cannot be added directly to cart(confirmed from Yasha Agnihotri);
      productElements?.map(e => {
        e.innerHTML = "Buy Now";
        return null;
      });
    }

    const productImages = document.querySelectorAll(".productImage");
    const imageObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const image = entry.target;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          image.src = image.dataset.src;
          imageObserver.unobserve(image);
        }
      });
    });

    productImages?.forEach(image => imageObserver.observe(image));
    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // imageObserver?.forEach((image) => imageObserver.unobserve(image));

      featuredCard?.removeEventListener("click", onFeaturedCardClick);
      featuredCardCTA?.removeEventListener("click", onFeaturedCardCTAClick);
      featuredCardTitle?.removeEventListener("click", onFeaturedCardTitleClick);

      relativeCards?.forEach(element => {
        element.removeEventListener("click", onRelativeCardClick);
      });

      relativeCardCTA?.forEach(element2 => {
        element2.removeEventListener("click", onRelativeCardCTAClick);
      });

      relativeCardsTitle?.forEach(element2 => {
        element2.removeEventListener("click", onRelativeCardTitleClick);
      });
    };
  }, []);

  useEffect(() => {
    // Event to send article detail to webengage (event name : Article Viewed)
    let memberID = "";
    if (localStorage.getItem("bbcUserProfile")) {
      const { data } = getLocalStorageValue("bbcUserProfile", true);
      memberID = data?.mg_member_id;
    }
    if (window?.dataLayer) {
      const data = {
        identity: memberID || "",
        userType: memberID ? "Member" : "Guest",
        commonData: {
          BBC_article_id: articleDetailsInfo?.id,
          BBC_article_name: articleDetailsInfo?.title?.rendered,
          BBC_article_author: articleDetailsInfo?.coauthors?.[0]?.display_name,
          BBC_article_category: articleDetailsInfo?._embedded?.["wp:term"]
            ?.flat()
            ?.filter((d: any) => d.taxonomy === "category")
            ?.map((e: any) => e.name)
            ?.join(","),
          BBC_User_details: memberID || "Guest",
        },
      };
      if (window?.dataLayer) {
        window.dataLayer.push({
          event: "Article Viewed Webengage",
          ...data,
          eventCallback: () => true,
        });
      }
    }
  }, []);
  const modifiedHtml = getModifiedHtml(parse(articleDetailsInfo?.content.rendered || ""), isXSeoTagPresent);

  return (
    <>
      <ArticleDetailStyles />
      <div className="px-3.5 py-5">
        <AuthorHeader authorDetails={articleDetailsInfo?.coauthors[0]} reviewerDetail={articleDetailsInfo?.reviewer} />
        <OtherReviewer authorDetails={articleDetailsInfo?.coauthors[0]} reviewerDetail={articleDetailsInfo?.reviewer} />

        <BBCBlogHTMLCss staticHtml={modifiedHtml} />
      </div>
      <SmallGreyRect />
    </>
  );
};

export default React.memo(ArticleSection);
