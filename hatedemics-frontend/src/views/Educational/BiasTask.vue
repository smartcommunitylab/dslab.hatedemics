<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-4">{{ t("educational.tasks.bias.title") }}</h1>
    <p class="mb-8">{{ t("educational.tasks.bias.task") }}</p>

    <div class="cards-container">
      <div class="column-wrapper">
        <h3 class="mb-2">{{ t("educational.tasks.bias.leftColumn") }}</h3>
        <div class="scrollable-column">
          <v-card
            v-for="item in leftColumn"
            :key="item.id"
            :style="getItemStyle(item.id, 'left')"
            :class="getItemClass(item.id, 'left')"
            @click="selectItem(item, 'left')"
            class="mb-2"
          >
            <v-card-text class="card-content">
              <div v-html="item.label" class="truncated-text"></div>
              <v-btn
                icon
                size="x-small"
                @click.stop="openModal(item)"
                class="expand-btn"
              >
                <v-icon size="16">mdi-arrow-expand</v-icon>
              </v-btn>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <div class="column-wrapper">
        <h3 class="mb-2">{{ t("educational.tasks.bias.rightColumn") }}</h3>
        <div class="scrollable-column">
          <v-card
            v-for="item in rightColumn"
            :key="item.id"
            :style="getItemStyle(item.id, 'right')"
            :class="getItemClass(item.id, 'right')"
            @click="selectItem(item, 'right')"
            class="mb-2"
          >
          <v-card-text class="card-content" :class="{ 'has-paired-label': getPairedLabel(item.id) }">
  <span v-if="getPairedLabel(item.id)" class="paired-label">
    <span v-html="getPairedLabel(item.id)"></span>
  </span>
  <div v-html="item.label" class="truncated-text"></div>
  <v-btn
    icon
    size="x-small"
    @click.stop="openModal(item)"
    class="expand-btn"
  >
    <v-icon size="16">mdi-arrow-expand</v-icon>
  </v-btn>
</v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <!-- Modal for expanded content -->
    <v-dialog v-model="showExpandModal" max-width="600">
      <v-card>
        <!-- <v-card-title>{{ t("educational.tasks.bias.fullContent") }}</v-card-title> -->
        <v-card-text>
          <div v-html="expandedItem?.label"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="showExpandModal = false">{{ t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              <!-- render left.label as HTML in popup -->
              <span class="paired-label-popup" v-html="pair.left.label"></span>
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
              <span class="paired-label-popup" v-html="pair.left.label"></span>
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


const { t, tm } = useI18n();

function shuffleArray(array: Pair[]) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

interface Pair {
  id: string;
  left: string;
  right: string;
}

interface MatchedPair {
  left: PairItem;
  right: PairItem;
  color: { bg: string; border: string };
}

interface PairItem {
  id: string;
  label: string; // contains HTML
}



// State
const showDialog = ref(false);
const selectedLeft = ref<PairItem | null>(null);
const selectedRight = ref<PairItem | null>(null);
const matchedPairs = ref<MatchedPair[]>([]);
const correctCount = ref(0);
const incorrectCount = ref(0);
const showExpandModal = ref(false);
const expandedItem = ref<PairItem | null>(null);

function openModal(item: PairItem) {
  expandedItem.value = item;
  showExpandModal.value = true;
}
// Select item
// Select item
function selectItem(item: PairItem, side: "left" | "right") {
  // Check if item is already paired
  const existingPairIndex = matchedPairs.value.findIndex(pair =>
    side === "left" ? pair.left.id === item.id : pair.right.id === item.id
  );

  // If already paired, unpair it
  if (existingPairIndex !== -1) {
    const removedPair = matchedPairs.value.splice(existingPairIndex, 1)[0];
    
    // Set the clicked item as selected
    if (side === "left") {
      selectedLeft.value = removedPair.left;
    } else {
      selectedRight.value = removedPair.right;
    }
    return;
  }

  // Normal selection logic
  if (side === "left") {
    // If clicking the same left item again and no right selected, deselect it
    if (selectedLeft.value?.id === item.id && !selectedRight.value) {
      selectedLeft.value = null;
      return;
    }
    selectedLeft.value = item;
  } else {
    // If clicking the same right item again, deselect it
    if (selectedRight.value?.id === item.id) {
      selectedRight.value = null;
      return;
    }
    selectedRight.value = item;
  }

  // If both selected, create pair
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


const rawPairs: Pair[] = tm("educational.tasks.bias.pairs");
// Columns
const leftColumn = ref<PairItem[]>(
  shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.left }))
);
const rightColumn = ref<PairItem[]>(
  shuffleArray(rawPairs).map((p) => ({ id: p.id, label: p.right }))
);


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
.cards-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.column-wrapper {
  flex: 1;
  max-width: 45%;
}

.scrollable-column {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.scrollable-column::-webkit-scrollbar {
  width: 8px;
}

.scrollable-column::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.v-card {
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 12px;
  transition: 0.3s;
  min-height: 80px;
}

.card-content {
  position: relative;
  padding-right: 40px;
}

.truncated-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expand-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.selected-card {
  border: 2px solid #1976d2;
  background-color: #e3f2fd;
}

.matched-card {
  opacity: 0.85;
}

.paired-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.8rem;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-weight: bold;
}
.has-paired-label {
  padding-top: 36px !important; /* Spazio per la label */
}

.paired-label {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.75rem;
  padding: 4px 8px;
  background-color: rgba(25, 118, 210, 0.1);
  border: 1px solid rgba(25, 118, 210, 0.3);
  border-radius: 4px;
  font-weight: bold;
  max-width: calc(100% - 56px); /* Lascia spazio al bottone expand */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.scrollable-column {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

/* Scrollbar sempre visibile */
.scrollable-column::-webkit-scrollbar {
  width: 10px;
}

.scrollable-column::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollable-column::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.scrollable-column::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Per Firefox */
.scrollable-column {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
</style>
