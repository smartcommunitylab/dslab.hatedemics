import { createI18n } from "vue-i18n";
import en from "./en.json";
import it from "./it.json";
import pl from "./pl.json";
import es from "./es.json";

function loadLocaleMessages() {
  const locales = [{ en: en }, { it: it }, { pl: pl }, { es: es }];
  const messages:any = {};
  locales.forEach((lang:any) => {
    const key:any = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}
export default createI18n({
  locale:  "en",
  fallbackLocale: "en",
  legacy: false,
  messages: loadLocaleMessages(),
});