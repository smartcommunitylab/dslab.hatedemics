<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { ref, onMounted } from 'vue';
const { t } = useI18n();

const showWarning = ref(false);
const dontShowAgain = ref(false);
const msg = t("educational.title");

onMounted(() => {
  if (!localStorage.getItem('edu-warning-accepted')) {
    showWarning.value = true;
  }
});

function acceptWarning() {
  if (dontShowAgain.value) {
    localStorage.setItem('edu-warning-accepted', 'true');
  }
  showWarning.value = false;
}
</script>

<template>
  <v-container fluid>
    <v-expansion-panels variant="accordion" elevation="0" class="ma-4">
      <v-expansion-panel>
        <v-expansion-panel-title expand-icon="" collapse-icon="" v-slot="{ expanded }">
          <div class="d-flex align-center w-100">
            <!-- Titolo -->
            <h1 class="text-h5 font-weight-bold  me-2">{{ msg }}</h1>
            <span class=" ms-5">      {{ expanded ? t("common.showLess") : t("common.showMore") }}</span>

            <!-- Freccia manuale vicino al titolo -->
            <v-icon
              :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'"
              class="me-2 "
            />

            <v-spacer />
      
          </div>
        </v-expansion-panel-title>

        <v-expansion-panel-text>
          <h2 class="text-h6 font-weight-light">
            <span v-html="t('educational.subtitle')" />
          </h2>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row justify="center" align="stretch" class="mt-4" dense>
      <!-- Educational Card 1 -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-book-open-variant</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ t("educational.eduCard1Title") }}
              </h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("educational.eduCard1Desc") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="primary" size="small" to="/educational/human-rights" variant="flat">
              {{ t("educational.eduCard1Button") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Educational Card 2 -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-lightbulb-on-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ t("educational.eduCardBiasTitle") }}
              </h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("educational.eduCardBiasDesc") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="primary" size="small" to="/educational/bias" variant="flat">
              {{ t("educational.eduCardBiasButton") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Educational Card 3 -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-school-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ t("educational.eduCard3Title") }}
              </h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("educational.eduCard3Desc") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="primary" size="small" to="/educational/debunking" variant="flat">
              {{ t("educational.eduCard3Button") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
      <!-- Educational Card 4 - Lateral Reading -->
      <v-col cols="12" md="4">
  <v-card
    elevation="6"
    class="h-100 pa-5 d-flex flex-column justify-space-between"
    color="#f4f6fa"
  >
    <div>
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-compass-outline</v-icon>
        <h2 class="text-h6 font-weight-bold mb-1">
          {{ t("educational.eduCard4Title") }}
        </h2>
      </div>
      <p class="text-body-1 mb-4">
        {{ t("educational.eduCard4Desc") }}
      </p>
    </div>
    <div class="text-right mt-6">
      <v-btn color="primary" size="small" to="/educational/lateral-reading" variant="flat">
        {{ t("educational.eduCard4Button") }}
      </v-btn>
    </div>
  </v-card>
</v-col>
      <!-- Educational Card 4 - Lateral Reading -->
      <v-col cols="12" md="4">
  <v-card
    elevation="6"
    class="h-100 pa-5 d-flex flex-column justify-space-between"
    color="#f4f6fa"
  >
    <div>
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-comment-search-outline</v-icon>
        <h2 class="text-h6 font-weight-bold mb-1">
          {{ t("educational.eduCard5Title") }}
        </h2>
      </div>
      <p class="text-body-1 mb-4">
        {{ t("educational.eduCard5Desc") }}
      </p>
    </div>
    <div class="text-right mt-6">
      <v-btn color="primary" size="small" to="/educational/spot-hate" variant="flat">
        {{ t("educational.eduCard5Button") }}
      </v-btn>
    </div>
  </v-card>
</v-col>
      <!-- Educational Card 4 - Lateral Reading -->
      <v-col cols="12" md="4">
  <v-card
    elevation="6"
    class="h-100 pa-5 d-flex flex-column justify-space-between"
    color="#f4f6fa"
  >
    <div>
      <div class="d-flex align-center mb-2">
        <v-icon color="primary" class="mr-2">mdi-chat-alert-outline</v-icon>
        <h2 class="text-h6 font-weight-bold mb-1">
          {{ t("educational.eduCard6Title") }}
        </h2>
      </div>
      <p class="text-body-1 mb-4">
        {{ t("educational.eduCard6Desc") }}
      </p>
    </div>
    <div class="text-right mt-6">
      <v-btn color="primary" size="small" to="/educational/counterspeech" variant="flat">
        {{ t("educational.eduCard6Button") }}
      </v-btn>
    </div>
  </v-card>
</v-col>

    </v-row>
  </v-container>
  <v-dialog v-model="showWarning" persistent max-width="600">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      ⚠️ {{ t('educational.warningTitle') }}
    </v-card-title>
    <v-card-text>
      <p class="mb-2">
        {{ t('educational.warningText') }}
      </p>
      <v-checkbox
        v-model="dontShowAgain"
        :label="t('educational.warningCheckbox')"
        hide-details
        density="compact"
        class="mt-2"
      />
    </v-card-text>
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="acceptWarning">
        {{ t('educational.warningButton') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>
