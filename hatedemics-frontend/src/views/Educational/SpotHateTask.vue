<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <!-- Titolo -->
        <h1 class="text-h5 font-weight-bold mb-4">
          {{ t("educational.tasks.spothate.title") }}
        </h1>

        <!-- Descrizione -->
        <p class="mb-4">
          <span v-html="t('educational.tasks.spothate.task')" />
        </p>

        <!-- Tabella del messaggio (stile ChatTable) -->
        <v-card class="mb-6" elevation="2">
          <v-card-text class="pa-0">
            <div class="message-display-container">
              <!-- Header della tabella -->
              <div class="message-header">
                <div class="header-cell date-cell">{{ t("message.header.date") }}</div>
                <div class="header-cell message-cell">
                  {{ t("message.header.message") }}
                </div>
                <div class="header-cell from-cell">{{ t("message.header.from") }}</div>
                <div class="header-cell reactions-cell">
                  {{ t("message.header.nrReactions") }}
                </div>
                <div
          class="header-cell status-cell"
          :class="{ visible: showFeedback }"
        >
          {{ statusHeaderTitle }}
        </div>
              </div>

              <!-- Riga del messaggio corrente -->
              <div class="message-row" v-if="currentMessage">
                <div class="message-cell date-cell">
                  {{ formatDisplayDate(currentMessage.date) }}
                </div>
                <div class="message-cell message-content-cell">
                  <div
                    class="chat-message"
                    :style="{ backgroundColor: getColor(currentMessage.from_user) }"
                  >
                    <div class="message-content">
                      <v-icon
                        v-if="currentMessage.media_type"
                        :icon="getIcon(currentMessage.media_type)"
                        class="me-2"
                        size="small"
                      ></v-icon>
                      <span>{{ currentMessage.message }}</span>
                    </div>
                    <div class="message-time">
                      {{ formatDate(currentMessage.date) }}
                    </div>
                  </div>
                </div>
                <div class="message-cell from-cell">
                  {{ currentMessage.from_user || "User" }}
                </div>
                <div class="message-cell reactions-cell">
                  {{ currentMessage.nr_reactions || 0 }}
                </div>
                <div
          class="message-cell status-cell"
          :class="{ visible: showFeedback }"
        >
          <transition name="fade">
            <v-icon
              v-if="showFeedback"
              :icon="getStatusIcon(currentMessage.label)"
              :color="getStatusColor(currentMessage.label)"
              size="small"
            />
          </transition>
        </div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Domanda -->
        <p class="mb-4 font-weight-medium text-h6">
          {{ currentQuestion }}
        </p>

        <!-- Opzioni -->
        <v-card
          v-for="(option, index) in options"
          :key="index"
          class="mb-2 option-card"
          :elevation="2"
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
            {{ feedbackMessage }}
          </div>
          <div class="text-body-2">
            {{ currentMessage.explanation }}
          </div>
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
            {{
              isLast
                ? t("educational.tasks.debunking.finish")
                : t("educational.tasks.debunking.next")
            }}
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>

        <!-- Progress bar -->
        <v-progress-linear
          :model-value="((currentIndex + 1) / messages.length) * 100"
          color="primary"
          class="mt-4"
          height="8"
          rounded
        ></v-progress-linear>

        <!-- Dialog finale -->
        <v-dialog v-model="finalDialog" persistent max-width="500">
          <v-card>
            <v-card-title class="text-h6 font-weight-bold bg-success text-white pa-4">
              {{ t("educational.tasks.spothate.completedTitle") }}
            </v-card-title>
            <v-card-text class="pa-6">
              <div class="text-center mb-4">
                <v-icon size="64" color="success">mdi-check-circle-outline</v-icon>
              </div>
              <p class="text-center text-h6">{{ finalMessage }}</p>
              <v-divider class="my-4"></v-divider>
              <div class="text-center">
                <p class="text-subtitle-1">
                  {{ t("educational.tasks.spothate.score") }}:
                  <strong>{{ correctAnswers }} / {{ messages.length }}</strong>
                </p>
              </div>
            </v-card-text>
            <v-card-actions class="justify-center pb-4">
              <v-btn color="success" size="large" @click="goToNextActivity">
                {{ t("educational.tasks.spothate.finish") }}
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
import { formatDate } from "@/services/utility";

const { t } = useI18n();
const router = useRouter();
const statusHeaderTitle = computed(() => {
  if (!currentMessage.value) return "";
  if (currentMessage.value.type === "hate")
    return t("message.header.hateLabel");
  if (currentMessage.value.type === "checkworthy")
    return t("message.header.checkLabel");
  return "";
});
// === Definizione dataset IDs ===
const messageIds = [
  { id: "hs_example1", type: "hate" },
  { id: "hs_example2", type: "hate" },
  { id: "hs_example3", type: "hate" },
  { id: "hs_example4", type: "hate" },
  { id: "hs_example5", type: "hate" },
  { id: "hs_example6", type: "hate" },
  { id: "cw_example1", type: "checkworthy" },
  { id: "cw_example2", type: "checkworthy" },
  { id: "cw_example3", type: "checkworthy" },
  { id: "cw_example4", type: "checkworthy" },
  { id: "cw_example5", type: "checkworthy" },
  { id: "cw_example6", type: "checkworthy" },
];

const messages = ref<any[]>([]);
const currentIndex = ref(0);
const selectedIndex = ref<number | null>(null);
const showFeedback = ref(false);
const finalDialog = ref(false);
const correctAnswers = ref(0);

// === Carica messaggi da i18n e randomizza ===
onMounted(() => {
  const data = messageIds.map((m) => {
    // Genera dati fittizi realistici per simulare il ChatTable
    const randomDate = new Date(2024, 9, Math.floor(Math.random() * 28) + 1);
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    randomDate.setHours(randomHour, randomMinute);

    const userNames = [
      "Alice",
      "Bob",
      "Charlie",
      "Diana",
      "Eva",
      "Frank",
      "Grace",
      "Henry",
    ];
    const randomUser = userNames[Math.floor(Math.random() * userNames.length)];
    const randomReactions = Math.floor(Math.random() * 15);

    // Alcuni messaggi hanno media
    const hasMedia = Math.random() > 0.7;
    const mediaTypes = ["photo", "video", "webpage"];
    const randomMedia = hasMedia
      ? mediaTypes[Math.floor(Math.random() * mediaTypes.length)]
      : null;

    return {
      id: m.id,
      type: m.type,
      message: t(`educational.tasks.spothate.dataset.${m.id}.text`),
      label: t(`educational.tasks.spothate.dataset.${m.id}.label`),
      explanation: t(`educational.tasks.spothate.dataset.${m.id}.explanation`),
      from_user: randomUser,
      date: randomDate.toISOString(),
      nr_reactions: randomReactions,
      media_type: randomMedia,
    };
  });
  messages.value = data.sort(() => 0.5 - Math.random());
});
function getStatusIcon(label: string) {
  switch (label.toLowerCase()) {
    case "hate speech":
      return "mdi-emoticon-angry";
    case "not hate speech":
      return "mdi-emoticon-happy-outline";
    case "checkworthy":
      return "mdi-alert-outline";
    case "not checkworthy":
      return "mdi-check-circle-outline";
    default:
      return "mdi-help-circle-outline";
  }
}

function getStatusColor(label: string) {
  switch (label.toLowerCase()) {
    case "hate speech":
      return "red";
    case "checkworthy":
      return "orange";
    case "not hate speech":
    case "not checkworthy":
      return "green";
    default:
      return "grey";
  }
}
const currentMessage = computed(() => messages.value[currentIndex.value]);
const isLast = computed(() => currentIndex.value === messages.value.length - 1);

// === Domanda dinamica ===
const currentQuestion = computed(() => {
  const msg = currentMessage.value;
  if (!msg) return "";
  if (msg.type === "hate") return t("educational.tasks.spothate.questions.hate");
  if (msg.type === "checkworthy")
    return t("educational.tasks.spothate.questions.checkworthy");
  return "";
});

// === Opzioni dinamiche ===
const options = computed(() => {
  const msg = currentMessage.value;
  if (!msg) return [];
  if (msg.type === "hate")
    return [
      t("educational.tasks.spothate.answers.hate_yes"),
      t("educational.tasks.spothate.answers.hate_no"),
    ];
  if (msg.type === "checkworthy")
    return [
      t("educational.tasks.spothate.answers.check_yes"),
      t("educational.tasks.spothate.answers.check_no"),
    ];
  return [];
});

// === Logica quiz ===
const isAnswerCorrect = computed(() => {
  const msg = currentMessage.value;
  if (!msg || selectedIndex.value === null) return false;
  const correct =
    (msg.label === "hate speech" && selectedIndex.value === 0) ||
    (msg.label === "not hate speech" && selectedIndex.value === 1) ||
    (msg.label === "checkworthy" && selectedIndex.value === 0) ||
    (msg.label === "not checkworthy" && selectedIndex.value === 1);
  return correct;
});

const getColor = (user: string) => {
  if (!user) return "#f5f5f5";
  const colors = [
    "#d1f0d1",
    "#ffdede",
    "#d1e0fa",
    "#fde6d3",
    "#f2d9e6",
    "#d3f8f2",
    "#fdf5c9",
    "#e3d7fc",
    "#d4eaff",
    "#e9f7d3",
  ];

  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  return colors[hashCode(user) % colors.length];
};

const getIcon = (type: string) => {
  switch (type) {
    case "photo":
      return "mdi-image";
    case "webpage":
      return "mdi-web";
    case "video":
      return "mdi-video-box";
    default:
      return "mdi-message";
  }
};

const formatDisplayDate = (date: string) => {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
  });
};

function selectAnswer(index: number) {
  if (showFeedback.value) return;
  selectedIndex.value = index;
  showFeedback.value = true;
  if (isAnswerCorrect.value) {
    correctAnswers.value++;
  }
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
    // Decrementa il conteggio se la risposta precedente era corretta
    if (selectedIndex.value !== null && isAnswerCorrect.value) {
      correctAnswers.value--;
    }
    currentIndex.value--;
    selectedIndex.value = null;
    showFeedback.value = false;
  }
}

function finishQuiz() {
  finalDialog.value = true;
}

function goToNextActivity() {
  finalDialog.value = false;
  router.replace("/educational");
}

const feedbackMessage = computed(() =>
  isAnswerCorrect.value
    ? t("educational.tasks.spothate.feedback.correct")
    : t("educational.tasks.spothate.feedback.incorrect")
);

function getOptionClass(index: number) {
  if (!showFeedback.value) return "";
  if (index === selectedIndex.value) {
    return isAnswerCorrect.value ? "correct-answer" : "wrong-answer";
  }
  return "disabled-option";
}

const finalMessage = computed(() => t("educational.tasks.spothate.completed"));
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
  grid-template-columns: 10% 45% 20% 15% 10%;
  align-items: center;
}

.message-header {
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

.message-row {
  border-bottom: 1px solid #e0e0e0;
}

.message-row:hover {
  background-color: #fafafa;
}

.message-row:hover {
  background-color: #fafafa;
}

.header-cell,
.message-cell {
  padding: 12px 16px;
  display: flex;
  align-items: center;
}

.date-cell {
  width: 10%;
  min-width: 80px;
}

.message-content-cell {
  width: 50%;
  min-width: 300px;
}

.from-cell {
  width: 20%;
  min-width: 120px;
}

.reactions-cell {
  width: 15%;
  min-width: 100px;
  justify-content: center;
}

.chat-message {
  margin: 8px 0;
  padding: 10px 15px;
  border-radius: 16px;
  display: inline-block;
  position: relative;
  word-wrap: break-word;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-in-out;
  max-width: 100%;
}

.message-content {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.message-time {
  font-size: 12px;
  color: gray;
  text-align: right;
  margin-top: 4px;
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
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
