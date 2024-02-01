import React, { useEffect, ReactElement } from "react";
import getVideoId from "get-video-id";
import { useSelector } from "@libHooks/useValtioSelector";
import Head from "next/head";
import { useAmp } from "next/amp";
import parse, { domToReact } from "html-react-parser";
import format from "date-fns/format";
import { decodeHtml } from "@libUtils/decodeHtml";
import { logURI } from "@libUtils/debug";
import Adobe from "@libUtils/analytics/adobe";
import { ADOBE } from "@libConstants/Analytics.constant";
import PageAPI from "@libAPI/apis/PageAPI";
import ProductAPI from "@libAPI/apis/ProductAPI";
import AmpBlogProducts from "@libComponents/Blogs/AmpBlogProducts";
import AMPLayout from "@libLayouts/AMPLayout";
import AmpBlogFooter from "@libComponents/AMP/AMPBlogFooter";
import { ValtioStore } from "@typesLib/ValtioStore";
import { SHOP } from "@libConstants/SHOP.constant";
import { formatPrice } from "@libUtils/format/formatPrice";
import { DEFAULT_IMG_PATH } from "@libConstants/COMMON.constant";
import ErrorComponent from "@libPages/_error";
import Link from "next/link";
import Footer from "@libComponents/Footer/Footer";
import STBFooter from "@libComponents/Footer/STBFooter";
import WidgetAPI from "@libAPI/apis/WidgetAPI";
import BlogSharePlatforms from "@libComponents/Blogs/BlogShare";
import useTranslation from "@libHooks/useTranslation";
import { replaceHref as BlogReplaceHref } from "@libComponents/Blogs/BlogBody";
import { BASE_URL } from "@libConstants/COMMON.constant";
import isDomainLink from "@libUtils/isDomainLink";
import { ORGANIZATION_SCHEMA } from "@libConstants/Schema.constant";
import { getVendorCode } from "@libUtils/getAPIParams";
import { GBC_ENV } from "@libConstants/GBC_ENV.constant";

const DATEFORMAT = "do MMM, yyyy";

const convertStylesStringToObject = (stringStyles: any) => {
  return stringStyles && typeof stringStyles === "string"
    ? stringStyles.split(";").reduce((acc, style) => {
        const colonPosition = style.indexOf(":");

        if (colonPosition === -1) {
          return acc;
        }
        const camelCaseProperty = style
            .substr(0, colonPosition)
            .trim()
            .replace(/^-ms-/, "ms-")
            .replace(/-./g, c => c.substr(1).toUpperCase()),
          value = style.substr(colonPosition + 1).trim();

        return value ? { ...acc, [camelCaseProperty]: value, height: "100%" } : acc;
      }, {})
    : {};
};

const BlogPages = ({ query, blog, categoryName, products, errorCode, mostPopular, latestArticles }: any) => {
  const content = blog.data[0];
  const description = decodeHtml(content?.cms[0]?.content?.longDescription, {
    stripSlash: true,
  });

  const editorData = content?.editorData?.cms[0];

  const profile = useSelector((store: ValtioStore) => store.userReducer.userProfile);

  const image = content?.assets?.find((a: any) => a.type === "image");
  const video = content?.assets?.find((a: any) => a.type === "video");

  const { category, blogs } = query;

  const isAmp = useAmp();

  const { t } = useTranslation();

  const { categoryId } = blog.data[0];
  const header = blog.relationalData.categoryId[categoryId]?.cms[0]?.content.name;
  const categorySlug = blog?.data[0]?.navigation?.[1]?.slug?.split("/")[2] || categoryName;

  // Adobe Analytics[38] - Page Load - glammstudio/blog category
  useEffect(() => {
    const ddlProducts: any[] = [];
    if (products?.length > 0) {
      const prepareProductsDatalayer = async () => {
        products.forEach((product: any) => {
          let ddlPWP = "";
          let ddlProductOfferPrice = 0;
          let ddlProductPrice = 0;
          let ddlProductDiscountedPrice = 0;

          if (product.freeProducts) {
            // prepare PWP string.
            product.freeProducts.forEach((freeProduct: any) => {
              if (product.freeProducts.length === 1) {
                ddlPWP = freeProduct.productTag;
              } else {
                ddlPWP = "{< category name of the product>}";
              }
            });
          }

          // prepare product price & offer price x quantity
          ddlProductOfferPrice = formatPrice(product.offerPrice) as number;
          ddlProductPrice = formatPrice(product.price) as number;
          ddlProductDiscountedPrice = parseFloat((ddlProductPrice - ddlProductOfferPrice).toString());

          //
          ddlProducts.push({
            productSKU: product.sku,
            productOfferPrice: ddlProductOfferPrice,
            productPrice: ddlProductPrice,
            productDiscountedPrice: ddlProductDiscountedPrice,
            productRating: "",
            productTotalRating: "",
            stockStatus: product.inStock ? "in stock" : "out of stock",
            isPreOrder: product.productMeta.isPreOrder ? "yes" : "no",
            PWP: ddlPWP,
            hasTryOn: "no",
          });
        });
      };
      prepareProductsDatalayer();
    }
    (window as any).digitalData = {
      common: {
        pageName: `web|glammstudio|${blog?.data[0]?.cms[0]?.content?.name}`,
        newPageName: "blog detail",
        subSection: `${header}`,
        assetType: "Blog",
        newAssetType: "content",
        platform: ADOBE.PLATFORM,
        pageLocation: "",
        technology: ADOBE.TECHNOLOGY,
      },
      user: Adobe.getUserDetails(profile),
      blog: {
        blogName: `${blog?.data[0]?.cms[0]?.content?.name}`,
        blogCategory: `${header}`,
        product: ddlProducts,
      },
    };
    Adobe.PageLoad();
  }, []);

  const fixIframeURL = (url: any) => {
    const res = url.match(/(?<y>.*)(?<x>youtube.*)/);
    if (res?.groups?.x) {
      return `https://www.${res.groups?.x}`;
    }
    return null;
  };

  // <------------- Article schema for AMP blogs ---------------->
  const orgSchema = ORGANIZATION_SCHEMA[getVendorCode()];
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL()}/glammstudio/${category}/${blogs}`,
    },
    headline: content?.cms[0]?.content?.title,
    image: image?.url,
    author: {
      "@type": "Person",
      name: orgSchema?.name || "MyGlamm",
    },
    publisher: {
      "@type": "Organization",
      name: orgSchema?.name || "MyGlamm",
      logo: {
        "@type": "ImageObject",
        url: `${SHOP.LOGO}`,
      },
    },
    datePublished: content.publishDate,
    dateModified: content.updatedAt,
  };

  /** Breadcrumb Schema */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}`,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categorySlug,
        item: `${BASE_URL()}${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${categorySlug || ""}`,
      },
    ],
  };

  const replaceHref = {
    replace: ({ name, attribs, children }: any) => {
      if (["gwmw", "g", "path"].includes(name)) {
        return <span>{domToReact(children, replaceHref)}</span>;
      }
      if (name == "h1") {
        return <h1>{domToReact(children, replaceHref)}</h1>;
      }
      if (name == "h2") {
        return <h2>{domToReact(children, replaceHref)}</h2>;
      }
      if (name == "h3") {
        return <h3>{domToReact(children, replaceHref)}</h3>;
      }
      if (name == "h4") {
        return <h4>{domToReact(children, replaceHref)}</h4>;
      }
      if (name == "p") {
        return <p>{domToReact(children, replaceHref)}</p>;
      }
      if (name == "br") {
        return <></>;
      }
      if (name == "span") {
        if (children[0]?.type !== "tag" && !children[0]?.data?.trim().length) {
          return <></>;
        }
        return <span>{domToReact(children, replaceHref)}</span>;
      }
      if (name == "ol") {
        return <ol>{domToReact(children, replaceHref)}</ol>;
      }
      if (name == "ul") {
        return <ul>{domToReact(children, replaceHref)}</ul>;
      }
      if (name == "li") {
        return <li>{domToReact(children, replaceHref)}</li>;
      }
      if (name == "b") {
        if (!children[0]?.data?.trim().length) {
          return <></>;
        }
        return <b>{domToReact(children, replaceHref)}</b>;
      }
      if (name == "img") {
        const { style, caption, ..._attribs } = attribs;
        if (!attribs.src?.length) return <></>;
        return (
          <>
            <img {..._attribs} loading="lazy" />
          </>
        );
      }
      if (name === "a" && attribs["href"]) {
        if (!isDomainLink(attribs["href"])) {
          return (
            <a rel="nofollow" href={attribs.href}>
              {domToReact(children, replaceHref)}
            </a>
          );
        } else {
          return <a href={attribs.href}>{domToReact(children, replaceHref)}</a>;
        }
      }
      if (name === "script" && (attribs.src.includes("instagram") || attribs.src.includes("pinterest"))) {
        return <></>;
      }
      if (name === "blockquote") {
        if (attribs.class?.includes("instagram-media")) {
          const instaID = attribs["data-instgrm-permalink"]?.split("/")[4];
          return (
            <amp-instagram
              width={400}
              height={400}
              data-captioned
              layout="responsive"
              key={instaID || ""}
              data-shortcode={instaID || ""}
            />
          );
        }
      }
      if (name === "colgroup") {
        return <></>;
      }
      if (name === "iframe") {
        if (attribs?.src?.includes("youtu")) {
          const videoId = getVideoId(attribs?.src || "");
          if (!videoId.id) return <></>;
          return (
            <div className="mx-auto flex justify-center py-4">
              <amp-youtube data-videoid={videoId.id} height="16rem" layout="fixed-height" />
            </div>
          );
        } else if (!attribs?.src?.length) {
          return <></>;
        } else {
          return (
            <div className="mx-auto flex justify-center py-4">
              <amp-iframe
                width={attribs.width || 300}
                height={attribs.height || 300}
                sandbox="allow-scripts allow-same-origin allow-popups"
                layout="responsive"
                frameborder="0"
                src={attribs.src}
              />
            </div>
          );
        }
      }
      if (name === "img") {
        // eslint-disable-next-line no-param-reassign
        delete attribs.caption;
        delete attribs.loading;
        const styleString = attribs.style;
        delete attribs.style;
        const styleObj = convertStylesStringToObject(styleString);

        return (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <amp-img {...attribs} style={styleObj} layout="responsive" width="100" height="55">
            {domToReact(children, replaceHref)}
          </amp-img>
        );
      }
      if (name === "a") {
        if (attribs["type"]?.length > 0) {
          delete attribs.type;
          return <a {...attribs}>{domToReact(children, replaceHref)}</a>;
        }
        if (attribs["data-pin-do"]?.length > 0) {
          return (
            <div className="mx-auto flex justify-center py-4">
              <amp-pinterest width="300" height="400" data-do="embedPin" data-url={attribs.href}></amp-pinterest>
            </div>
          );
        }
      }
      if (attribs?.class?.includes("ginger")) {
        return <></>;
      }
      return null;
    },
  };

  if (errorCode) {
    return <ErrorComponent statusCode={errorCode} />;
  }

  const getHtmlContent = () => {
    if (!editorData) {
      return (
        <div className="bg-white pb-4">
          {isAmp && <div className="w-full text-sm prose prose-sm bg-white Blogs">{parse(description, replaceHref)}</div>}
        </div>
      );
    }

    return editorData.map((data: any) => {
      if (data.identifier === "html-editor") {
        return (
          <div className="pb-4">
            {isAmp && (
              <div className="w-full text-sm prose prose-sm bg-white Blogs">{parse(data.description, replaceHref)}</div>
            )}
          </div>
        );
      }

      if (data.identifier === "products") {
        return <AmpBlogProducts descriptionData={data.descriptionData} />;
      }

      return "";
    });
  };
  const subdomain = process.env.NEXT_PUBLIC_AMP_ANALYTICS_SUBDOMAIN;
  const canonicalURL = `${GBC_ENV.NEXT_PUBLIC_CANONICAL_BASE_URL}${content?.urlManager.url}`;
  const iframeMessage = `https://${subdomain}/amp-adobe.html?pageURL=${encodeURIComponent(canonicalURL)}`;

  return (
    <React.Fragment>
      <Head>
        <title key="title">{content?.cms[0]?.metadata?.title || content?.cms[0]?.content?.title || "title"}</title>
        <meta
          key="description"
          name="description"
          content={
            content?.cms[0]?.content?.shortDescription ||
            content?.cms[0]?.metadata?.description ||
            content?.cms[0]?.content?.longDescription?.slice(0, 299) ||
            "description"
          }
        />
        <meta key="keywords" name="keywords" content={content?.cms[0]?.metadata?.keywords} />
        <link key="canonical" rel="canonical" href={content?.cms[0]?.metadata?.canonicalTag || canonicalURL} />
        <script
          async
          key="amp-analytics"
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        />

        <script
          async
          key="amp-analytics"
          custom-element="amp-analytics"
          src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
        />
        <script async key="amp-iframe" custom-element="amp-iframe" src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js" />
        <script async custom-element="amp-youtube" src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js" />

        <script async custom-element="amp-instagram" src="https://cdn.ampproject.org/v0/amp-instagram-0.1.js" />

        <script async custom-element="amp-twitter" src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      {/* Article - SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      {/* Breadcrumb - SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <amp-analytics type="adobeanalytics_nativeConfig">
        <script
          type="application/json"
          dangerouslySetInnerHTML={{
            __html: `
                    {
                      "requests": {
                      "iframeMessage": "${iframeMessage}"
                    },
                    "extraUrlParams": {
                        "pageLocation": "article ampstory page",
                        "pageName": "mobile website|article ampstory|detail page",
                        "newPageName": "article ampstory page",
                        "newAssetType": "article ampstory page",
                        "assetType": "article ampstory page",
                        "subSection": "article ampstory detail page"
                    }
                  }
                `,
          }}
        />
      </amp-analytics>

      <main className="min-h-screen bg-white">
        <div className="px-4">
          <div className="flex bg-white w-full pb-2 pt-4">
            <div className="flex text-xs items-center w-11/12" role="list">
              <Link href="/" role="listitem" aria-label="home">
                HOME
              </Link>
              &nbsp;/&nbsp;
              <Link
                href={SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}
                className="uppercase"
                role="listitem"
                aria-label={SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}
              >
                {SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}
              </Link>
              &nbsp;/&nbsp;
              <Link
                href={`${SHOP.IS_MYGLAMM ? "/glammstudio" : "/blog"}/${categorySlug}`}
                className="uppercase truncate"
                role="listitem"
                aria-label={`${header}`}
              >
                {`${header}`}
              </Link>
            </div>
          </div>

          <h1 className="text-xl leading-tight pb-4">{content?.cms[0]?.content?.title}</h1>
          {content?.publishDate && (
            <div className="flex bg-white pb-3 text-xs w-full items-center justify-between text-gray-600">
              <div>{format(new Date(content?.publishDate), DATEFORMAT)}</div>
            </div>
          )}
        </div>
        {/* Header & Title */}
        {isAmp && (
          <div className="pb-2 i-amphtml-sizer-intrinsic">
            {image && (
              <amp-img
                data-hero
                src={image?.imageUrl?.["768x432"] || DEFAULT_IMG_PATH()}
                alt={image?.properties?.altText || image?.name}
                width="768"
                height="432"
                layout="responsive"
              />
            )}
            {(() => {
              const videoId = getVideoId(video?.properties?.videoId || "");
              if (!videoId.id) return <></>;
              return <amp-youtube data-videoid={videoId.id} height="16rem" layout="fixed-height" />;
            })()}
          </div>
        )}

        {/* HTML Content  */}
        <div className="px-4">{getHtmlContent()}</div>

        <BlogSharePlatforms
          blogName={content?.cms[0]?.content?.name}
          shortUrl={content?.urlShortner?.shortUrl}
          shortUrlSlug={content?.urlShortner?.slug}
        />
        {SHOP.SITE_CODE === "mgp" && (
          <>
            <AmpBlogFooter title="Most Popular" items={mostPopular?.commonDetails?.descriptionData[0]?.value} />
            <AmpBlogFooter title="Latest Articles" items={latestArticles?.commonDetails?.descriptionData[0]?.value} />
          </>
        )}

        {/* Product List */}
        {products?.length > 0 && (
          <div className=" bg-white mt-4">
            <div className="flex items-center justify-center">
              <h3 className="text-xl font-bold leading-tight tracking-none text-center my-4">PRODUCTS USED</h3>
            </div>
            {products.map((product: any) => {
              const img = product.assets?.find((a: any) => a.type === "image");
              return (
                <div key={product.id} className="m-2 py-2 bg-white" style={{ boxShadow: "0 0 12px rgba(0,0,0,.2)" }}>
                  <div className="flex h-32 p-3">
                    <div className=" i-amphtml-sizer-intrinsic">
                      {isAmp && (
                        <amp-img
                          width="100"
                          height="100"
                          className="h-20"
                          style={{ maxHeight: "135px" }}
                          src={img?.imageUrl["400x400"] || DEFAULT_IMG_PATH()}
                          alt={img?.name}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold uppercase leading-tight" style={{ padding: "0px 15px" }}>
                        {product?.cms[0]?.content?.name}
                      </h3>
                      {product.price > product.offerPrice ? (
                        <div className="flex w-full p-4">
                          <h1 className="font-bold text-sm mr-1">{formatPrice(product.offerPrice, true)}</h1>
                          <h1 className="font-bold text-xs line-through mt-0.5 mr-0.5 text-gray-400">
                            {formatPrice(product.price, true)}
                          </h1>
                        </div>
                      ) : (
                        <div className="flex flex-start items-center w-full">
                          <h1 className="font-bold text-sm p-4">{formatPrice(product.offerPrice, true)}</h1>
                        </div>
                      )}
                    </div>
                  </div>
                  {isAmp && (
                    <div className="p-3 flex justify-center items-center font-bold w-full mx-auto rounded">
                      <Link
                        href={product?.urlShortner?.slug}
                        style={{
                          border: "solid 1px black",
                          borderRadius: "2px",
                          padding: "0.3rem 2rem",
                        }}
                        className="font-bold inline-block border border-black px-8 py-1 "
                        aria-label={!product?.inStock ? t("notifyMe") : t("addToBag")}
                      >
                        {!product?.inStock ? t("notifyMe") : t("addToBag")}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isAmp && (
          <amp-lightbox id="amp-share-and-earn" layout="nodisplay" animate-in="fly-in-bottom">
            <div
              style={{
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
              role="button"
              tabIndex={-1}
              // @ts-ignore
              on="tap:amp-share-and-earn.close"
            >
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "250px",
                  width: "100%",
                  background:
                    "url(https://files.myglamm.com/site-images/original/share-gift-icon_1.png) no-repeat #FFF 16px/64px",
                  borderRadius: ".9rem .9rem 0 0",
                  padding: "1rem",
                }}
              >
                <div
                  className="w-3/4 mb-3 mt-3 ml-2 text-left text-lg pb-5 leading-tight"
                  style={{
                    width: "60%",
                    margin: "0.75rem 0.5rem",
                    paddingBottom: "1.25rem",
                    textAlign: "left",
                    lineHeight: 1.25,
                    fontSize: "1.125rem",
                  }}
                >
                  Whatever your friend buys you get free
                </div>
                <amp-img
                  width="100"
                  height="100"
                  src="https://files.myglamm.com/images/static/share-bottomsheet/shareBanner.png"
                  alt="Free makeup worth ₹500 when your friend shops"
                  className="absolute -mt-12 top-0 right-0"
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    marginTop: "-3rem",
                  }}
                />
                <p
                  style={{
                    display: "block",
                  }}
                >
                  Oops! Unfortunately Share and Earn isn&apos;t available on AMP powered pages, Please Visit original Page.
                </p>
                <a
                  style={{
                    background: "linear-gradient(225deg,#00dcc0 0,#005af0 75%)",
                    color: "#fff",
                    display: "block",
                    width: "12rem",
                    margin: "1rem auto",
                    padding: "0.5rem 1rem",
                    textAlign: "center",
                  }}
                  href={content.urlManager.url}
                  aria-label="Visit Original Page"
                >
                  Visit Original Page
                </a>
              </div>
            </div>
          </amp-lightbox>
        )}
        {SHOP.SITE_CODE === "stb" ? <STBFooter /> : <Footer />}
      </main>
    </React.Fragment>
  );
};

BlogPages.getLayout = (children: ReactElement) => <AMPLayout>{children}</AMPLayout>;

BlogPages.getInitialProps = async (ctx: any) => {
  const { blogs } = ctx.query;
  try {
    const pageApi = new PageAPI();

    const productApi = new ProductAPI();

    const where = {
      categoryId: `/${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${blogs}`,
    };
    const blog = await pageApi.getPage(0, where);

    if (blog.data.data.data?.length === 0) {
      logURI(ctx.asPath);
      if (ctx.res) {
        ctx.res.statusCode = 404;
        return ctx.res.end("Not Found");
      }

      return {
        errorCode: 404,
      };
    }

    let products: any;

    if (blog.data.data.data[0].products?.length > 0) {
      const productWhere = {
        id: {
          inq: blog.data.data.data[0].products,
        },
      };
      products = await productApi.getProduct(productWhere);
    }

    const widgetApi = new WidgetAPI();

    /* Extracting Parent Category Name(Blog) */
    const categoryId = blog.data.data.data[0]?.categoryId;
    const categoryName = blog.data.data.relationalData?.categoryId[categoryId]?.cms[0]?.content.name.toLowerCase();

    const promiseArray = [
      widgetApi.getWidgets({
        where: {
          slugOrId: "mobile-site-blog-related",
          name: "customPage",
          items: `${SHOP.IS_MYGLAMM ? "glammstudio" : "blog"}/${encodeURIComponent(categoryName)}`,
        },
      }),
    ];

    /* Related Blogs(Widget) and Products Call if Any available */
    const [relatedBlogs, relatedProducts]: any = await Promise.allSettled(promiseArray);
    const relatedBlogWidget = relatedBlogs.value?.data?.data?.data?.widget;

    /* Get Type of Related Widget Blogs */
    const getWidgetByType = (type: string) =>
      relatedBlogWidget?.find((x: any) => JSON.parse(x.meta.widgetMeta || "{}").type === type);

    return {
      query: ctx.query,
      blog: blog.data.data,
      products: products?.data?.data?.data,
      productRelationalData: products?.data?.data?.relationalData,
      mostPopular: getWidgetByType("popular"),
      latestArticles: getWidgetByType("latest"),
      categoryName,
    };
  } catch (error: any) {
    logURI(ctx.asPath);
    if (ctx.res) {
      ctx.res.statusCode = 500;
      return ctx.res.end("Server Error");
    }

    return {
      errorCode: 404,
    };
  }
};

export default BlogPages;
