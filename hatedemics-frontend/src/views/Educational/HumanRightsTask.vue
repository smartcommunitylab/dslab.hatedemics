<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-4">{{ t('educational.tasks.humanRights.title') }}</h1>
    <p class="mb-8">{{ t('educational.tasks.humanRights.task') }}</p>
    <!-- Pulsante fine task -->
    <div class="mb-8 text-center">
      <v-btn
        color="success"
        size="large"
        @click="openTaskCompleteDialog"
      >
        {{ t('educational.tasks.humanRights.completetask') }}
      </v-btn>
    </div>
    <v-row dense>
      <v-col
        v-for="(article, index) in articles"
        :key="index"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          @click="openArticle(article)"
          class="d-flex align-center justify-center text-center rounded-xl pa-4"
          height="200"
          elevation="5"
          color="indigo-lighten-5"
          hover
        >
          <v-card-title class="text-h6 font-weight-medium text-indigo-darken-3">
            {{ article.title }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>



    <!-- Dialogo articolo -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">{{ selectedArticle?.title }}</v-card-title>
        <v-card-text>{{ selectedArticle?.text }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="dialog = false">
            {{ t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo completamento task -->
    <v-dialog v-model="taskDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ t('educational.tasks.humanRights.taskCompleteTitle') }}
        </v-card-title>
        <v-card-text>
          {{ t('educational.tasks.humanRights.taskCompleteText') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="taskDialog = false">
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
const taskDialog = ref(false);

const selectedArticle = ref<{ title: string; text: string } | null>(null);

function openArticle(article: { title: string; text: string }) {
  selectedArticle.value = article;
  dialog.value = true;
}

function openTaskCompleteDialog() {
  taskDialog.value = true;
}
</script>
