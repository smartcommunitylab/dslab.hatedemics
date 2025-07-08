<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <v-container>
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
              <v-icon color="success" class="mr-2">mdi-lightbulb-on-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ t("educational.eduCardBiasTitle") }}
              </h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("educational.eduCardBiasDesc") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="success" size="small" to="/educational/bias" variant="flat">
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
              <v-icon color="info" class="mr-2">mdi-school-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">
                {{ t("educational.eduCard3Title") }}
              </h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("educational.eduCard3Desc") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="info" size="small" to="/educational/resources" variant="flat">
              {{ t("educational.eduCard3Button") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
