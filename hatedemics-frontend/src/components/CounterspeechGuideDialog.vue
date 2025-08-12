<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const show = defineModel<boolean>('modelValue');

const guideItems = [
  { key: "counterspeech", icon: "mdi-comment-check", color: "primary" },
  { key: "dataSources", icon: "mdi-database-search", color: "primary" },
  { key: "dialogue", icon: "mdi-forum", color: "primary" },
  { key: "groundText", icon: "mdi-text-box-search", color: "primary" },
  { key: "newTurn", icon: "mdi-plus-box", color: "primary" }
];
</script>

<template>
  <v-dialog v-model="show" max-width="700">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ t("counterspeechGuide.guideTitle") }}
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
                  {{ t(`counterspeechGuide.guideItems.${item.key}.title`) }}
                </div>
                <div class="text-body-2 mb-0" v-html="t(`counterspeechGuide.guideItems.${item.key}.description`)"></div>

              </div>
            </div>
            <v-divider class="my-3" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="show = false">{{ t('common.close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>