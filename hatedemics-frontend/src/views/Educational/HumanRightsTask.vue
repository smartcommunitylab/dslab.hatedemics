<template>
  <v-container>
    <h1>{{ t('educational.tasks.humanRights.title') }}</h1>
    <p>{{ t('educational.tasks.humanRights.task') }}</p>

    <v-row>
      <v-col
        v-for="(article, index) in articles"
        :key="index"
        cols="12"
        sm="6"
      >
        <v-card @click="openArticle(article)">
          <v-card-title>{{ article.title }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>{{ selectedArticle?.title }}</v-card-title>
        <v-card-text>{{ selectedArticle?.text }}</v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">
            {{ t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

const articles = tm('educational.tasks.humanRights.articles');
const dialog = ref(false);
const selectedArticle = ref<{ title: string; text: string } | null>(null);

function openArticle(article: { title: string; text: string }) {
  selectedArticle.value = article;
  dialog.value = true;
}
</script>
