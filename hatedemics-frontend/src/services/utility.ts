import type { ChannelInfo } from "./types";

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