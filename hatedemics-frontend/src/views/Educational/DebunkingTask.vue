<template>
  <v-container>
    <h1 v-if="currentIndex === 0" class="text-h5 font-weight-bold mb-2">
      {{ t("educational.tasks.debunking.title") }}
    </h1>
    <p v-if="currentIndex === 0" class="mb-4">
      <span v-html="t('educational.tasks.debunking.task')" />
    </p>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h1 class="text-h5 font-weight-bold mb-4">
          {{ currentQuestion.title }}
        </h1>

        <p v-if="currentQuestion.scenario_description" class="mb-2 font-italic">
          {{ currentQuestion.scenario_description }}
        </p>
        <p class="mb-4 font-weight-medium">
          {{ currentQuestion.question }}
        </p>
        <!-- Immagine opzionale -->
        <div v-if="currentQuestion.image" class="mb-4 text-center">
          <div class="image-wrapper" @click="questionImageDialog = true">
  <v-img :src="currentQuestion.image" height="200" width="100%" contain class="rounded" />
  <div class="zoom-overlay">
    <v-icon size="36">mdi-magnify</v-icon>
  </div>
</div>
        </div>

        <!-- Risposte -->
        <v-card
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="mb-2"
          :elevation="2"
          :class="getOptionClass(index)"
          @click="selectAnswer(index)"
        >
          <v-card-text>{{ option.text }}</v-card-text>
        </v-card>

        <!-- Feedback -->
        <v-alert
          v-if="showFeedback"
          :type="isAnswerCorrect ? 'success' : 'error'"
          class="mt-4"
          border="start"
          variant="tonal"
        >
          <span v-html="feedbackMessage" />
        </v-alert>
        <!-- Immagine del feedback, se disponibile -->
        <!-- <div v-if="feedbackImage" class="my-4 text-center">
          <v-img
            :src="feedbackImage"
            max-height="300"
            contain
            class="rounded"
            @click="feedbackDialog = true"
            style="cursor: zoom-in"
          />
        </div> -->
        <div v-if="feedbackImage" class="mb-4 text-center">
          <div v-if="feedbackImage" class="image-wrapper" @click="feedbackImageDialog = true">
  <v-img :src="feedbackImage" height="200" width="100%" contain class="rounded" />
  <div class="zoom-overlay">
    <v-icon size="36">mdi-magnify</v-icon>
  </div>
</div>
        </div>
       

<!-- Avanti / Indietro -->
<div class="d-flex justify-space-between align-center mt-4">
  <!-- Back -->
  <v-btn
    color="secondary"
    variant="outlined"
    :disabled="currentIndex === 0"
    @click="prevQuestion"
  >
    <v-icon start>mdi-arrow-left</v-icon>
    {{ t("educational.tasks.debunking.back") }}
  </v-btn>

  <!-- Contatore -->
  <span class="text-subtitle-2 align-self-center">
    {{ currentIndex + 1 }}/{{ questions.length }}
  </span>

  <!-- Next / Finish -->
  <v-btn
    color="primary"
    :disabled="selectedIndex === null" 
    @click="isLastQuestion ? finishQuiz() : nextQuestion()"
  >
    {{ isLastQuestion ? t("educational.tasks.debunking.finish") : t("educational.tasks.debunking.next") }}
    <v-icon end>mdi-arrow-right</v-icon>
  </v-btn>
</div>


      </v-col>
    </v-row>

    <!-- Dialog immagine della domanda -->
<v-dialog v-model="questionImageDialog" max-width="800px">
  <v-card>
    <v-img :src="currentQuestion.image" contain max-height="600px" />
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="questionImageDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

<!-- Dialog immagine del feedback -->
<v-dialog v-model="feedbackImageDialog" max-width="800px">
  <v-card>
    <v-img :src="feedbackImage" contain max-height="600px" />
    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="feedbackImageDialog = false">Close</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
    <!-- Dialog finale -->
    <v-dialog v-model="finalDialog" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ t("educational.tasks.debunking.completedTitle") }}
        </v-card-title>
        <v-card-text>
          <p>{{ finalMessage }}</p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="success" @click="goToNextActivity">
            {{ t("educational.tasks.debunking.finish") }}
          </v-btn>
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
const questions = computed(() => tm("educational.tasks.debunking.questions") || []);

const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const showFeedback = ref(false);

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const finalDialog = ref(false);
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1);

const questionImageDialog = ref(false)
const feedbackImageDialog = ref(false)
const feedbackImage = computed(() => {
  if (!showFeedback.value || !currentQuestion.value.feedback) return null;

  return isAnswerCorrect.value
    ? currentQuestion.value.feedback.correctImage
    : currentQuestion.value.feedback.incorrectImage;
});
const isAnswerCorrect = computed(() => {
  return selectedIndex.value === currentQuestion.value.correct;
});



function selectAnswer(index: number) {
  if (showFeedback.value) return;
  selectedIndex.value = index;
  showFeedback.value = true;
}
function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedIndex.value = null;
    showFeedback.value = false;
  }
}
function goToNextActivity() {
  finalDialog.value = false;
  router.replace("/educational"); 
}

// Messaggio finale localizzato
const finalMessage = computed(() => t("educational.tasks.debunking.finalMessage"));

function finishQuiz() {
  // per ora reindirizza alla pagina principale
  // puoi personalizzare se vuoi un dialog finale
  finalDialog.value = true;
}
function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    selectedIndex.value = null;
    showFeedback.value = false;
  } else {
    openFinalDialog();
  }
}

function openFinalDialog() {
  finalDialog.value = true;
}
const feedbackMessage = computed(() => {
  if (!showFeedback.value || !currentQuestion.value.feedback) return "";
  return isAnswerCorrect.value
    ? currentQuestion.value.feedback.correct
    : currentQuestion.value.feedback.incorrect;
});
// function finishQuiz() {

// }

function getOptionClass(index: number) {
  if (!showFeedback.value) return "option-card";

  if (index === selectedIndex.value) {
    return index === currentQuestion.value.correct ? "correct-answer" : "wrong-answer";
  }
  return "";
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
  height: 200px; /* 👈 stessa altezza dell'immagine */
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
