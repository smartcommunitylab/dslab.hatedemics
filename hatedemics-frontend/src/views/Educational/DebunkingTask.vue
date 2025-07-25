<template>
  <v-container>
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
          <v-img
            :src="currentQuestion.image"
            max-height="200"
            contain
            class="rounded"
            @click="imageDialog = true"
            style="cursor: zoom-in"
          />
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
        <div v-if="feedbackImage" class="my-4 text-center">
          <v-img
            :src="feedbackImage"
            max-height="300"
            contain
            class="rounded"
            @click="feedbackDialog = true"
            style="cursor: zoom-in"
          />
        </div>

        <!-- Dialog per feedback image -->
        <v-dialog v-model="feedbackDialog" max-width="800px">
          <v-card>
            <v-img :src="feedbackImage" contain max-height="600" />
            <v-card-actions class="justify-end">
              <v-btn color="primary" @click="feedbackDialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Avanti -->
        <v-btn
          v-if="showFeedback && !isLastQuestion"
          class="mt-4"
          color="primary"
          @click="nextQuestion"
        >
          {{ t("educational.tasks.debunking.next") }}
        </v-btn>

        <v-btn
          v-if="showFeedback && isLastQuestion"
          class="mt-4"
          color="success"
          @click="finishQuiz"
        >
          {{ t("educational.tasks.debunking.finish") }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Dialog immagine -->
    <v-dialog v-model="imageDialog" max-width="800px">
      <v-card>
        <v-img :src="currentQuestion.image" contain max-height="600px" />
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="imageDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, tm, locale } = useI18n();

const questions = computed(() => tm("educational.tasks.debunking.questions") || []);

const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const showFeedback = ref(false);
const imageDialog = ref(false);

const currentQuestion = computed(() => questions.value[currentIndex.value]);
const feedbackDialog = ref(false);

const feedbackImage = computed(() => {
  if (!showFeedback.value || !currentQuestion.value.feedback) return null;

  return isAnswerCorrect.value
    ? currentQuestion.value.feedback.correctImage
    : currentQuestion.value.feedback.incorrectImage;
});
const isAnswerCorrect = computed(() => {
  return selectedIndex.value === currentQuestion.value.correct;
});

const isLastQuestion = computed(() => {
  return currentIndex.value === questions.value.length - 1;
});

function selectAnswer(index: number) {
  if (showFeedback.value) return;
  selectedIndex.value = index;
  showFeedback.value = true;
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++;
    selectedIndex.value = null;
    showFeedback.value = false;
  }
}
const feedbackMessage = computed(() => {
  if (!showFeedback.value || !currentQuestion.value.feedback) return "";
  return isAnswerCorrect.value
    ? currentQuestion.value.feedback.correct
    : currentQuestion.value.feedback.incorrect;
});
function finishQuiz() {
  // Emetti evento o reindirizza l’utente
  console.log("Quiz completato");
}

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
</style>
