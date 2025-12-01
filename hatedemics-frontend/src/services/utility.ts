import type { ChannelInfo } from "./types";
import { useI18n } from 'vue-i18n';
import { useLocale } from 'vuetify';

export function processingChannelInfo(data: ChannelInfo[]) {
    return data.map((item) => {
      return {
        
        ...item,
        linked_chats_ids:  item.linked_chats_ids
        ? JSON.parse(item.linked_chats_ids.replace(/'/g, '"')) 
        : []

            };
    })
    }
    export function processingSingleChannelInfo(item: ChannelInfo) {
      return {

        ...item,
        linked_chats_ids: item.linked_chats_ids
          ? JSON.parse(item.linked_chats_ids.replace(/'/g, '"'))
          : []

      };
  }
  
  export const targetTranslations: Record<string, Record<string, string>> = {
    IT: {
      DISABLED: "Persone con disabilità",
      POC: "Persone nere",
      MIGRANTS: "Migranti",
      WOMEN: "Donne",
      "LGBT+": "LGBTQIA+",
      JEWS: "Ebrei",
      MUSLIMS: "Musulmani",
    },
    PL: {
      DISABLED: "Osoby z niepełnosprawnościami",
      POC: "Czarnoskórzy",
      MIGRANTS: "Migranci",
      WOMEN: "Kobiety",
      "LGBT+": "LGBTQIA+",
      JEWS: "Żydzi",
      MUSLIMS: "Muzułmanie",
    },
    ES: {
      DISABLED: "Personas con discapacidad",
      POC: "Personas negras",
      MIGRANTS: "Migrantes",
      WOMEN: "Mujeres",
      "LGBT+": "LGBTQIA+",
      JEWS: "Hebreos",
      MUSLIMS: "Musulmanes",
    },
    MT: {
      DISABLED: "Individwi b'diżabilità",
      POC: "Czarnoskórzy",
      MIGRANTS: "Migranti",
      WOMEN: "Nisa",
      "LGBT+": "LGBTIQ+",
      JEWS: "Lhud",
      MUSLIMS: "Musulmani",
    },
    EN: {
      DISABLED: "People with disabilities",
      POC: "Black people",
      MIGRANTS: "Migrants",
      WOMEN: "Women",
      "LGBT+": "LGBTQIA+",
      JEWS: "Jews",
      MUSLIMS: "Muslims",
    },
  };


/* ---------------------------------------------------------------------- */
/* 🧩 Creazione automatica della targetMap                                */
/* ---------------------------------------------------------------------- */
export const targetMap: Record<string, string[]> = Object.entries(targetTranslations).reduce(
  (acc, [lang, translations]) => {
    Object.entries(translations).forEach(([key, value]) => {
      if (!acc[key]) acc[key] = [];
      acc[key].push(value);
    });
    return acc;
  },
  {} as Record<string, string[]>
);

/* ---------------------------------------------------------------------- */
/* 🧭 Funzione per normalizzare un target (indipendente dalla lingua)     */
/* ---------------------------------------------------------------------- */export function normalizeTarget(target: string | undefined): string | null {
  if (!target) return null;

  const upper = target.trim().toUpperCase();

  // Gestione speciale per "Black people" e sue varianti (senza considerare spazi)
  const cleanedForPOC = upper.replace(/\s+/g, "");

  for (const [key, variants] of Object.entries(targetMap)) {
    if (key === "POC" || key === "DISABLED") {
      // "Black people" e varianti: confronta ignorando gli spazi
      if (variants.some(v => v.toUpperCase().replace(/\s+/g, "") === cleanedForPOC)) {
        return key;
      }
    } else {
      // Tutti gli altri confronti normali (rispettano spazi)
      if (variants.some(v => v.toUpperCase() === upper)) {
        return key;
      }
    }
  }

  return target;
}
    export function toCamelCaseParams(params: Record<string, any>): Record<string, any> {
      const camelCaseParams: Record<string, any> = {};
    
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          // // Converti la chiave in camelCase
          // const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          const camelKey = key;
          // Se il valore è una stringa con underscore, la converte in camelCase
          if (typeof params[key] === "string") {
            camelCaseParams[camelKey] = params[key].replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
          } else if (Array.isArray(params[key])) {
            // Se il valore è un array, converte i suoi elementi se sono stringhe
            camelCaseParams[camelKey] = params[key].map(item =>
              typeof item === "string" ? item.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()) : item
            );
          } else {
            // Altrimenti mantiene il valore invariato
            camelCaseParams[camelKey] = params[key];
          }
        }
      }
    
      return camelCaseParams;
    }
    export const formatDate = (date: string | Date, locale?: string): string => {
      const userLocale = locale || getCurrentLocale();
      
      return new Intl.DateTimeFormat(userLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    };
    export function isEmptyOrSpaces(str: string | null): boolean {
      if (str === null) return true;

      const normalized = str.trim().toLowerCase();
      return (
        normalized === "" ||
        normalized === "nan" ||
        normalized === "null" ||
        normalized === "undefined"
      );  }
  export const cleanString = (str:string):string =>{
    if (!str) return ''; // Evita errori con stringhe undefined/null
    return str.replace(/[{}'"]/g, ''); // Rimuove parentesi graffe, virgolette singole e doppie
  }
    // Funzione per ottenere il locale corrente da vue-i18n o Vuetify
    const getCurrentLocale = (): string => {
      try {
        const { locale } = useI18n();
        return locale.value;
      } catch {
        const { current } = useLocale();
        return current.value;
      }
    };