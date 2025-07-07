<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const show = defineModel<boolean>('modelValue');
    const guideItems = [
  {
    key: "network",
    icon: "mdi-web",
    color: "error",
  },
  {
    key: "inRec",
    icon: "mdi-arrow-down-bold-box",
    color: "error",
  },
  {
    key: "outRec",
    icon: "mdi-arrow-up-bold-box",
    color: "error",
  },
  {
    key: "risk",
    icon: "mdi-chart-line",
    color: "error",
  },
  {
    key: "check",
    icon: "mdi-magnify-close",
    color: "error",
  },
];
</script>

<template>

  <v-dialog v-model="show" max-width="700">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      {{ t("home.guideTitle") }}
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
                {{ t(`home.guideItems.${item.key}.title`) }}
              </div>
              <p class="text-body-2 mb-0">
                {{ t(`home.guideItems.${item.key}.description`) }}
              </p>
            </div>
          </div>
          <v-divider class="my-3" />
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn  @click="show = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>