<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    max-width="50%"
  >
    <v-card>
      <v-stepper v-model="step" alt-labels :items="steps.map((s) => s.title)">
        <!-- Step content -->
        <template v-for="(s, idx) in steps" :key="idx" v-slot:[`item.${idx+1}`]>
          <v-card-text>
            <div v-html="s.html"></div>
          </v-card-text>
        </template>

        <!-- Stepper actions -->
        <template v-slot:actions>
          <v-row class="px-4 pb-4" align="center" justify="space-between">
            <!-- Bottone Indietro -->
            <v-col cols="6" class="text-left">
              <v-btn
                variant="text"
                @click="step--"
                v-if="step > 1"
              >
                {{ t('onboarding.prev') }}
              </v-btn>
            </v-col>

            <!-- Bottone Avanti / Chiudi -->
            <v-col cols="6" class="text-right">
              <v-btn
                color="primary"
                @click="step < steps.length ? step++ : closeDialog()"
              >
                {{ step < steps.length ? t('onboarding.next') : t('onboarding.close') }}
              </v-btn>
            </v-col>

            <!-- Checkbox finale -->
            <v-col cols="12" v-if="step === steps.length">
              <v-checkbox
                v-model="neverShow"
                :label="t('onboarding.neverShow')"
                hide-details
                density="compact"
                class="mt-2"
              />
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

const { t, tm } = useI18n();

const steps = computed(() =>
  tm("onboarding.steps") as { title: string; html: string }[]
);

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits(["update:modelValue", "neverShow"]);

const step = ref(1);
const neverShow = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    if (val) step.value = 1;
  }
);

function closeDialog() {
  emit("update:modelValue", false);
  if (neverShow.value) emit("neverShow");
}
</script>
