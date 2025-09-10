<script setup>
import { ref, computed, onMounted } from "vue";
import { useVariablesStore } from "@/store/DialogStore";
import { useLoginStore } from "@/store/LoginStore";
import { useGlobal } from "@/store";
import { API } from "@/services";
import ListItem from "./singleFileComponents/project-list-item.vue";
import DialogGeneric from "@/components/dialogs/dialog-generic.vue";
import { useI18n } from "vue-i18n";
import { useLocale } from "vuetify";

// store e utilità
const variablesStore = useVariablesStore();
const loginStore = useLoginStore();
const globalStore = useGlobal();
const { t } = useI18n();
import { useAppLocale } from "@/composables/useAppLocale";
const current = useAppLocale();

// stato reattivo
const usersList = ref();
const projects = ref();
const showDialogCreateProject = ref(false);

// mapping lingua Vuetify → gruppi
const langMap = {
  en: "English",
  it: "Italian",
  pl: "Polish",
  es: "Spanish",
  mt: "Maltese",
};

// --- funzioni
function groupProjectsByLanguage() {
  const groups = {
    English: [],
    Polish: [],
    Italian: [],
    Spanish: [],
    Maltese: [],
  };
  if (!projects.value) return groups;

  const langOrder = ["Polish", "Italian", "Maltese", "Spanish", "English"];
  projects.value.forEach((project, index) => {
    const lang = langOrder[index % langOrder.length];
    groups[lang].push(project);
  });

  return groups;
}

const groupedProjects = computed(() => groupProjectsByLanguage());

// 🔑 filtra solo quelli della lingua attuale
const currentLanguageProjects = computed(() => {
  console.log("🔄 Recomputing currentLanguageProjects...");
  console.log("current.value:", current.value);

  // normalizza codice lingua
  const shortCode = current.value.split("-")[0]; 
  console.log("shortCode:", shortCode);

  const langKey = langMap[shortCode] || "English";
  console.log("langKey:", langKey);

  return groupedProjects.value[langKey] || [];
});


function updateUsers() {
  API.login.getUsers().then((data) => {
    usersList.value = data.data;
  });
}

function updateProjects() {
  projects.value = undefined;
  API.dialogs.getProjects().then(
    (data) => {
      projects.value = data.data;
    },
    () => {
      globalStore.setMessage(t("error.api"));
      projects.value = [];
    }
  );
}

// lifecycle
onMounted(() => {
  updateProjects();
  if (loginStore.is_admin) {
    updateUsers();
  }
});
</script>

<template>
  <div>
    <DialogGeneric
      v-model="showDialogCreateProject"
      component-file="./dialog-create-project.vue"
      @refresh="updateProjects"
      :data="{ usersList: usersList }"
    />

    <v-container fluid v-if="projects === undefined">
      <v-row>
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            class="mx-auto"
            :size="128"
          ></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-else>
      <h1 class="text-h5 font-weight-bold text-primary ma-4">Projects</h1>
      <h2 class="text-h6 font-weight-medium ma-4">
        {{ t("projects.subtitle") }}
      </h2>

      <!-- ✅ lista piatta filtrata per lingua -->
      <v-row v-if="currentLanguageProjects.length > 0">
        <v-col
          cols="12"
          v-for="project in currentLanguageProjects"
          :key="project.id"
        >
          <ListItem
          class="elevation-0"
            :title="project.name"
            :users="project.users"
            :id="project.id"
            :isActive="project.is_active"
            @refresh="updateProjects"
          />
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col cols="12" class="text-center">
          <p class="text-body-1">{{ t("project.noData") }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
