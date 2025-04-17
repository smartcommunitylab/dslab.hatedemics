<script setup lang="ts">
import type DrawerMenuItem from '@/interfaces/DrawerMenuItemInterface';
import QuickGuideDialog from '@/components/QuickGuideDialogComponent.vue';
import { API } from '@/services';
import { ref } from 'vue';
const showDialog = ref(false);

const logout = () => {
  API.login.logout()

};
/** Drawer menu items */
const items: DrawerMenuItem[] = [
  {
    title: 'Home',
    icon: 'mdi-home',
    to: { name: 'Home' }
  },
  {
    title: 'Explore',
    icon: 'mdi-information',
    items: [
      {
        title: 'Network',
        icon: 'mdi-graph',
        to: { name: 'Channels' }
      },
      {
        title: 'Channel',
        icon: 'mdi-text-box',
        to: { name: 'Inspector' }
      },
      {
        title: 'Conversation',
        icon: 'mdi-forum',
        to: { name: 'Discussion' }
      }
    ],
    to: { name: 'Dashboard' }
  },
  {
    title: 'Counterspeech Writing',
    icon: 'mdi-chat',
    to: { name: 'projects' }
  },
  {
  title: 'Quick Guide',
  icon: 'mdi-help-circle-outline',
  action: () => (showDialog.value = true)
},
  {
    title: 'Credits',
    icon: 'mdi-information',
    to: { name: 'Credits' }
  },
  {
    title: 'Logout',
    icon: 'mdi-logout',
    action: logout 
  }
];

/** Stato reattivo per tenere sempre espansi i gruppi */
const expandedGroups = ref<Record<string, boolean>>(
  items.reduce((acc, item) => {
    if (item.items) acc[item.title] = true; // Imposta tutti i gruppi a `true` per essere espansi
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
              v-else
              :disabled="!subItem.to"
              :prepend-icon="subItem.icon"
              :title="subItem.title"
              :to="subItem.to"
              link
            />
          </template>
        </v-list-group>
      </template>
    </template>
  </v-list>
  <QuickGuideDialog v-model="showDialog" />

</template>
