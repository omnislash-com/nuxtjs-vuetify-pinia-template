import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(async (ctx): Promise<void> => {
  // Env variables
  const { public: env } = useRuntimeConfig();

  // disable logs if not on development
  if (env.RUN_ENV !== 'development') {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
  }
});
