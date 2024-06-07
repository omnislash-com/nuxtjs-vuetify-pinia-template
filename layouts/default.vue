<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer"> </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer">
      </v-app-bar-nav-icon>

      <v-app-bar-title>Hello World App</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
    <notification-snackbar />
  </v-app>
</template>

<script setup lang="ts">
import { NotificationSnackbar } from '#components';
import { ref } from '#imports';

const drawer = ref(false);
</script>
