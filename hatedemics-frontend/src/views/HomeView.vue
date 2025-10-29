<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
import { onMounted, ref } from "vue";
import { useUserStore } from "@/store/UserStore";
import HomeStepperDialog from "@/components/HomeStepperDialog.vue";
const showDialog = ref(false);
const userStore = useUserStore();

onMounted(() => {
  userStore.syncHideHomeStepperDialogFromStorage();
  if (!userStore.hideHomeStepperDialog) {
    showDialog.value = true;
  }
});

function handleNeverShow() {
  userStore.setHideHomeStepperDialog(true);
  localStorage.setItem("hideHomeStepper", "1");
}
</script>

<template>
  <v-container class="py-10">
    <!-- Logo + descrizione -->
    <v-row justify="center" class="mb-8">
      <v-col cols="12" md="6" class="text-center">
        <v-img
          src="@/assets/credits/hatedemics_transparent.png"
          alt="Hatedemics Logo"
          max-width="150"
          class="mx-auto mb-4"
        />
        <h1 class="text-h4 font-weight-bold mb-2">
          {{ t("home.title") }}
        </h1>
        <p class="text-subtitle-1">
          {{ t("home.description") }}
        </p>
      </v-col>
    </v-row>

    <!-- Card funzionalità -->
    <v-row justify="center" align="stretch" class="mt-4" dense>
      <!-- Card 1: Edu -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-web</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">{{ t("home.educational") }}</h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("home.educationalDescription") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="primary" to="/educational" variant="flat">
              {{ t("home.educationalButton") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
      <!-- Card 2: Esplora la rete -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-web</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">{{ t("home.network") }}</h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("home.networkDescription") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="buttonColor" to="/dashboard/channels" variant="flat">
              {{ t("home.networkButton") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Card 3: Counterspeech -->
      <v-col cols="12" md="4">
        <v-card
          elevation="6"
          class="h-100 pa-5 d-flex flex-column justify-space-between"
          color="#f4f6fa"
        >
          <div>
            <div class="d-flex align-center mb-2">
              <v-icon color="primary" class="mr-2">mdi-message-text-outline</v-icon>
              <h2 class="text-h6 font-weight-bold mb-1">{{ t("home.counterspeech") }}</h2>
            </div>
            <p class="text-body-1 mb-4">
              {{ t("home.counterspeechDescription") }}
            </p>
          </div>
          <div class="text-right mt-6">
            <v-btn color="buttonColor" to="/projects" variant="flat">
              {{ t("home.counterspeechButton") }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <HomeStepperDialog v-model="showDialog" @neverShow="handleNeverShow" />
  
</template>

<style scoped>
h1 {
  color: #1e1e1e;
}
</style>
