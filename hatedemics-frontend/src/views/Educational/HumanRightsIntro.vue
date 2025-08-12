<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto text-center">
        <h1>{{ t('educational.tasks.humanRights.title') }}</h1>

        <!-- Descrizione HTML con link e video -->
        <div v-html="t('educational.tasks.humanRights.description')" class="text-body-1 mb-6" />

        <!-- Sezione Obiettivi -->
        <h2 class="text-h6 font-weight-bold mt-6 mb-2">
          {{ t('educational.tasks.humanRights.objectivesTitle') }}
        </h2>
        <div v-html="t('educational.tasks.humanRights.objectives')" class="text-body-1 text-left mb-6" />

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
