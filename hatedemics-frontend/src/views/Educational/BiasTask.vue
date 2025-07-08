<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-4">{{ t("educational.tasks.bias.title") }}</h1>
    <p class="mb-8">{{ t("educational.tasks.bias.task") }}</p>

    <v-row v-for="i in leftColumn.length" :key="i" class="mb-2">
      <v-col cols="5">
        <v-card
          :class="getItemClass(leftColumn[i - 1].id, 'left')"
          @click="selectItem(leftColumn[i - 1], 'left')"
        >
          <v-card-text>{{ leftColumn[i - 1].label }}</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card
          :class="getItemClass(rightColumn[i - 1].id, 'right')"
          @click="selectItem(rightColumn[i - 1], 'right')"
        >
          <v-card-text>{{ rightColumn[i - 1].label }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="checkPairs">Verifica le coppie</v-btn>
        <v-btn color="secondary" class="ml-2" @click="resetAll">Reset</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ t("educational.tasks.bias.summaryTitle") }}
        </v-card-title>
        <v-card-text>
          <p>✅ Corrette: {{ correctCount }}<br />❌ Errate: {{ incorrectCount }}</p>

          <v-divider class="my-4"></v-divider>

          <p class="text-body-1" style="white-space: pre-line">
            {{ t("educational.tasks.bias.reflectionText") }}
          </p>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn color="primary" @click="showDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const { t, tm } = useI18n();

function shuffleArray(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

const rawPairs = tm("educational.tasks.bias.pairs");

const leftColumn = ref(shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.left })));
const rightColumn = ref(
  shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.right }))
);

const correctMatches = rawPairs.reduce((acc, p) => {
  acc[p.id] = p.id;
  return acc;
}, {});
const selected = ref({ id: null, column: null });
const matches = ref({});
const matchedState = ref({}); // {a: 'correct'/'wrong'}
const showDialog = ref(false);
const feedbackMessage = ref("");

const selectedLeft = ref(null);
const selectedRight = ref(null);
const matchedPairs = ref([]); // Array di { left, right }

function checkPairs() {
  let correct = 0;
  let incorrect = 0;

  matchedPairs.value.forEach((pair) => {
    if (pair.left.id === pair.right.id) {
      correct++;
    } else {
      incorrect++;
    }
  });

  correctCount.value = correct;
  incorrectCount.value = incorrect;

  // Puoi sostituire questo testo con quello che mi fornirai
  feedbackMessage.value = `Hai completato il task! ✅ Corrette: ${correct} | ❌ Errate: ${incorrect}`;
  showDialog.value = true;
}

function selectItem(item, side) {
  if (side === "left") {
    selectedLeft.value = item;
  } else {
    selectedRight.value = item;
  }

  if (selectedLeft.value && selectedRight.value) {
    matchedPairs.value.push({
      left: selectedLeft.value,
      right: selectedRight.value,
    });
    selectedLeft.value = null;
    selectedRight.value = null;
  }
}

function getItemClass(id, side) {
  const isSelected =
    (side === "left" && selectedLeft.value?.id === id) ||
    (side === "right" && selectedRight.value?.id === id);

  const isMatched = matchedPairs.value.some((pair) =>
    side === "left" ? pair.left.id === id : pair.right.id === id
  );

  return {
    "selected-card": isSelected,
    "matched-card": isMatched,
  };
}

function resetAll() {
  matchedPairs.value = [];
  selectedLeft.value = null;
  selectedRight.value = null;
  correctCount.value = 0;
  incorrectCount.value = 0;
  showDialog.value = false;

  // Rimescola le colonne (opzionale)
  leftColumn.value = shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.left }));
  rightColumn.value = shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.right }));
}

const correctCount = ref(0);
const incorrectCount = ref(0);
</script>

<style scoped>
.v-card {
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.3s;
  border-radius: 12px;
  height: 100%;
}

.v-card.selected {
  background-color: #d9ecff;
  border-color: #2196f3;
}

.v-card.matched-correct {
  background-color: #c8f7c5;
  border-color: #2ecc71;
}

.v-card.matched-wrong {
  background-color: #f7c5c5;
  border-color: #e74c3c;
}
.selected-card {
  border: 2px solid #1976d2; /* blu */
  background-color: #e3f2fd; /* azzurro chiaro */
}

.matched-card {
  border: 2px dashed #7e57c2; /* viola medio */
  background-color: #ede7f6; /* viola molto chiaro */
  opacity: 0.85;
  pointer-events: none;
  filter: grayscale(0.3);
}
</style>
