<template>
    <v-container>
      <v-row>
        <v-col cols="12" md="8" class="mx-auto text-center">
          <h1>{{ t('educational.tasks.humanRights.title') }}</h1>
          <p class="text-subtitle-1">{{ t('educational.tasks.humanRights.description') }}</p>
          <v-btn
            color="primary"
            class="mt-4"
            @click="$router.push({ name: 'humanRightsTask' })"
          >
            {{ t('educational.tasks.humanRights.startButton') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  
  const { t } = useI18n();
  </script>