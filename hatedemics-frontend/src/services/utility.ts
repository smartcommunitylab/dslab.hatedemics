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
      return str === null || str.match(/^ *$/) !== null;
  }
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