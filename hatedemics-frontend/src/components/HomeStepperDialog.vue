<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    max-width="60%"
  >
    <v-card class="pa-6 rounded-lg">
      <!-- Selezione lingua PRIMA dello stepper -->
      <!-- Selezione lingua PRIMA dello stepper -->
<div v-if="!languageChosen" class="p-6">
  <h2 class="text-lg font-semibold mb-4">{{ t("onboarding.chooseLanguage") }}</h2>
  <v-select
    v-model="selectedLocale"
    :items="availableLocales"
    item-title="label"
    item-value="code"
    :label="t('onboarding.language')"
    hide-details
    density="compact"
  />

  <!-- Checkbox anche qui -->
  <v-checkbox
    v-model="neverShow"
    :label="t('onboarding.neverShow')"
    hide-details
    density="compact"
    class="mt-4"
  />

  <div class="text-right mt-4">
    <v-btn color="primary" @click="confirmLanguage">
      {{ t("onboarding.continue") }}
    </v-btn>
  </div>
</div>


      <!-- Stepper solo DOPO la scelta lingua -->
      <v-stepper
        v-else
        v-model="step"
        alt-labels
        :items="steps.map((s) => s.title)"
      >
        <!-- Step content -->
        <template v-for="(s, idx) in steps" :key="idx" v-slot:[`item.${idx+1}`]>

          <v-card-text class="stepper-content">
            <div v-html="s.html"></div>
          </v-card-text>
        </template>

        <!-- Stepper actions -->
        <template v-slot:actions>
          <v-row class="px-4 pb-4" align="center" justify="space-between">
            <!-- Checkbox finale -->
            <v-col class="text-left">
              <v-checkbox
                v-model="neverShow"
                :label="t('onboarding.neverShow')"
                hide-details
                density="compact"
              />
            </v-col>

            <!-- Bottoni -->
            <v-col class="text-right">
              <v-btn
                variant="text"
                @click="step--"
                v-if="step > 1"
              >
                {{ t("onboarding.prev") }}
              </v-btn>
              <v-btn
                color="primary"
                @click="step < steps.length ? step++ : closeDialog()"
              >
                {{ step < steps.length ? t("onboarding.next") : t("onboarding.close") }}
              </v-btn>
            </v-col>
          </v-row>
        </template>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, tm, locale } = useI18n();

const steps = computed(() =>
  tm("onboarding.steps") as { title: string; html: string }[]
);

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "neverShow"]);

const step = ref(1);
const neverShow = ref(false);

// 👇 Stato per selezione lingua
const languageChosen = ref(false);
const selectedLocale = ref(locale.value);
const availableLocales = [
  { code: "en", label: "English" },
  { code: "it", label: "Italiano" },
  { code: "es", label: "Español" },
  { code: "pl", label: "Polski" },
  { code: "mt", label: "Malti" },
];

function confirmLanguage() {
  locale.value = selectedLocale.value;
  languageChosen.value = true;
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      step.value = 1;
      languageChosen.value = false; // reset se riapro il dialogo
    }
  }
);

function closeDialog() {
  emit("update:modelValue", false);
  if (neverShow.value) emit("neverShow");
}
</script>

<style scoped>
.stepper-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
