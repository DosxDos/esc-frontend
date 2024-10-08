import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    // Cache static assets such as JavaScript, CSS, etc.
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
      },
    },
    // Cache images
    {
      urlPattern: /.*\.(?:png|jpg|jpeg|svg|gif|webp)/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // Cache for 30 days
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache font files
    {
      urlPattern: /\.(?:ttf|woff|woff2)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "font-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache dynamic images generated by Next.js
    {
      urlPattern: /^\/_next\/image\?url=.*$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "next-image",
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    // Cache the homepage
    {
      urlPattern: new RegExp("^/$"),
      handler: "NetworkFirst",
      options: {
        cacheName: "home-cache",
        expiration: {
          maxEntries: 1,
          maxAgeSeconds: 24 * 60 * 60, // Cache for 1 day
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
});

const nextConfig = {};

export default withPWA(nextConfig);
