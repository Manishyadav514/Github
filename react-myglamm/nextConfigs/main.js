/**
 * This webpack plugin automatically compiles modules loaded in web workers
 */
const { patchWebpackConfig } = require("./patchWebpackConfig");

const path = require("path");

const { IMAGES_CONFIG, REWRITE_CONFIG, REDIRECT_CONFIG } = require("./NEXT_CONFIG.constants");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  webpack: patchWebpackConfig(),

  /**
   * Hide the NextJS stack in header
   */
  poweredByHeader: false,

  distDir: `../../build/${process.env.NEXT_PUBLIC_ROOT}/.next`,

  /**
   * Enable React Strict Mode - enable incase deugging memory leak or something similar to that
   * https://reactjs.org/docs/strict-mode.html
   */
  reactStrictMode: false,

  /**
   * Multilingual Languages with Default Lang
   */
  i18n: {
    locales: JSON.parse(process.env.NEXT_PUBLIC_LOCALES || '["en-in"]'),
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en-in",
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  /**
   * Next's in-built Image Tag has Domain restriction to be specified
   * inside the array in form `Array of Strings(Domain)`
   */
  images: IMAGES_CONFIG,

  compiler: {
    removeConsole: process.env.DEV_MODE ? false : { exclude: ["error"] },
  },

  assetPrefix: process.env.NEXT_PUBLIC_REGION_CODE ? `/${process.env.NEXT_PUBLIC_REGION_CODE}` : "/",

  output: "standalone",

  experimental: { outputFileTracingRoot: path.join(__dirname, "../") },

  async rewrites() {
    return REWRITE_CONFIG;
  },

  async redirects() {
    return REDIRECT_CONFIG;
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:path*',
  //       headers: [
  //         // https://www.beskar.co/blog/next-hsts-preload
  //         // {
  //         //   key: 'Strict-Transport-Security',
  //         //   value: 'max-age=63072000; includeSubDomains; preload',
  //         // },
  //         // {
  //         //   key: 'X-Frame-Options',
  //         //   value: 'DENY',
  //         // },
  //         // TODO: remove unsafe-eval once gtm eval based loader is removed from the codebase
  //         // TODO: remove img-src data: scheme once all svgs are loaded from urls
  //         {
  //           key: 'Content-Security-Policy-Report-Only',
  //           value: "default-src *; img-src * blob: data:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; script-src-elem * 'unsafe-inline'; style-src-elem * 'unsafe-inline'; connect-src * properties:; font-src * data:; frame-ancestors 'none'; report-uri https://csp-report.browser-intake-datadoghq.com/api/v2/logs?dd-api-key=pub81ac031a6a92a85df40d73c05e0a7b95&dd-evp-origin=content-security-policy&ddsource=csp-report;",
  //         },
  //         // disabled because AppMeasurement.js mime type errors and fails to load
  //         // {
  //         //   key: 'X-Content-Type-Options',
  //         //   value: 'nosniff',
  //         // },
  //         /*
  //         This policy helps to protect sensitive information that might be in the URL of the page.
  //         When navigating or making requests within the same domain, the full URL can be shared,
  //         but when making requests to other domains,
  //         the path and query string are stripped out to preserve privacy.
  //         */

  //         // {
  //         //   key: 'Referrer-Policy',
  //         //   value: 'origin-when-cross-origin',
  //         // },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
