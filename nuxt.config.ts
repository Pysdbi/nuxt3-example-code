import { defineNuxtConfig } from "nuxt/config"
import svgLoader from "vite-svg-loader"
import postcssOptions from "./postcss.config"

// const isDev: boolean = process.env.NODE_ENV === "development"

export default defineNuxtConfig({
  typescript: {
    strict: true,
    // typeCheck: true,
  },
  runtimeConfig: {
    public: {
      apiBase: `https://${process.env.API_BASE_URL}`,
      apiBaseWS: `wss://${process.env.API_BASE_URL}`,
      ENV: process.env.NODE_ENV,
    },
  },
  modern: true,
  render: {
    http2: {
      push: true,
      pushAssets: null,
    },
  },
  router: {},

  css: [ "@/assets/styles/root.css", "@/assets/styles/tailwind.css" ],
  build: {
    transpile: [
      "@headlessui/vue",
      "maska",
      "chart.js",
      "vue-chartjs",
      "vue-toastification",
      "lodash-es",
    ],
  },
  postcss: postcssOptions,
  modules: [ "@vueuse/nuxt", "@pinia/nuxt", "@intlify/nuxt3" ],

  intlify: {
    localeDir: "locales",
    vueI18n: { locale: "ru" },
  },

  vite: {
    plugins: [ svgLoader({ svgo: false }) ],
    // @ts-expect-error
    test: {
      globals: true,
      environment: "jsdom",
    },
    ssr: { noExternal: [ "vue3-popper" ] },
    optimizeDeps: {
      include: [
        "@headlessui/vue",
        // "@heroicons/vue/solid",
        // "@heroicons/vue/outline",
        "vue",
      ],
    },
  },

  hooks: {},
})
