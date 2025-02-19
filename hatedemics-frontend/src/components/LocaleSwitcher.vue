<script setup>
import { useConfig } from "@/store";
import { useTheme } from "vuetify";

const configStore = useConfig();
const theme = useTheme();
</script>

<template>
  <div class="locale-switcher">
    <div class="locale-changer">
      <select v-model="$i18n.locale" @change="configStore.setLocale($event.target.value)">
        <option
          v-for="locale in $i18n.availableLocales"
          :key="`locale-${locale}`"
          :value="locale"
        >
          {{ locale }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.locale-switcher {
  font-size: 18px;
  margin: 8px;
  display: flex;
  align-items: center;
}

/* 🎨 Stile del select */
select {
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 8px;
  border: 2px solid var(--v-theme-primary);
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
  cursor: pointer;
}

/* 👆 Stile quando il select è in focus o hover */
select:hover,
select:focus {
  background-color: var(--v-theme-primary);
  color: var(--v-theme-on-primary);
}

/* Opzioni */
option {
  background-color: var(--v-theme-surface);
  color: var(--v-theme-on-surface);
}
</style>
