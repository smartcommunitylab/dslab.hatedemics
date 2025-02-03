<script setup>
import { useConfig } from "@/store";
const configStore = useConfig();
</script>

<template>
  <div class="locale-switcher">
    <div class="locale-changer">
      <select v-model="$i18n.locale">
        <option
          v-for="locale in $i18n.availableLocales"
          :key="`locale-${locale}`"
          :value="locale"
          @click="configStore.setLocale(locale)"
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
}
</style>
