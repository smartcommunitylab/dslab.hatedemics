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
    key: "expanded",
    icon: "mdi-message-text",
    color: "error",
  },
  {
    key: "inOutRecommendations",
    icon: "mdi-arrow-decision",
    color: "error",
  },
  {
    key: "iri",
    icon: "mdi-alert-decagram",
    color: "error",
  },
  {
    key: "diri",
    icon: "mdi-alert-circle",
    color: "error",
  },
  {
    key: "sdiri",
    icon: "mdi-emoticon",
    color: "error",
  },
  {
    key: "unrel",
    icon: "mdi-link-off",
    color: "error",
  },
  {
    key: "domains",
    icon: "mdi-earth",
    color: "error",
  },
  {
    key: "centrality",
    icon: "mdi-graph",
    color: "error",
  },
  {
  key: "communities",
  icon: "mdi-account-group",
  color: "error",
}
  
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
                <div class="text-body-2 mb-0" v-html="t(`networkGuide.guideItems.${item.key}.description`)"></div>
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
