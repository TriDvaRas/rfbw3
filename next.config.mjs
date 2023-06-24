await import("./src/env.mjs");
import { env } from "./src/env.mjs";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
*/

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ["en","ru"],
  //   defaultLocale: "ru",
  // },
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // minimumCacheTTL: 3600,
    remotePatterns: [
      { 
        protocol: 'https',
        hostname: 'tdr-starlight-my-ass-98.s3.eu-central-1.amazonaws.com',
        port: '',
        pathname: '/rfbw/**',
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/extra/:path*',
        destination: `http://localhost:${env.EXPRESS_PORT}/:path*`,
      },
    ];
  },
};
export default config;
