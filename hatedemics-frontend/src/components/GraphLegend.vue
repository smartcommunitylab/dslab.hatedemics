<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import SizeCircle from "./LegendSizeCircle.vue";

const props = defineProps<{
  colorBy: string;
  sizeBy: string;
}>();

const { t } = useI18n();

const currentColorLabel = computed(() =>
  props.colorBy === "disabled"
    ? t("graphInteraction.color.disable")
    : t(`graphInteraction.color.${props.colorBy}`)
);

const currentSizeLabel = computed(() =>
  props.sizeBy === "disabled"
    ? t("graphInteraction.size.disable")
    : t(`graphInteraction.size.${props.sizeBy}`)
);

const colorThresholds = computed(() => {
  switch (props.colorBy) {
    case "iri":
      return { min: 0, mid: 0.15, max: 0.3 };

    case "hs":
      return { min: 0, mid: 0.25, max: 0.5 };
    case "degree_centrality":
      return { min: 0, mid: 0.5, max: 1 };
    default:
      return { min: 0, mid: 0.5, max: 1 };
  }
});

const sizeThresholds = computed(() => {
  switch (props.sizeBy) {
    case "iri":
    case "hs":
      return { min: 0, mid: 0.5, max: 1 };
    case "degree_centrality":
     return { min: 0, mid: 0.5, max: 1 };
    default:
      return { min: 0, mid: 0.5, max: 1 };
  }
});
</script>

<template>
  <v-card class="pa-4 mb-4" elevation="0">
    <h3 class="text-subtitle-1 font-weight-bold mb-2">
      {{ t("graphInteraction.legend.title") }}
    </h3>

    <!-- Colori -->
<div class="mb-6">
  <h4 class="text-body-2 font-weight-medium mb-1">
    {{ t("graphInteraction.legend.color") }}:
    <span class="font-italic">{{ currentColorLabel }}</span>
  </h4>

  <template v-if="props.colorBy !== 'disabled'">
    <!-- 🌈 Caso normale (gradiente) -->
    <template v-if="props.colorBy !== 'louvain_community'">
      <div class="color-gradient-bar"
        style="position: relative; height: 24px; border-radius: 4px;
               background: linear-gradient(to right, rgb(0,255,0), rgb(255,255,0), rgb(255,0,0));">
        <!-- Min -->
        <div style="position: absolute; left: 0; bottom: -35px; font-size: 0.75rem; color: #444; text-align: center; width: 50px;">
          {{ colorThresholds.min }}<br />
          <span class="font-italic">{{ t("graphInteraction.legend.low") }}</span>
        </div>
        <!-- Mid -->
        <div style="position: absolute; left: 50%; transform: translateX(-50%); bottom: -35px; font-size: 0.75rem; color: #444; text-align: center; width: 50px;">
          {{ colorThresholds.mid }}<br />
          <span class="font-italic">{{ t("graphInteraction.legend.medium") }}</span>
        </div>
        <!-- Max -->
        <div style="position: absolute; right: 0; bottom: -35px; font-size: 0.75rem; color: #444; text-align: center; width: 50px;">
          {{ colorThresholds.max }}<br />
          <span class="font-italic">{{ t("graphInteraction.legend.high") }}</span>
        </div>
      </div>
      <div class="d-flex align-center mt-2 mb-2 pt-8">
          <div
            style="width: 24px; height: 24px; border-radius: 4px; background-color: #1976d2; margin-right: 8px;"
          ></div>
          <span class="text-body-2">
            {{ t("graphInteraction.legend.nonExpandable") }}
          </span>
        </div>
    </template>

    <!-- 🟦 Caso community -->
    <template v-else>
      <div class="d-flex flex-column">
        <!-- Box blu per nodi non espandibili rimane -->
        <div class="d-flex align-center mt-2 mb-2">
          <div
            style="width: 24px; height: 24px; border-radius: 4px; background-color: #1976d2; margin-right: 8px;"
          ></div>
          <span class="text-body-2">
            {{ t("graphInteraction.legend.nonExpandable") }}
          </span>
        </div>

        <!-- Spiegazione colori community -->
        <!-- <div class="text-body-2">
          {{ t("graphInteraction.legend.communityExplanation") }}
        </div> -->
      </div>
    </template>
  </template>

  <template v-else>
    <small class="text-grey">{{ t("graphInteraction.legend.defaultColor") }}</small>
  </template>

    </div>

    <!-- Dimensioni -->
    <div class="pt-6">
      <h4 class="text-body-2 font-weight-medium mb-1">
        {{ t("graphInteraction.legend.size") }}:
        <span class="font-italic">{{ currentSizeLabel }}</span>
      </h4>

      <template v-if="props.sizeBy !== 'disabled'">
        <div class="d-flex align-center">
          <SizeCircle :diameter="8" :label="sizeThresholds.min.toString()" />
          <v-spacer />
          <SizeCircle :diameter="24" :label="sizeThresholds.mid.toString()" />
          <v-spacer />
          <SizeCircle :diameter="48" :label="sizeThresholds.max.toString()" />
        </div>
      </template>
      <template v-else>
        <small class="text-grey">{{ t("graphInteraction.legend.defaultSize") }}</small>
      </template>
    </div>
  </v-card>
</template>
