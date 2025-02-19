/**
 * Vuetify3 Plugin
 */
import { createVuetify, type VuetifyOptions } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import * as labsComponents from 'vuetify/labs/components';

// Translations provided by Vuetify
import { en } from 'vuetify/locale';

// Misc
import { loadFonts } from '@/plugins/webfontloader';

// Styles
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

await loadFonts();

/**
 * Definizione dei temi personalizzati
 */
const lightTheme = {
  dark: false, // Tema chiaro
  colors: {
    primary: '#D32F2F', // Rosso principale
    secondary: '#B71C1C', // Rosso scuro
    background: '#F5F5F5', // Sfondo chiaro
    surface: '#FFFFFF', // Sfondo per card e altri elementi
    error: '#D50000', // Rosso brillante per errori
    warning: '#FF9800', // Arancione scuro per avvisi
    success: '#4CAF50', // Verde per successo
    info: '#1976D2', // Blu per informazioni
    textPrimary: '#212121', // Testo principale
    textSecondary: '#757575', // Testo secondario
  },
};

const darkTheme = {
  dark: true, // Tema scuro
  colors: {
    primary: '#FF5252', // Rosso acceso
    secondary: '#B71C1C', // Rosso scuro
    background: '#121212', // Sfondo scuro
    surface: '#1E1E1E', // Sfondo per card
    error: '#D50000', 
    warning: '#FF5722',
    success: '#4CAF50',
    info: '#64B5F6',
    textPrimary: '#FFFFFF',
    textSecondary: '#BDBDBD',
  },
};

/**
 * Vuetify Config
 */
let vuetifyConfig: VuetifyOptions = {
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: { en }
  },
  theme: {
    defaultTheme: 'lightTheme', // Imposta il tema di default
    themes: {
      lightTheme,
      darkTheme
    }
  }
};

// Abilita tutti i componenti in DEV mode
if (import.meta.env.DEV) {
  vuetifyConfig = {
    components: { components, labsComponents },
    directives,
    ...vuetifyConfig
  };
}

export default createVuetify(vuetifyConfig);

// Export per test.
export { components, directives };
