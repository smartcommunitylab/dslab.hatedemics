<script setup lang="ts">
import { ref } from 'vue';
import { useGlobal } from '@/store';
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const globalStore = useGlobal();
const msg = ref('Hello from HomeView');
const showSnackbar = (message: string) => globalStore.setMessage(message);

</script>

<template>
  <v-container>
    <!-- <hello-world msg="⚡Hello Vue 3.3 + Vuetify 3 + TypeScript + Vite⚡" /> -->
    <h1>{{ msg }}</h1>
    <div>{{ t("welcome.title") }}</div>
    <v-btn @click="showSnackbar('Test')">Snackbar test</v-btn>

  </v-container>
  <!-- <teleport to="head">
    <meta name="keyword" content="template,typescript,vue3,vuetify,vite,vite-template,volar" />
    <meta name="description" content="Vite Vue3 Vuetify TypeScript Demo" />
    <component :is="'script'" type="application/ld+json">
      {{ jsonLd }}
    </component>
  </teleport> -->
</template>
