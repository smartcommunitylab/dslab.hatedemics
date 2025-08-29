<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const show = defineModel<boolean>("modelValue");

const guideItems = [
  { key: "topic", icon: "mdi-comment-text-outline", color: "primary" },
  { key: "hateSpeechPercent", icon: "mdi-alert-octagon-outline", color: "primary" },
  { key: "checkWorthinessPercent", icon: "mdi-fingerprint", color: "primary" },
  { key: "prevalentSentiment", icon: "mdi-emoticon-happy-outline", color: "primary" },
  { key: "wordCloud", icon: "mdi-cloud-outline", color: "primary" }
];
</script>


<template>
  <v-dialog v-model="show" max-width="800">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ t("guide.channel.title") }}
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
                  {{ t(`guide.channel.${item.key}.title`) }}
                </div>
                <div
                  class="text-body-2 mb-0"
                  v-html="t(`guide.channel.${item.key}.description`)"
                ></div>
              </div>
            </div>
            <v-divider class="my-3" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="show = false">{{ t("common.close") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

