<template>
  <v-container v-if="currentSection">
    <!-- Intro -->
    <div v-if="currentIndex === 0">
      <h1 class="text-h5 font-weight-bold">{{ t("educational.tasks.lateralreading.title") }}</h1>
      <div class="mb-6" v-html="currentSection.intro" />
    </div>

<!-- Screenshot gallery -->
<v-row dense>
  <v-col
    v-for="(img, idx) in currentSection.images"
    :key="idx"
    cols="12"
    sm="6"
    md="4"
    lg="3"
    class="text-center"
  >
  <div class="image-wrapper" @click="selectedImage = img; imageDialog = true">
  <v-img
    :src="img"
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
    <div class="mt-2 text-subtitle-2">Screenshot {{ idx + 1 }}</div>
  </v-col>
</v-row>


    <!-- Domanda -->
    <div v-if="currentQuestion">
      <h2 class="text-h6 font-weight-bold text-center mb-6">
  {{ currentQuestion.question }}
</h2>
  <v-row dense>
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
  </v-row>
</div>

    <!-- Submit/Feedback -->
    <v-btn v-if="!showFeedback" color="primary" class="mt-4" @click="submitAnswer">
      Submit
    </v-btn>

    <v-alert v-if="showFeedback" :type="isCorrect ? 'success' : 'error'" class="mt-4">
      {{ feedbackText }}
    </v-alert>

    <!-- Navigazione -->
    <v-btn
      v-if="showFeedback && currentIndex < currentSection.questions.length - 1"
      class="mt-4"
      color="primary"
      @click="nextQuestion"
    >
      Next
    </v-btn>

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
          @click="() => { nextSection(); conclusionDialog = false }"
        >
          Next Section
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
const conclusionDialog = ref(false);

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
  if (
  currentIndex.value === currentSection.value?.questions?.length - 1
) {
  conclusionDialog.value = true;
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

</style>
