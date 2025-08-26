<script setup lang="ts">
import type DrawerMenuItem from '@/interfaces/DrawerMenuItemInterface';
import ExploreGuideDialog from '@/components/ExploreGuideDialog.vue';
import CounterspeechGuideDialog from '@/components/CounterspeechGuideDialog.vue';
import { API } from '@/services';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const showExploreGuide = ref(false);
const showCounterspeechGuide = ref(false);

const logout = () => {
  API.login.logout()
};

const items: DrawerMenuItem[] = [
  {
    title: t('menu.home'),
    icon: 'mdi-home',
    to: { name: 'Home' }
  },
  {
    title: t('menu.educational'),
    icon: 'mdi-school-outline',
    to: '/educational'
  },
  {
    title: t('menu.explore'),
    icon: 'mdi-information',
    items: [
      {
        title: t('menu.network'),
        icon: 'mdi-graph',
        to: { name: 'Channels' }
      },
      {
        title: t('menu.channel'),
        icon: 'mdi-text-box',
        to: { name: 'Inspector' }
      },
      {
        title: t('menu.conversation'),
        icon: 'mdi-forum',
        to: { name: 'Discussion' }
      },
      {
        title: t('menu.quickGuide'),
        icon: 'mdi-book-open-outline',
        action: () => (showExploreGuide.value = true)
      }
    ],
    to: { name: 'Dashboard' }
  },
  {
    title: t('menu.counterspeech'),
    icon: 'mdi-message-text-outline',
    to: '/projects',
    items: [
      {
        title: t('menu.projects'),
        icon: 'mdi-folder',
        to: '/projects'
      },
      {
        title: t('menu.quickGuide'),
        icon: 'mdi-book-open-outline',
        action: () => (showCounterspeechGuide.value = true)
      }
    ]
  },
  {
    title: t('menu.credits'),
    icon: 'mdi-information',
    to: { name: 'Credits' }
  },
  {
    title: t('menu.logout'),
    icon: 'mdi-logout',
    action: logout 
  }
];

const expandedGroups = ref<Record<string, boolean>>(
  items.reduce((acc, item) => {
    if (item.items) acc[item.title] = true;
    return acc;
  }, {} as Record<string, boolean>)
);
</script>


<template>
  <v-list nav>
    <template v-for="item in items" :key="item.title">
      <v-divider v-if="item.title === '-'" />
      <template v-else>
        <!-- Menu Item -->
        <v-list-item
          v-if="!item.items && !item.action"
          :disabled="!item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
          :action="item.action"
        />
        <v-list-item
          v-else-if="item.action"
          :prepend-icon="item.icon"
          :title="item.title"
          @click="item.action"
        />
        <!-- Sub menu -->
        <v-list-group v-else-if="item.items" v-model="expandedGroups[item.title]">
          <template #activator="{ props }">
            <v-list-item v-bind="props" :prepend-icon="item.icon" :title="item.title" />
          </template>
          <!-- Sub menu item -->
          <template v-for="subItem in item.items" :key="subItem.title">
            <v-divider v-if="subItem.title === '-'" />
            <v-list-item
              v-else-if="!subItem.action"
              :disabled="!subItem.to"
              :prepend-icon="subItem.icon"
              :title="subItem.title"
              :to="subItem.to"
              link
            />
            <v-list-item
              v-else
              :prepend-icon="subItem.icon"
              :title="subItem.title"
              @click="subItem.action"
              style="cursor:pointer"
            />
          </template>
        </v-list-group>
      </template>
    </template>
  </v-list>
  <ExploreGuideDialog v-model="showExploreGuide" />
  <CounterspeechGuideDialog v-model="showCounterspeechGuide" />

</template>
