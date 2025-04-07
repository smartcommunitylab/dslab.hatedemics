<script setup>
import { useConfig } from "@/store";
import { useTheme } from "vuetify";
import { VSelect } from 'vuetify/components'; // Importa il componente VSelect

const configStore = useConfig();
const theme = useTheme();
</script>

<template>
  <div class="locale-switcher">
    <!-- Barra di selezione della lingua -->
    <v-select
      v-model="$i18n.locale"
      :items="$i18n.availableLocales"
      @change="configStore.setLocale($event)"
      hide-details
      dense
      class="locale-select"
      item-text="locale"
      item-value="locale"
      :menu-props="{ maxHeight: '300' }"
    />
  </div>
</template>

<style scoped>
/* Stili personalizzati per il v-select */
.locale-select {
  width: 150px;
  margin: 8px;
  font-size: 16px;
  background-color: var(--v-theme-surface); /* Rimuove la trasparenza */
  border-radius: 8px;
  border: 2px solid var(--v-theme-primary); /* Imposta il bordo */
}

/* Rimuovi la label (di default Vuetify aggiunge una label) */
.v-select .v-input__control .v-input__slot {
  padding: 8px 12px; /* Padding personalizzato per la selezione */
}

/* Stile per la selezione dell'elemento */
.v-select .v-select__selection {
  color: var(--v-theme-on-surface); /* Colore del testo selezionato */
  background-color: var(--v-theme-surface); /* Rimuove la trasparenza */
  padding: 8px 12px;
}

/* Stile per il menu a discesa */
.v-select .v-menu__content {
  background-color: var(--v-theme-surface); /* Imposta lo sfondo del menu */
  border-radius: 8px;
}

/* Rimuovi il testo sopra la selezione (la label) */
.v-select .v-input__control .v-label {
  display: none;
}

/* Cambia il colore dell'elemento selezionato al passaggio del mouse */
.v-select .v-select__item--active {
  background-color: var(--v-theme-primary); 
  color: var(--v-theme-on-primary);
}
</style>
