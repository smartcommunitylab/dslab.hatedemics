import { createI18n } from "vue-i18n";
import en from "./en.json";
import it from "./it.json";

function loadLocaleMessages() {
  const locales = [{ en: en }, { it: it }];
  const messages:any = {};
  locales.forEach((lang:any) => {
    const key:any = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}
export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  legacy: false,
  messages: loadLocaleMessages(),
});