<template>
  <v-container v-if="currentSection">
    <!-- Intro -->
    <div v-if="currentIndex === 0">
      <h1 class="text-h4 font-weight-bold">{{ t("educational.tasks.lateralreading.title") }}</h1>
      <h3 class="text-h6 ">{{ t("educational.tasks.lateralreading.subtitle") }}</h3>
      <div class="mt-6" v-html="currentSection.intro" />
    </div>
   <!-- Domanda -->
   <div v-if="currentQuestion">
      <h2 class="text-h6 font-weight-bold text-center mb-6">
  {{ currentQuestion.question }}
</h2>
<div class="text-subtitle-2 text-center mb-4">
    {{ t("educational.tasks.lateralreading.selectMultiple") }}
  </div>
  <!-- <v-row dense>
    <v-col
      v-for="(option, idx) in currentQuestion.options"
      :key="idx"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-checkbox
        :label="option.text"
        v-model="selected"
        :value="idx"
        class="my-1"
      />
    </v-col>
  </v-row> -->
</div>
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
      @click="selectedImage = currentSection.images[idx]; imageDialog = true"
    >
      <v-img
        :src="currentSection.images[idx]"
        height="180"
        width="100%"
        contain
        class="rounded elevation-3 border-screenshot"
        style="background-color: white;"
      />
      <div class="zoom-overlay">
        <v-icon size="36">mdi-magnify</v-icon>
      </div>
    </div>

    <!-- Se è l'ultima opzione ("Not Found"), mostro un box fittizio -->
    <div
      v-else
      class="image-wrapper d-flex align-center justify-center"
      style="background-color: #f5f5f5;"
    >
      <v-icon size="64" color="grey">mdi-close-octagon</v-icon>
    </div>

    <!-- Checkbox sotto -->
    <v-checkbox
      v-model="selected"
      :value="idx"
      :label="option.text"
      class="mt-2"
    />
  </v-col>
</v-row>


    <!-- Submit/Feedback -->

    <v-alert v-if="showFeedback" :type="isCorrect ? 'success' : 'error'" class="mt-4">
      {{ feedbackText }}
    </v-alert>

<!-- Navigazione -->
<div class="mt-6 d-flex justify-space-between align-center nav-buttons">
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
  @click="currentIndex < currentSection.questions.length - 1 ? nextQuestion() : openConclusion()"
>
  {{ currentIndex < currentSection.questions.length - 1 ? t("educational.tasks.lateralreading.nextQuestion") : t("educational.tasks.lateralreading.conclusion") }}
  <v-icon end>mdi-arrow-right</v-icon>
</v-btn>
</div>



    <!-- Trigger apertura dialog quando è l'ultima domanda -->
<template v-if="showFeedback && currentIndex === currentSection.questions.length - 1">
  <v-dialog v-model="conclusionDialog" persistent max-width="800">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold">
        {{ currentSection.conclusionTitle || t("educational.tasks.lateralreading.conclusionTitle") || "Conclusion" }}
      </v-card-title>
      <v-card-text>
        <div v-html="currentSection.conclusion" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          v-if="currentSectionIndex < taskSections.length - 1"
          color="primary"
          @click="closeConclusionDialog"
          >
        {{ t("educational.tasks.lateralreading.nextExercise")  }}
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
import { ref,  computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'

const router = useRouter()
const { t, tm } = useI18n();

const taskSections = computed(() => tm("educational.tasks.lateralreading.sections") || []);
const currentSectionIndex = ref(0);
const currentSection = computed(() => taskSections.value[currentSectionIndex.value]);

const currentIndex = ref(0);
const currentQuestion = computed(() => currentSection.value?.questions?.[currentIndex.value]);
const selected = ref<number[]>([]);
const showFeedback = ref(false);
const selectedImage = ref("");
const imageDialog = ref(false);
const conclusionDialog = ref<boolean>(false);
  function closeConclusionDialog() {
  nextSection();
  conclusionDialog.value = false;
}
const isCorrect = computed(() => {
  const correctIndexes = currentQuestion.value?.options
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

function submitAnswer() {
  showFeedback.value = true;

}
function openConclusion() {
  conclusionDialog.value = true;
}
function prevQuestion() {
  if (showFeedback.value) {
    // Reset della domanda corrente
    selected.value = [];
    showFeedback.value = false;
  } else if (currentIndex.value > 0) {
    // Vai alla domanda precedente
    currentIndex.value--;
    selected.value = [];
    showFeedback.value = false;
  }
}

function nextQuestion() {
  currentIndex.value++;
  selected.value = [];
  showFeedback.value = false;
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
</style>
