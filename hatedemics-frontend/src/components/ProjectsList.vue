<script>
import { useVariablesStore } from '@/store/DialogStore'
import { useLoginStore } from '@/store/LoginStore'
import { useGlobal } from '@/store';
import { API } from '@/services'
import ListItem from './singleFileComponents/project-list-item.vue'
import DialogGeneric from '@/components/dialogs/dialog-generic.vue'
import { useI18n } from 'vue-i18n';

export default {
  components: {
    ListItem,
    DialogGeneric
  },
  data() {
    return {
      usersList: undefined,
      showDialogCreateProject: false,
      variablesStore: useVariablesStore(),
      loginStore: useLoginStore(),
      globalStore: useGlobal(),
      ds: API.dialogs,
      t: useI18n().t,
      projects: undefined,
      expandedPanels: [] // Controlla quali sezioni sono aperte
    }
  },
  computed: {
    groupedProjects() {
      return this.groupProjectsByLanguage();
    }
  },
  mounted() {
    this.updateProjects();
    if (this.loginStore.is_admin) {
      this.updateUsers();
    }
  },
  methods: {
    updateUsers() {
      API.login.getUsers().then(data => {
        this.usersList = data.data;
      });
    },
    updateProjects() {
      this.projects = undefined;
      API.dialogs.getProjects().then(
        data => {
          this.projects = data.data;
        },
        error => {
          this.globalStore.setMessage(this.t('error.api'));
          this.projects = [];
        }
      );
    },
    groupProjectsByLanguage() {
      const groups = {
        English: [],
        Polish: [],
        Italian: [],
        Español: [],
        Other: []
      };
      if (!this.projects) return groups;

      this.projects.forEach(project => {
        const match = project.name.match(/(EN|PL|IT|ES)$/);
        const langMap = { EN: 'English', PL: 'Polish', IT: 'Italian', ES: 'Español' };
        const lang = match ? langMap[match[1]] : 'Other';
        groups[lang].push(project);
      });

      return groups;
    }
  }
}
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
          <v-progress-circular indeterminate class="mx-auto" :size="128"></v-progress-circular>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid v-else>
      <v-row justify="center">
        <v-col cols="6">
          <p class="text-h2">Projects</p>
        </v-col>
        <!-- <v-col cols="6" align="right">
          <v-btn color="primary" variant="elevated" @click="showDialogCreateProject = true">
            Add Project
          </v-btn>
        </v-col> -->
      </v-row>

      <v-expansion-panels v-model="expandedPanels" multiple>
        <template v-for="(projects, lang) in groupedProjects" :key="lang">
          <v-expansion-panel v-if="projects.length > 0">
            <v-expansion-panel-title>
              <h3 class="text-h4">{{ lang }}</h3>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <template v-for="project in projects" :key="project.id">
                <ListItem
                  :title="project.name"
                  :users="project.users"
                  :id="project.id"
                  :isActive="project.is_active"
                  @refresh="updateProjects"
                />
              </template>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </template>
      </v-expansion-panels>

      <v-row v-if="groupedProjects.English.length === 0 && groupedProjects.Polish.length === 0 &&
                    groupedProjects.Italian.length === 0 && groupedProjects.Español.length === 0 &&
                    groupedProjects.Other.length === 0">
        <v-col cols="12" class="text-center">
          <p class="text-body-1">{{ t('project.noData') }}</p>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
