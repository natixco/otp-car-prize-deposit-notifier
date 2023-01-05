// @ts-check
import axios from "axios";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));
import { schedule } from "node-cron";

schedule("0 0 20 * *", function() {
  console.log("Crawling data");
  const baseUrl = process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.BASE_URL;
  axios.get(`${baseUrl}/api/crawl`)
    .then(() => console.log(`Crawled latest data at ${new Date()}`))
    .catch(err => console.log(err));
});

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en"
  },
  output: "standalone"
};
export default config;
