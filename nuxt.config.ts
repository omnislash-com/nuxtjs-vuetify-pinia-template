// https://nuxt.com/docs/api/configuration/nuxt-config

import vuetify from 'vite-plugin-vuetify';

const APP_VERSION = '0.0.1';

const env = {
  RUN_ENV: process.env.RUN_ENV,
  API_URL: process.env.API_URL,
};

console.log(env);

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Project Name',
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        {
          name: 'description',
          content: 'Project Description',
        },
      ],
    },
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@/assets/main.scss',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      // this enables automatic tree shaking
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(
          // vuetify()
          vuetify({
            autoImport: true,
            styles: {
              configFile: 'assets/variables.scss',
            },
          })
        );
      });
    },
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // automatically imports `defineStore`
          'defineStore', // import { defineStore } from 'pinia'
          // automatically imports `defineStore` as `definePiniaStore`
          ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
        ],
      },
    ],
    '@pinia-plugin-persistedstate/nuxt',
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  sourcemap: {
    server: false,
    client: false,
  },
  experimental: {
    inlineRouteRules: false,
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true),
    },
  },
  ssr: false,
  devtools: { enabled: env.RUN_ENV === 'development' },
  typescript: {
    shim: false,
  },
  components: [
    {
      path: '@/components',
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    // Keys within public, will be also be
    // exposed to the client-side
    public: {
      APP_VERSION,
      RUN_ENV: env.RUN_ENV,
      IS_DEV: env.RUN_ENV === 'development',
      API_URL: env.API_URL,
    },
  },
});
