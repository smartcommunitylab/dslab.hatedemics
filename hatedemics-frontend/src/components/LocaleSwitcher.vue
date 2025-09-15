<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useConfig } from '@/store';

// store
const configStore = useConfig();
const { locale } = useI18n(); // locale è un Ref<string>

// lista lingue (code, label, flag)
const locales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'pl', label: 'Polski', flag: '🇵🇱' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'mt', label: 'Malti', flag: '🇲🇹' },
];

// selected = codice lingua (string). Lo sincronizziamo con i18n.locale e configStore
const selected = ref<string>(locale.value ?? 'en');

watch(selected, (v) => {
  if (!v) return;
  // aggiorna i18n e lo store quando l'utente cambia selezione
  locale.value = v;
  configStore.setLocale(v);
});

// se qualcun altro cambia locale (es. dall'app), aggiorna la select
watch(locale, (v) => {
  if (v && selected.value !== v) selected.value = v;
});

// computed per ottenere l'oggetto della lingua selezionata (utile nello slot selection)
const selectedLocaleObj = computed(() => locales.find((l) => l.code === selected.value) ?? null);

// helper per selezionare manualmente (usato nel slot item)
function selectCode(code: string) {
  selected.value = code;
}
</script>

<template>
  <div class="locale-switcher">
    <v-select
      v-model="selected"
      :items="locales"
      item-title="label"
      item-value="code"
      hide-details
      density="compact"
      class="locale-select"
      :menu-props="{ maxHeight: '300', closeOnContentClick: true }"
    >
      <!-- Selezione chiusa: mostro solo la bandiera (usiamo il computed per evitare ambiguità) -->
      <template #selection>
        <span class="flag-only">{{ selectedLocaleObj?.flag }} {{ selectedLocaleObj?.label }}</span>
      </template>

      <!-- Menu aperto: ogni voce mostra bandiera + label (singola riga) -->
      <template #item="{ item, props }">
        <v-list-item v-bind="props" @click="selectCode((item as any).raw.code)">
  <v-list-item-title>{{ (item as any).raw.flag }} {{ (item as any).raw.label }}</v-list-item-title>
</v-list-item>
      </template>
    </v-select>
  </div>
</template>

<style scoped>
.locale-switcher {
  display: flex;
  align-items: center;
}

/* chiuso: piccolo, mostra solo la bandiera */
.locale-select {
  min-width: 56px;
  margin: 4px 8px;
  padding: 2px;
  border-radius: 8px;
  border: 1px solid var(--v-theme-outline, rgba(0,0,0,0.12));
  text-align: center;
  margin-right: 16px;
}

/* all'apertura la dropdown userà gli item slot, quindi verrà mostrata la label */
.flag-only {
  font-size: 18px;
  line-height: 1;
}

/* migliorie visive voce menu */
.v-list-item .v-list-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* puoi regolare questo se vuoi un select più largo quando è chiuso */
@media (min-width: 800px) {
  /* es. su schermi grandi puoi aumentare */
  /* .locale-select { width: 72px; min-width:72px; } */
}
</style>
