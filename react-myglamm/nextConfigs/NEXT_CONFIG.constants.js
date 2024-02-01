const IMAGES_CONFIG = {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "files.*.com",
    },
    {
      protocol: "https",
      hostname: "s3.*-south-1.amazonaws.com",
    },
    {
      protocol: "https",
      hostname: "**youtu.be",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**img-static.popxo.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**files.organicharvest.in",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**wpcf.babychakra.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**wpcf-babychakra-com-develop.go-vip.net",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**bbc-wp-staging.s3.ap-south-1.amazonaws.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**cdn-df.babychakra.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**secure.gravatar.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**cdn-sp.babychakra.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**youtu.be",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**stbotanica.g3sandbox.dev",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**blog.stbotanica.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "**g3prodmepublic.blob.core.windows.net",
      pathname: "/**",
    },
  ],
};

const REWRITE_CONFIG = [
  {
    source: "/ls",
    destination: "/api/ls",
  },
  {
    source: "/:city/:slug/amp.html",
    destination: "/serviceDetailsAMP",
  },
  {
    source: "/:city/:slug.amp.html",
    destination: "/serviceDetailsAMP",
  },
  {
    source: "/:city/:slug/reviews.amp.html",
    destination: "/serviceDetailsAMP",
  },
];

const REDIRECT_CONFIG = [
  {
    source: "/glammstudio/:category/:blog",
    destination: "/glammstudio/:blog",
    permanent: true,
  },
  {
    source: "/amp/glammstudio/:category/:blog",
    destination: "/amp/glammstudio/:blog",
    permanent: true,
  },
  {
    source: "/amp/blog/:category/:blog",
    destination: "/amp/blog/:blog",
    permanent: true,
  },
  {
    source: "/blog/:category/:blog",
    destination: "/blog/:blog",
    permanent: true,
  },
  {
    source: "/community",
    destination: "/community/feed",
    permanent: true,
  },
  {
    source: "/community/feedpost/:id/:slug",
    destination: "/community/posts/:slug",
    permanent: true,
  },
  {
    source: "/community/question/:id/:slug",
    destination: "/community/questions/:slug",
    permanent: true,
  },
  {
    source: "/topic/:slug",
    destination: "/community/topics/:slug",
    permanent: true,
  },
  {
    source: "/community/hashtags/:slug",
    destination: "/community/tags/:slug",
    permanent: true,
  },
  {
    source: "/user/:slug",
    destination: "/community/feed",
    permanent: false,
  },
  {
    source: "/home",
    destination: "/",
    permanent: true,
  },
  {
    source: "/ia/:slug",
    destination: "/learn/:slug",
    permanent: true,
  },
];

module.exports = { IMAGES_CONFIG, REDIRECT_CONFIG, REWRITE_CONFIG };
