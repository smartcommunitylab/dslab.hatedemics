<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8" class="mx-auto text-left">
        <h1>{{ t('educational.tasks.speechintro.title') }}</h1>
        <p class="text-subtitle-1" v-html="t('educational.tasks.speechintro.description')"></p>
       <!-- Sezione Obiettivi -->
       <h2 class="text-h6 font-weight-bold mt-6 mb-2">
          {{ t('educational.tasks.speechintro.objectivesTitle') }}
        </h2>
        <div v-html="t('educational.tasks.speechintro.objectives')" class="text-body-1 text-left mb-6" />


        <v-btn
          color="primary"
          class="mt-6"
          @click="$router.push({ name: 'counterSpeechTask' })"
        >
          {{ t('educational.tasks.speechintro.startButton') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>
