<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Titolo -->
        <h1 class="text-h5 font-weight-bold mb-4">
          {{ t("educational.tasks.counterspeech.title") }}
        </h1>

        <!-- Descrizione -->
        <p class="mb-4">
          <span v-html="t('educational.tasks.counterspeech.task')" />
        </p>

        <!-- Messaggio -->
        <v-card class="mb-4 pa-4" elevation="2">
          <div class="d-flex align-center justify-space-between">
            <div class="flex-grow-1">
              <div class="text-body-1 font-weight-medium mb-2">
                {{ currentMessage?.from_user || "User" }}:
              </div>
              <div class="text-subtitle-1">
                {{ currentMessage?.message }}
              </div>
            </div>

          </div>
        </v-card>

        <!-- Domanda -->
        <p class="mb-4 font-weight-medium text-h6">
          {{ t("educational.tasks.counterspeech.question") }}
        </p>

        <!-- Opzioni -->
        <v-card
          v-for="(option, index) in options"
          :key="index"
          class="mb-2 option-card"
          :class="getOptionClass(index)"
          @click="selectAnswer(index)"
        >
          <v-card-text class="d-flex align-center">
            <v-icon
              v-if="showFeedback && index === selectedIndex"
              :icon="isAnswerCorrect ? 'mdi-check-circle' : 'mdi-close-circle'"
              :color="isAnswerCorrect ? 'success' : 'error'"
              class="me-3"
            ></v-icon>
            <span>{{ option }}</span>
          </v-card-text>
        </v-card>

        <!-- Feedback -->
        <v-alert
          v-if="showFeedback"
          :type="isAnswerCorrect ? 'success' : 'error'"
          class="mt-4"
          border="start"
          variant="tonal"
        >
          <div class="font-weight-bold mb-2">
            {{ isAnswerCorrect
              ? t("educational.tasks.counterspeech.feedback.correct")
              : t("educational.tasks.counterspeech.feedback.incorrect") }}
          </div>
          <div class="text-body-2">{{ currentMessage?.explanation }}</div>
        </v-alert>

        <!-- Navigazione -->
        <div class="d-flex justify-space-between align-center mt-6">
          <v-btn
            color="secondary"
            variant="outlined"
            :disabled="currentIndex === 0"
            @click="prevMessage"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            {{ t("educational.tasks.debunking.back") }}
          </v-btn>

          <v-chip color="primary" variant="elevated">
            {{ currentIndex + 1 }} / {{ messages.length }}
          </v-chip>

          <v-btn
            color="primary"
            :disabled="selectedIndex === null"
            @click="isLast ? finishQuiz() : nextMessage()"
          >
            {{ isLast
              ? t("educational.tasks.debunking.finish")
              : t("educational.tasks.debunking.next") }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!-- Barra progresso -->
        <v-progress-linear
          :model-value="((currentIndex + 1) / messages.length) * 100"
          color="primary"
          class="mt-4"
          height="8"
          rounded
        ></v-progress-linear>

        <v-dialog v-model="finalDialog" persistent max-width="500">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold bg-success text-white pa-4">
      {{ t("educational.tasks.counterspeech.completedTitle") }}
    </v-card-title>

    <v-card-text class="pa-6 text-left">
      <div class="text-center mb-4">
        <v-icon size="64" color="success" class="mb-4">mdi-check-circle-outline</v-icon>
      </div>

      <p class="text-subtitle-1 mb-4" v-html="finalMessage"></p>

      <p class="text-subtitle-1">
        {{ t("educational.tasks.counterspeech.score") }}:
        <strong>{{ correctAnswers }} / {{ messages.length }}</strong>
      </p>
    </v-card-text>

    <v-card-actions class="justify-center pb-4">
      <v-btn color="success" size="large" @click="goToNextActivity">
        {{ t("educational.tasks.counterspeech.finish") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const messages = ref<any[]>([]);
const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const showFeedback = ref(false);
const finalDialog = ref(false);
const correctAnswers = ref(0);
const finalMessage = computed(() => t("educational.tasks.counterspeech.finalMessage"));

function finishQuiz() {
  finalDialog.value = true;
}
function goToNextActivity() {
  finalDialog.value = false;
  router.replace("/educational");
}

// === Dataset mock ===
onMounted(() => {
  const examples = ["cs_example_1", "cs_example_2", "cs_example_3", "cs_example_4"];
  messages.value = examples.map((id) => ({
    id,
    message: t(`educational.tasks.counterspeech.dataset.${id}.text`),
    explanation: t(`educational.tasks.counterspeech.dataset.${id}.explanation`),
    correct: Number(t(`educational.tasks.counterspeech.dataset.${id}.correct`)), // 0 or 1
    options: [
      t(`educational.tasks.counterspeech.dataset.${id}.option1`),
      t(`educational.tasks.counterspeech.dataset.${id}.option2`),
    ],
    from_user: "User",
    date: new Date().toISOString(),
    nr_reactions: Math.floor(Math.random() * 10),
  }));
});

const currentMessage = computed(() => messages.value[currentIndex.value]);
const options = computed(() => currentMessage.value?.options || []);
const isLast = computed(() => currentIndex.value === messages.value.length - 1);
const isAnswerCorrect = computed(() =>
  selectedIndex.value === currentMessage.value?.correct
);

function selectAnswer(index: number) {
  if (showFeedback.value) return;
  selectedIndex.value = index;
  showFeedback.value = true;
  if (isAnswerCorrect.value) correctAnswers.value++;
}

function nextMessage() {
  if (currentIndex.value < messages.value.length - 1) {
    currentIndex.value++;
    selectedIndex.value = null;
    showFeedback.value = false;
  }
}

function prevMessage() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    selectedIndex.value = null;
    showFeedback.value = false;
  }
}

const getOptionClass = (index: number) => {
  if (!showFeedback.value) return "";
  if (index === selectedIndex.value) {
    return isAnswerCorrect.value ? "correct-answer" : "wrong-answer";
  }
  return "disabled-option";
};

</script>

<style scoped>
.message-display-container {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.message-header,
.message-row {
  display: grid;
  grid-template-columns: 10% 50% 20% 10% 10%;
  align-items: center;
}
.message-header {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}
.message-row {
  border-bottom: 1px solid #e0e0e0;
}
.header-cell,
.message-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.option-card {
  cursor: pointer;
  transition: all 0.3s ease;
}
.option-card:hover:not(.correct-answer):not(.wrong-answer):not(.disabled-option) {
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.correct-answer {
  background-color: #e0f7e9;
  border-left: 5px solid #2e7d32;
}
.wrong-answer {
  background-color: #ffebee;
  border-left: 5px solid #c62828;
}
.disabled-option {
  opacity: 0.6;
  cursor: not-allowed;
}
.status-cell {
  text-align: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.status-cell.visible {
  opacity: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
