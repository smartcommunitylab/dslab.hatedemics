<script setup lang="ts">
import { useGlobal, useConfig } from '@/store';
import {
  computed,
  nextTick,
  onMounted,
  ref,
  watch,
  type ComputedRef,
  type Ref,
  type WritableComputedRef
} from 'vue';
import { useTheme } from 'vuetify';

// Components
import logo from '@/assets/credits/hatedemics_transparent.png';
import AppBarMenuComponent from '@/components/AppBarMenuComponent.vue';
import DrawerComponent from '@/components/DrawerComponent.vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
/** Vuetify Theme */
const theme = useTheme();
/** Global Store */
const globalStore = useGlobal();

/** Config Store */
const configStore = useConfig();

/** Title */
const title = import.meta.env.VITE_APP_TITLE ?? 'Vuetify3 Application';

/** drawer visibility */
const drawer: Ref<boolean> = ref(false);

/** loading overlay visibility */
const loading: WritableComputedRef<boolean> = computed({
  get: () => globalStore.loading,
  set: v => globalStore.setLoading(v)
});

/** Appbar progressbar value */
const progress: ComputedRef<number | null> = computed(() => globalStore.progress);

/** Snackbar visibility */
const snackbarVisibility: Ref<boolean> = ref(false);

/** Snackbar text */
const snackbarText: ComputedRef<string> = computed(() => globalStore.message);

/** Toggle Dark mode */
// const isDark: ComputedRef<string> = computed(() => (configStore.theme ? 'dark' : 'light'));
  const isDark: ComputedRef<string> = computed(() => (configStore.theme ? 'darkTheme' : 'lightTheme'));
    const canGoBack = ref(false);

const updateCanGoBack = () => {
  canGoBack.value = route.path !== "/home" && router.options.history.state.back !== null;

};

// When snackbar text has been set, show snackbar.
watch(
  () => globalStore.message,
  message => (snackbarVisibility.value = message !== '')
);
watch(route, updateCanGoBack);

/** Clear store when snackbar hide */
const onSnackbarChanged = async () => {
  globalStore.setMessage();
  await nextTick();
};


onMounted(() => {
  // document.title = title;
  updateCanGoBack();
  console.log(import.meta.env.VITE_APP_AXIOS_URL);
  console.log(import.meta.env);

});
</script>

<template>
  <v-app :theme="isDark">
    <v-navigation-drawer
      v-model="drawer"
      temporary
      v-if="!route.meta.hideNavbar"
      :rail="true"
      rail-width="300"
      class="bg-primary text-on-primary"
      app
      permanent
    >
    
      <drawer-component />
    </v-navigation-drawer>

    <v-app-bar v-if="!route.meta.hideSideMenu" class="bg-primary text-on-primary">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-btn v-if="canGoBack" icon @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      
      <v-app-bar-title tag="h1" class="font-weight-bold ">
      <div class="header-bar">
        <v-img :src="logo" class="mr-2 img-logo" max-height="30" max-width="30"  />{{ title }}
        </div>
      </v-app-bar-title>
      <v-spacer />
      <app-bar-menu-component />
      <v-progress-linear
        v-show="loading"
        :active="loading"
        :indeterminate="progress === null"
        :model-value="progress !== null ? progress : 0"
        color="blue-accent-3"
      />
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component, route }">
        <!--transition :name="route.meta.transition as string || 'fade'"-->
        <component :is="Component" :key="route.path" />
        <!--/transition-->
      </router-view>
    </v-main>

    <v-overlay v-model="loading" app class="justify-center align-center" persistent>
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <v-snackbar v-model="snackbarVisibility" @update:model-value="onSnackbarChanged">
      {{ snackbarText }}
      <template #actions>
        <v-btn icon="mdi-close" @click="onSnackbarChanged" />
      </template>
    </v-snackbar>
    <v-footer app elevation="3" color="primary">
  <span class="text-white mr-4">2025 &copy; 
    <a href="https://hatedemics.eu" class="text-white" target="_blank" rel="noopener noreferrer">Hatedemics</a> is a Project Funded by the European Union CERV-2023-CHAR-LITI-SPEECH 🇪🇺
  </span>
</v-footer>
  </v-app>
  <teleport to="head">

    <link rel="icon" :href="logo" type="image/svg+xml" />
  </teleport>
</template>

<style lang="scss">
/* stylelint-disable-next-line scss/load-no-partial-leading-underscore */
@use 'vuetify/_settings';

html {
  // Fix always scrollbar shown.
  overflow-y: auto;
  // Modern scrollbar style
  scrollbar-width: thin;
  scrollbar-color: map-get(settings.$grey, "lighten-2") map-get(settings.$grey, "base");
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
  background-color: map-get(settings.$grey, "lighten-2");
}

::-webkit-scrollbar-thumb {
  border-radius: 0.5rem;
  background-color: map-get(settings.$grey, "base");
  box-shadow: inset 0 0 0.5rem rgba(0, 0, 0, 0.1);
}
.header-bar{
  display:flex;
 
}
.img-logo{
  background:white;
  border-radius:2px;
}
// Fixed a bug that the theme color is interrupted when scrolling
.v-application {
  overflow-y: auto;
  background-color: white;
}

// Fix app-bar's progress-bar
.v-app-bar .v-progress-linear {
  position: absolute;
  bottom: 0;
}
</style>
