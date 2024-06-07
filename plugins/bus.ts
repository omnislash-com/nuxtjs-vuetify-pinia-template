import { defineNuxtPlugin } from '#imports';
import mitt from 'mitt';

const emitter = mitt();

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$bus = {
    all: emitter.all,
    on: emitter.on,
    off: emitter.off,
    emit: emitter.emit,
  };
});
