import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({
    data: '',
  }),
  actions: {},
  getters: {},
});

export type Example = typeof useExampleStore;
