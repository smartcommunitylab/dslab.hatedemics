<template>
  <v-container v-if="currentSection">
    <!-- Intro -->
    <div>
      <h1 class="text-h4 font-weight-bold">
        {{ t("educational.tasks.lateralreading.title") }}
      </h1>
      <h3 class="text-h6">{{ t("educational.tasks.lateralreading.subtitle") }}</h3>
      <div class="mt-6" v-html="currentSection.intro" />
    </div>
    <!-- Domanda -->
    <div v-if="currentQuestion">
      <h2 class="text-h6 font-weight-bold text-center mb-6">
        <span class="text-subtitle-2 text-grey mr-2">{{ questionCounter }}</span>
        <span>{{ currentQuestion.question }}</span>
      </h2>

      <div class="text-subtitle-2 text-center mb-4">
        {{ t("educational.tasks.lateralreading.selectMultiple") }}
      </div>
      <div class="mb-6 d-flex justify-space-between align-center nav-buttons">
        <!-- Previous -->
        <v-btn
          variant="outlined"
          color="secondary"
          :disabled="currentIndex === 0 && !showFeedback"
          @click="prevQuestion"
        >
          <v-icon start>mdi-arrow-left</v-icon>
          {{ t("educational.tasks.lateralreading.prevQuestion") }}
        </v-btn>

        <!-- Submit -->
        <v-btn
          color="primary"
          :disabled="selected.length === 0 || showFeedback"
          @click="submitAnswer"
        >
          <v-icon start>mdi-check</v-icon>
          {{ t("educational.tasks.lateralreading.submit") }}
        </v-btn>

        <!-- Next -->
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!showFeedback"
          @click="
            currentIndex < currentSection.questions.length - 1
              ? nextQuestion()
              : openConclusion()
          "
        >
          {{
            currentIndex < currentSection.questions.length - 1
              ? t("educational.tasks.lateralreading.nextQuestion")
              : t("educational.tasks.lateralreading.conclusion")
          }}
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>
    <v-alert v-if="showFeedback" :type="isCorrect ? 'success' : 'error'" class="ma-4">
      {{ feedbackText }}
    </v-alert>
    <v-row dense>
      <v-col
        v-for="(option, idx) in currentQuestion?.options"
        :key="idx"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="text-center"
      >
        <!-- Se NON è l'ultima opzione, mostro l'immagine -->
        <div
          v-if="idx < currentSection.images.length"
          class="image-wrapper"
          @click="
            selectedImage = currentSection.images[idx];
            imageDialog = true;
          "
        >
          <v-img
            :src="currentSection.images[idx]"
            height="180"
            width="100%"
            contain
            class="rounded elevation-3 border-screenshot"
            style="background-color: white"
          />
          <div class="zoom-overlay">
            <v-icon size="36">mdi-magnify</v-icon>
          </div>
        </div>

        <!-- Se è l'ultima opzione ("Not Found"), mostro un box fittizio -->
        <div
          v-else
          class="image-wrapper d-flex align-center justify-center"
          style="background-color: #f5f5f5"
        >
          <v-icon size="64" color="grey">mdi-close-octagon</v-icon>
        </div>

        <!-- Checkbox sotto -->
        <v-checkbox
          v-model="selected"
          :value="idx"
          :label="option.text"
          class="mt-2"
          :class="{
            'correct-label': showFeedback && option.correct,
            'wrong-label': showFeedback && !option.correct,
          }"
        />
      </v-col>
    </v-row>

    <!-- Trigger apertura dialog quando è l'ultima domanda -->
    <template v-if="showFeedback && currentIndex === currentSection.questions.length - 1">
      <v-dialog v-model="conclusionDialog" persistent max-width="800">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      {{
        currentSection.conclusionTitle ||
        t("educational.tasks.lateralreading.conclusionTitle") ||
        "Conclusion"
      }}
    </v-card-title>

    <v-card-text>
      <!-- Step 1: mostra la domanda bonus -->
      <div v-if="!bonusAnswered">
        <p class="mb-4">{{ currentSection.conclusionQuestion }}</p>
        <v-radio-group v-model="bonusAnswer">
          <v-radio :label="t('common.yes')" value="true"></v-radio>
          <v-radio :label="t('common.no')" value="false"></v-radio>
        </v-radio-group>
      </div>

      <!-- Step 2: mostra la conclusione solo dopo risposta -->
      <div v-else>
        <p class="font-weight-bold mb-2">
          {{ bonusFeedback }}
        </p>
        <div v-html="currentSection.conclusion" />
      </div>
    </v-card-text>

    <v-card-actions class="justify-end">
      <!-- bottone per passare dalla domanda alla conclusione -->
      <v-btn
        v-if="!bonusAnswered"
        color="primary"
        :disabled="bonusAnswer === null"
        @click="bonusAnswered = true"
      >
        {{ t("educational.tasks.lateralreading.showConclusion") }}
      </v-btn>

      <!-- bottone finale -->
      <v-btn
        v-else-if="currentSectionIndex < taskSections.length - 1"
        color="primary"
        @click="closeConclusionDialog"
      >
        {{ t("educational.tasks.lateralreading.nextExercise") }}
      </v-btn>

      <v-btn
        v-else
        color="success"
        @click="() => router.replace('/educational')"
      >
        Finish
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    </template>

    <!-- Dialog immagini -->
    <v-dialog v-model="imageDialog" max-width="800">
      <v-card>
        <v-img :src="selectedImage" contain max-height="600" />
        <v-card-actions class="justify-end">
          <v-btn @click="imageDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const router = useRouter();
const { t, tm } = useI18n();

const taskSections = computed(
  () => tm("educational.tasks.lateralreading.sections") || []
);
const currentSectionIndex = ref(0);
const currentSection = computed(() => taskSections.value[currentSectionIndex.value]);

const currentIndex = ref(0);
const currentQuestion = computed(
  () => currentSection.value?.questions?.[currentIndex.value]
);
const selected = ref<number[]>([]);
const showFeedback = ref(false);
const selectedImage = ref("");
const imageDialog = ref(false);
const conclusionDialog = ref<boolean>(false);
  const bonusAnswer = ref<string | null>(null); // risposta dell'utente (true/false come stringa)
const bonusAnswered = ref(false);

const bonusFeedback = computed(() => {
  if (!currentSection.value) return "";

  const isReliable = currentSection.value.affidabile; // boolean dal JSON
  const answerBool = bonusAnswer.value === "true";

  if (answerBool === isReliable) {
    return currentSection.value.feedback.correct;
  } else {
    return currentSection.value.feedback.incorrect;
  }
});
function closeConclusionDialog() {
  nextSection();
  conclusionDialog.value = false;
}

// Totale domande della sezione
const totalQuestions = computed(() => currentSection.value?.questions?.length || 0);

// Contatore domanda (mostra 1/3, 2/3, ecc.)
const questionCounter = computed(() => {
  if (!currentSection.value) return "";
  return `${currentIndex.value + 1}/${totalQuestions.value}`;
});
const isCorrect = computed(() => {
  const correctIndexes =
    currentQuestion.value?.options
      ?.map((opt: { correct: boolean }, idx: number) => (opt.correct ? idx : null))
      .filter((idx: null) => idx !== null) || [];

  return (
    selected.value.length === correctIndexes.length &&
    selected.value.every((val) => correctIndexes.includes(val))
  );
});

const feedbackText = computed(() => {
  if (!currentQuestion.value) return "";
  return isCorrect.value
    ? currentQuestion.value.feedback.correct
    : currentQuestion.value.feedback.incorrect;
});


function openConclusion() {
  conclusionDialog.value = true;
  bonusAnswer.value = null;
  bonusAnswered.value = false;
}
function submitAnswer() {
  showFeedback.value = true;
}

function nextQuestion() {
  currentIndex.value++;
  selected.value = [];
  showFeedback.value = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function prevQuestion() {
  if (showFeedback.value) {
    selected.value = [];
    showFeedback.value = false;
  } else if (currentIndex.value > 0) {
    currentIndex.value--;
    selected.value = [];
    showFeedback.value = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function nextSection() {
  currentSectionIndex.value++;
  currentIndex.value = 0;
  selected.value = [];
  showFeedback.value = false;
}
</script>
<style scoped>
.option-card {
  cursor: pointer;
  transition: 0.3s;
}

.correct-answer {
  background-color: #e0f7e9;
  border-left: 5px solid #2e7d32;
}

.wrong-answer {
  background-color: #ffebee;
  border-left: 5px solid #c62828;
}
.image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  cursor: zoom-in;
  overflow: hidden;
  border-radius: 8px;
}

.image-wrapper .v-img {
  height: 100%;
  width: 100%;
  object-fit: contain;
}

.zoom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 8px;
  pointer-events: none;
  color: white;
}

.image-wrapper:hover .zoom-overlay {
  opacity: 1;
}
.nav-buttons {
  gap: 12px;
}

.nav-buttons .v-btn {
  min-width: 160px;
}
.correct-border {
  border: 3px solid #2e7d32; /* verde */
}

.wrong-border {
  border: 3px solid #c62828; /* rosso */
}

.correct-label {
  color: #2e7d32 !important;
  font-weight: 600;
}

.wrong-label {
  color: #c62828 !important;
  font-weight: 600;
}
</style>
