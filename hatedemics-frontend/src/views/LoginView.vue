<script setup lang="ts">
// import API.dialogs from './API.dialogs'
import { computed, onMounted, ref } from "vue";
import { useLoginStore } from "../store/LoginStore";
import { useRouter } from "vue-router";
import { useGlobal } from "@/store";
import { API } from "@/services";
import { useI18n } from "vue-i18n";

const globalStore = useGlobal();
const { t, locale } = useI18n();
const router = useRouter();
const loginStore = useLoginStore();
const loading = ref(false);
const username = ref("");
const password = ref("");
const showSnackbar = (message: string) => globalStore.setMessage(message);
const guidePdf = computed(() => {
  const lang = locale.value.split("-")[0];
  return `/toolkit/toolkit_${lang}.pdf`;
});
async function submit() {
  try {
    const { status, data } = await API.login.login(username.value, password.value);
    loading.value = true;

    if (status === 200) {
      loginStore.updateBearer(data.access_token);
      loginStore.updateUser(
        username.value,
        data.user_id,
        data.is_admin,
        data.project_manager
      );
      loading.value = false;
      showSnackbar(t("login.success"));
      router.replace({ name: "Home" });
    }
  } catch (error) {
    showSnackbar(t("login.error"));
    console.error("Login error:", error);
    loading.value = false;

  }
}
onMounted(() => {
  if (localStorage.getItem("token")) {
    //Tries to load projects with stored token. If '401' goes back to 'login'
  }
});
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center" class="h-100">
      
      <!-- Colonna Sinistra: Area Pubblica -->
      <v-col cols="12" md="5" class="d-flex flex-column align-center justify-center">
        <v-card elevation="6" class="pa-8 w-100 text-center" color="#f4f6fa" max-width="500">
          <v-icon color="primary" size="64" class="mb-4">mdi-school-outline</v-icon>
          <h2 class="text-h4 font-weight-bold mb-4">{{ t("home.educational") }}</h2>
          <p class="text-body-1 mb-6">
            {{ t("home.educationalDescription") }}
          </p>
          <v-btn 
            color="primary" 
            size="x-large" 
            variant="flat" 
            to="/educational" 
            block
            class="mb-4"
          >
            {{ t("home.educationalButton") }}
          </v-btn>
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            :href="guidePdf"
            target="_blank"
            prepend-icon="mdi-book-open"
            block
          >
            {{ t("educational.toolkit") }}
          </v-btn>
        </v-card>
      </v-col>

      <!-- Divisore per Desktop -->
      <v-col cols="12" md="1" class="d-flex justify-center hidden-sm-and-down">
        <v-divider vertical class="my-8"></v-divider>
      </v-col>

<!-- Colonna Destra: Login -->
<v-col cols="12" md="5" class="d-flex flex-column align-center justify-center">
        <v-card elevation="6" class="pa-8 w-100" max-width="500">
          <div class="text-center mb-6">
            <v-icon color="primary" size="48">mdi-account-circle</v-icon>
            <h2 class="text-h4 font-weight-bold mt-2">{{ t("login.advancedFeatures") }}</h2>
            <p class="text-subtitle-1 text-medium-emphasis mt-1">{{ t("login.subtitle") }}</p>
          </div>

          <v-form @submit.prevent="submit" :disabled="loading">
            <v-text-field
              v-model="username"
              :label="t('login.username', 'Username')"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mb-2"
            />
            <v-text-field
              v-model="password"
              :label="t('login.password', 'Password')"
              type="password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              class="mb-6"
            />
            <v-btn
              color="primary"
              size="x-large"
              type="submit"
              block
              :loading="loading"
              :disabled="loading"
            >
              {{ t("login.button", "Accedi") }}
            </v-btn>
          </v-form>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>
