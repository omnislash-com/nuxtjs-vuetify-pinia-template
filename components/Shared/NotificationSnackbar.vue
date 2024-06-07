<template>
  <v-snackbar
    max-width="200"
    v-model="snackbar"
    :timeout="timeout"
    :color="snackbarColor"
    elevation="24"
    location="bottom center"
    variant="flat"
  >
    <span class="text-black"> {{ message }}</span>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { onMounted, ref, useNuxtApp } from '#imports';
import { GlobalEventType } from '@/types/events';

// STATE
const snackbar = ref(false);
const snackbarColor = ref('');
const message = ref('');
const timeout = 3000;

// METHODS
function openNotification(color: string, text: string): void {
  snackbar.value = true;
  snackbarColor.value = color;
  message.value = text;
}

// LICECYCLE METHODS

const { $bus } = useNuxtApp();
onMounted(() => {
  $bus.on(
    GlobalEventType.notification,
    (payload: { color: string; text: string }) => {
      openNotification(payload.color, payload.text);
    }
  );
});

// Unregister Listener
onBeforeUnmount(() => $bus.off(GlobalEventType.notification));
</script>

<style scoped>
.v-snack__wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
