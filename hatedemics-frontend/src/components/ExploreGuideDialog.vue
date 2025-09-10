<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const show = defineModel<boolean>('modelValue');

// ✅ Nuova lista di elementi con chiavi del glossario V2
const guideItems = [
  {
    key: "telegramDataset",
    icon: "mdi-database",
    color: "primary",
  },
  {
    key: "telegramChannels",
    icon: "mdi-chat",
    color: "primary",
  },
  {
    key: "network",
    icon: "mdi-web",
    color: "primary",
  },
  {
    key: "disinformation",
    icon: "mdi-alert-circle",
    color: "primary",
  },
  {
    key: "reliability",
    icon: "mdi-shield-check",
    color: "primary",
  },
  {
    key: "infodemicRisk",
    icon: "mdi-virus",
    color: "primary",
  },
  {
    key: "hateSpeech",
    icon: "mdi-comment-alert",
    color: "primary",
  },
  {
    key: "checkWorthyness",
    icon: "mdi-magnify",
    color: "primary",
  },
];
</script>

<template>
  <v-dialog v-model="show" max-width="800">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ t("networkGuide.guideTitle") }}
      </v-card-title>

      <v-card-text>
        <v-row dense>
          <v-col cols="12" v-for="item in guideItems" :key="item.key">
            <div class="d-flex align-start mb-3">
              <v-icon :color="item.color" class="mr-3 mt-1" size="30">
                {{ item.icon }}
              </v-icon>
              <div>
                <div class="font-weight-medium mb-1">
                  {{ t(`networkGuide.guideItems.${item.key}.title`) }}
                </div>
                <div
                  class="text-body-2 mb-0"
                  v-html="t(`networkGuide.guideItems.${item.key}.description`)"
                />
              </div>
            </div>
            <v-divider class="my-3" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="show = false">
          {{ t("common.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
