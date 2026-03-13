<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  const { t, tm } = useI18n();
  
  interface HelplineItem {
    country: string;
    name: string;
    phone: string;
    email: string;
    website: string;
    description: string;
  }
  
  // Reactively reload items when locale changes
  const items = computed<HelplineItem[]>(() => tm('helplines.items') as HelplineItem[]);
  
  const groupedItems = computed(() => {
    return items.value.reduce((groups: Record<string, HelplineItem[]>, item) => {
      const country = item.country;
      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(item);
      return groups;
    }, {});
  });
  </script>
<template>
    <v-container fluid>
      <v-expansion-panels variant="accordion" elevation="0" class="ma-4">
        <v-expansion-panel>
          <v-expansion-panel-title expand-icon="" collapse-icon="" v-slot="{ expanded }">
            <div class="d-flex align-center w-100">
              <h1 class="text-h5 font-weight-bold me-2">{{ t("helplines.title") }}</h1>
              <span class="ms-5">{{ expanded ? t("common.showLess") : t("common.showMore") }}</span>
              <v-icon :icon="expanded ? 'mdi-menu-up' : 'mdi-menu-down'" class="me-2" />
            </div>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <p class="text-body-1">{{ t("helplines.description") }}</p>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
  
      <v-container>
        <!-- Group by country -->
        <div v-for="(countryItems, country) in groupedItems" :key="country" class="mb-6">
          <h2 class="text-h6 font-weight-bold mb-3 d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
            {{ country }}
          </h2>
          <v-row>
            <v-col
              v-for="(item, index) in countryItems"
              :key="index"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card elevation="2" class="h-100 pa-4" color="#f4f6fa">
                <v-card-title class="text-subtitle-1 font-weight-bold pb-1 text-wrap">
                    {{ item.name }}
                </v-card-title>
                <v-card-text>
                  <p class="text-body-2 mb-3">{{ item.description }}</p>
  
                  <div v-if="item.phone" class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2" color="primary">mdi-phone</v-icon>
                    <span class="text-body-2" style="white-space: pre-line">{{ item.phone }}</span>
                  </div>
  
                  <div v-if="item.email" class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2" color="primary">mdi-email</v-icon>
                    <a :href="`mailto:${item.email}`" class="text-body-2">{{ item.email }}</a>
                  </div>
  
                  <div v-if="item.website" class="d-flex align-center mb-2">
                    <v-icon size="small" class="mr-2" color="primary">mdi-web</v-icon>
                    <a :href="item.website" target="_blank" rel="noopener" class="text-body-2 text-truncate">
                      {{ item.website }}
                    </a>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-divider class="mt-4" />
        </div>
      </v-container>
    </v-container>
  </template>
  
  
  
  <style scoped>
  a {
    color: #1976d2;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .text-truncate {
    max-width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  </style>