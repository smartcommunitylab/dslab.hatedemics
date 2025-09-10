import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "vuetify";

export function useAppLocale() {
  try {
    const { locale } = useI18n();
    return computed(() => locale.value.split("-")[0]);
  } catch {
    const { current } = useLocale();
    return computed(() => current.value.split("-")[0]);
  }
}