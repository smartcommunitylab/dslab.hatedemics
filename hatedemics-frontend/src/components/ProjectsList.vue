<script>
import { useVariablesStore } from '@/store/DialogStore'
import {useLoginStore} from '@/store/LoginStore'
import { useGlobal } from '@/store';
import {API} from '@/services'
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
      showBase: false,
      showDialogCreateProject: false,
      variablesStore: useVariablesStore(),
      loginStore: useLoginStore(),
      globalStore: useGlobal(),
      ds: API.dialogs,
      t: useI18n().t,
      projects: undefined,
    }
  },
  mounted: function () {
    this.updateProjects()
    if (this.loginStore.is_admin) {
      this.updateUsers()
    }
  },
  methods: {

    updateUsers: function () {
      const self = this
      API.login.getUsers().then(function (data) {
        self.usersList = data.data
      })
    },
    updateProjects: function () {
      const self = this
      self.projects = undefined
      API.dialogs.getProjects().then(function (data) {
        self.projects = data.data
      },(error) => {
        self.globalStore.setMessage(self.t('error.api'))

        self.projects = []
      })
    },
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
    ></DialogGeneric>

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
        <v-col cols="6" align="right">
          <v-btn
            color="primary"
            variant="elevated"
            @click="showDialogCreateProject = true"
            >Add Project
          </v-btn>
        </v-col>
        <v-col cols="12" align="center"></v-col>
      </v-row>
      <template  v-if="projects.length === 0">
      <p  class="text-body-1">
        {{ t('project.noData') }}
      </p>
      </template>
      <template v-for="project of projects" :key="project.id">
        <ListItem
          :title="project.name"
          :users="project.users"
          :id="project.id"
          :isActive="project.is_active"
          @refresh="updateProjects"
        />
      </template>

    </v-container>
  </div>
</template>
