<script setup lang="ts">
import { useConfig } from '@/store';
import LocaleSwitcher  from '@/components/LocaleSwitcher.vue';
/** Config Store */
const configStore = useConfig();
</script>

<template>
  <!-- Toggle Dark mode -->
  <v-btn icon="mdi-theme-light-dark" variant="flat" @click="configStore.toggleTheme" />
  <LocaleSwitcher />
</template>
