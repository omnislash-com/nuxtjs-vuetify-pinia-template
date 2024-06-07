<template>
  <v-row justify="center">
    <v-col cols="11" class="text-center mt-16">
      <h1 class="text-grey">
        Welcome to Nuxt-Vuetify-Pinia Starter Template
      </h1>
      <v-btn
        color="primary"
        variant="tonal"
        class="text-capitalize mt-2"
        @click="testNotification"
        rounded
      >
        Test Notification
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useNuxtApp } from '#imports';
import { GlobalEventType } from '~/types/events';
import { NotificationType } from '~/types/general';

const { $bus } = useNuxtApp();

function testNotification() {
  $bus.emit(GlobalEventType.notification, {
    color: NotificationType.success,
    text: 'Notification Test',
  });
}
</script>
