<script setup lang="ts">
import type DrawerMenuItem from '@/interfaces/DrawerMenuItemInterface';

/** Drawer menu items */
const items: DrawerMenuItem[] = [
  {
    title: 'Channel Dashboard',
    icon: 'mdi-information',
    items: [
      {
        title: 'Channels',
        icon: 'mdi-graph',
        active: true,
        to: { name: 'Channels' }
      },
      {
        title: 'Inspector',
        icon: 'mdi-text-box',
        to: { name: 'Inspector' }
      },
      {
        title: 'Discussion',
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
    title: 'About',
    icon: 'mdi-information',
    to: { name: 'About' }
  },
  // {
  //   title: 'Disabled Item',
  //   icon: 'mdi-cancel'
  //   // empty `to` value becomes to disabled item
  // }
];
</script>

<template>
  <v-list nav>
    <template v-for="item in items" :key="item.title">
      <v-divider v-if="item.title === '-'" />
      <template v-else>
        <!-- Menu Item -->
        <v-list-item
          v-if="!item.items"
          :disabled="!item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          link
        />
        <!-- Sub menu -->
        <v-list-group v-else-if="item.items" v-model="item.active">
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
</template>
