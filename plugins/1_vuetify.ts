import '@mdi/font/css/materialdesignicons.css';
import { createVuetify, type ThemeDefinition } from 'vuetify';

export default defineNuxtPlugin((nuxtApp) => {
  const customTheme: ThemeDefinition = {
    dark: true,
    colors: {
      // background: '#161C2B',
      // surface: '#091020',
      // primary: '#E5B15C',
      // live: '#FF52C4',
      // secondary: '#3B4764',
    },
  };

  const vuetify = createVuetify({
    ssr: true,
    theme: { defaultTheme: 'customTheme', themes: { customTheme } },
    defaults: {
      VCard: {
        elevation: 0,
      },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
