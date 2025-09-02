<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-4">{{ t("educational.tasks.bias.title") }}</h1>
    <p class="mb-8">{{ t("educational.tasks.bias.task") }}</p>

    <v-row v-for="i in leftColumn.length" :key="i" class="mb-2">
      <v-col cols="5">
        <v-card
          :style="getItemStyle(leftColumn[i - 1].id, 'left')"
          :class="getItemClass(leftColumn[i - 1].id, 'left')"
          @click="selectItem(leftColumn[i - 1], 'left')"
        >
          <v-card-text class="font-weight-black text-h7 text-center">
            {{ leftColumn[i - 1].label }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card
          :style="getItemStyle(rightColumn[i - 1].id, 'right')"
          :class="getItemClass(rightColumn[i - 1].id, 'right')"
          @click="selectItem(rightColumn[i - 1], 'right')"
        >
          <v-card-text class="mt-4">
            {{ rightColumn[i - 1].label }}
            <span v-if="getPairedLabel(rightColumn[i - 1].id)" class="paired-label">
              {{ getPairedLabel(rightColumn[i - 1].id) }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-4">
      <v-col cols="12" class="text-center">
        <v-btn color="primary" @click="checkPairs">{{ t('educational.tasks.bias.checkButton') }}</v-btn>
        <v-btn color="secondary" class="ml-2" @click="resetAll">{{ t('educational.tasks.bias.resetButton') }}</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" max-width="600">
  <v-card>
    <v-card-title class="text-h6 font-weight-bold">
      {{ t("educational.tasks.bias.summaryTitle") }}
    </v-card-title>
    <v-card-text>
  <p>
    ✅ {{ t('educational.tasks.bias.correct') }}: {{ correctCount }}
  </p>
  <ul>
    <li 
      v-for="pair in matchedPairs.filter(p => p.left && p.right && p.left.id === p.right.id)" 
      :key="pair.left.id"
    >
      <span class="paired-label-popup">{{ pair.left.label }}</span>
    </li>
  </ul>

  <p>
    ❌ {{ t('educational.tasks.bias.incorrect') }}: {{ incorrectCount }}
  </p>
  <ul>
    <li 
      v-for="pair in matchedPairs.filter(p => p.left && p.right && p.left.id !== p.right.id)" 
      :key="pair.left.id + '-wrong'"
    >
      <span class="paired-label-popup">{{ pair.left.label }}</span>
    </li>
  </ul>
  <v-divider class="my-4"></v-divider>

<p class="text-body-1" style="white-space: pre-line">
  {{ t("educational.tasks.bias.reflectionText") }}
</p>

</v-card-text>

    <v-card-actions class="justify-end">
      <v-btn color="primary" @click="showDialog = false">{{ t('common.ok') }}</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { computed } from "vue";


const { t, tm } = useI18n();

function shuffleArray(array: any[]) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

// Raw data
const rawPairs = tm("educational.tasks.bias.pairs");

// Columns
const leftColumn = ref(shuffleArray(rawPairs).map(p => ({ id: p.id, label: p.left })));
const rightColumn = ref(shuffleArray(rawPairs).map(p => ({ id: p.id, label: p.right })));

// State
const showDialog = ref(false);
const selectedLeft = ref(null);
const selectedRight = ref(null);
const matchedPairs = ref<{ left: any; right: any; color: any }[]>([]);
const correctCount = ref(0);
const incorrectCount = ref(0);

// Color palette
const colors = [
  { bg: "#e3f2fd", border: "#1976d2" },
  { bg: "#e8f5e9", border: "#388e3c" },
  { bg: "#fff3e0", border: "#f57c00" },
  { bg: "#fce4ec", border: "#c2185b" },
  { bg: "#ede7f6", border: "#7e57c2" },
  { bg: "#f3e5f5", border: "#8e24aa" },
];
let colorIndex = 0;
const getNextColor = () => colors[colorIndex++ % colors.length];
const correctPairsLabels = computed(() => {
  const labels = matchedPairs.value
    .filter(p => p.left.id === p.right.id)
    .map(p => p.left.label.split(" - ")[0].trim());
  
  console.log("Correct labels:", labels);
  return labels;
});

const incorrectPairsLabels = computed(() => {
  const labels = matchedPairs.value
    .filter(p => p.left.id !== p.right.id)
    .map(p => p.left.label.split(" - ")[0].trim());

  console.log("Incorrect labels:", labels);
  return labels;
});
// Select item
function selectItem(item: any, side: "left" | "right") {
  if (side === "left") selectedLeft.value = item;
  else selectedRight.value = item;

  if (selectedLeft.value && selectedRight.value) {
    matchedPairs.value.push({
      left: selectedLeft.value,
      right: selectedRight.value,
      color: getNextColor(),
    });
    selectedLeft.value = null;
    selectedRight.value = null;
  } 
}

// Get style
function getItemStyle(id: string, side: "left" | "right") {
  const pair = matchedPairs.value.find(pair =>
    side === "left" ? pair.left.id === id : pair.right.id === id
  );
  return pair ? { backgroundColor: pair.color.bg, borderColor: pair.color.border } : {};
}

// Get class
function getItemClass(id: string, side: "left" | "right") {
  const isSelected =
    (side === "left" && selectedLeft.value?.id === id) ||
    (side === "right" && selectedRight.value?.id === id);
  const isMatched = matchedPairs.value.some(pair =>
    side === "left" ? pair.left.id === id : pair.right.id === id
  );
  return { "selected-card": isSelected, "matched-card": isMatched };
}

// Get paired label
const getPairedLabel = (id: string) => {
  const pair = matchedPairs.value.find(p => p.right.id === id);
  return pair ? pair.left.label : null;
};

// Check results
function checkPairs() {
  correctCount.value = matchedPairs.value.filter(p => p.left.id === p.right.id).length;
  incorrectCount.value = matchedPairs.value.length - correctCount.value;
  showDialog.value = true;
}

// Reset
function resetAll() {
  matchedPairs.value = [];
  selectedLeft.value = null;
  selectedRight.value = null;
  correctCount.value = 0;
  incorrectCount.value = 0;
  showDialog.value = false;

  leftColumn.value = shuffleArray(rawPairs).map(p => ({ id: p.id, label: p.left }));
  rightColumn.value = shuffleArray(rawPairs).map(p => ({ id: p.id, label: p.right }));
}
</script>

<style scoped>
.v-card {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 12px;
  height: 100%;
  transition: 0.3s;
}
.selected-card {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
}
.matched-card {
  opacity: 0.85;
  pointer-events: none;
  filter: grayscale(0.3);
}
.paired-label {
  position: absolute;
  top: 8px;
  left: 8px;
  max-width: 90%;
  font-size: 0.8rem;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  z-index: 10;
}
.paired-label-popup {
  display: inline-block;
  max-width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}

</style>
