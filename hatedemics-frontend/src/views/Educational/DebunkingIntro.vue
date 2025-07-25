<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto text-left">
        <h1>{{ t('educational.tasks.debunking.title') }}</h1>
        <p class="text-subtitle-1" v-html="t('educational.tasks.debunking.description')"></p>
       <!-- Sezione Obiettivi -->
       <h2 class="text-h6 font-weight-bold mt-6 mb-2">
          {{ t('educational.tasks.debunking.objectivesTitle') }}
        </h2>
        <div v-html="t('educational.tasks.debunking.objectives')" class="text-body-1 text-left mb-6" />


        <v-btn
          color="primary"
          class="mt-6"
          @click="$router.push({ name: 'debunkingTask' })"
        >
          {{ t('educational.tasks.debunking.startButton') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
