<script>
import { useNewTaskStore } from '@/store/DialogStore'
import {useLoginStore} from '@/store/LoginStore'
import { API } from "@/services";
import TaskAnnotations from '@/components/singleFileComponents/task-annotations.vue'
import DynamicButton from '@/components/singleFileComponents/dynamic-button.vue'
import DialogGeneric from '@/components/dialogs/dialog-generic.vue'

function addChildren(obj, annotations, index) {
  if (Object.prototype.hasOwnProperty.call(annotations, index)) {
    obj.children = []
    for (let a of annotations[index]) {
      obj.children.push(a)
      addChildren(a, annotations, a.id)
    }
  }
}

export default {
  components: {
    DialogGeneric,
    TaskAnnotations,
    DynamicButton
  },
  emits: ['openNewProject'],
  data() {
    return {
      newTaskStore: useNewTaskStore(),
      loginStore: useLoginStore(),
      projectName: undefined,
      tasks: undefined,
      projectID: undefined,
      users: undefined,
      files: undefined,
      taskPanels: [],
      annotations: [],
      dialogNewTask: false
    }
  },
  mounted: function () {
    this.loadData()
    // const self = this
    // API.dialogs.getProjectByID(this.id).then(function (data) {
    //   self.projectName = data.data.name
    //   self.tasks = data.data.tasks
    //   self.users = data.data.users
    //   self.files = data.data.files
    // })
  },
  computed: {
    isManager: function () {
      return this.loginStore.is_admin || this.loginStore.project_manager.includes(this.projectID)
    }
  },
  methods: {
    addAnnotation: function (task_id, parent) {
      if (parent === 0) {
        this.$router.push({
          name: 'annotation',
          params: { projectID: this.projectID, taskID: task_id }
        })
      } else {
        this.$router.push({
          name: 'annotation_parent',
          params: { projectID: this.projectID, taskID: task_id, annotationParent: parent }
        })
      }
    },
    editAnnotation: function (task_id, annotation_id) {
      this.$router.push({
        name: 'annotation_edit',
        params: { projectID: this.projectID, taskID: task_id, annotationID: annotation_id }
      })
    },
    deactivateTask: function (task_id) {
      const self = this
      API.dialogs.deactivateTask(this.projectID, task_id).then(function () {
        self.loadData()
      })
    },
    activateTask: function (task_id) {
      const self = this
      API.dialogs.activateTask(this.projectID, task_id).then(function () {
        self.loadData()
      })
    },
    closeAnnotation: function (task_id, id) {
      const self = this
      API.dialogs.closeAnnotation(this.projectID, task_id, id).then(function () {
        self.loadData()
      })
    },
    reopenAnnotation: function (task_id, id) {
      const self = this
      API.dialogs.reopenAnnotation(this.projectID, task_id, id).then(function () {
        self.loadData()
      })
    },
    loadData: function () {
      const self = this
      API.dialogs.getProjectByID(this.$route.params.projectID).then(function (data) {
        self.projectID = self.$route.params.projectID
        self.projectName = data.data.name
        self.tasks = data.data.tasks
        self.users = data.data.users
        self.files = data.data.files

        for (let t of data.data.tasks) {
          let new_task = {}
          new_task.id = 'task-' + t.id
          new_task.title = t.name
          // new_task.children = [];

          let tmp_annotations = {}
          for (let a of t.annotations) {
            if (!Object.prototype.hasOwnProperty.call(tmp_annotations, a.parent)) {
              tmp_annotations[a.parent] = []
            }
            tmp_annotations[a.parent].push({
              id: a.id,
              title: a.user.username,
              user_id: a.user.id,
              subtitle: a.comment,
              closed: a.closed
            })
          }

          addChildren(new_task, tmp_annotations, 0)

          self.annotations[t.id] = new_task
        }
      })
    },
    collapseAll: function () {
      this.taskPanels = []
    },
    expandAll: function () {
      this.collapseAll()
      for (let task of this.tasks) {
        this.taskPanels.push('task-' + task.id)
      }
    }
  }
}
</script>

<template>
  <v-container fluid v-if="tasks === undefined">
    <v-row>
      <v-col cols="12">
        <v-progress-circular indeterminate class="mx-auto" :size="128"></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid v-else>
    <DialogGeneric
      v-model="dialogNewTask"
      component-file="./dialog-task.vue"
      @refresh="loadData"
      :data="{ users: users, files: files, projectID: Number(projectID) }"
    ></DialogGeneric>
    <v-row justify="center">
      <v-col cols="6">
        <p class="text-h2">Project "{{ projectName }}" Tasks</p>
      </v-col>
      <v-col cols="6" class="text-right">
        <v-btn-group variant="elevated" density="comfortable">
          <v-btn icon="mdi-expand-all" @click="expandAll"></v-btn>
          <v-btn icon="mdi-collapse-all" @click="collapseAll"></v-btn>
        </v-btn-group>
        <v-btn color="primary" variant="elevated" class="ms-3" @click.stop="dialogNewTask = true"
          >Add New</v-btn
        >
        <!--        <TaskDialog :users="this.users" :files="this.files" :projectID="Number(this.id)" class="ms-3"></TaskDialog>-->
      </v-col>
    </v-row>

    <v-list lines="two">
      <v-expansion-panels multiple v-model="taskPanels">
        <v-expansion-panel v-for="task of tasks" :key="task.id" :value="'task-' + task.id">
          <v-expansion-panel-title class="item-title">
            <v-row no-gutters>
              <v-col class="d-flex justify-start" cols="12">
                <v-list-item :subtitle="task.id" :title="task.name" class="task-item">
                  <template v-slot:prepend>
                    <v-avatar :color="task.is_active ? 'green-lighten-1' : 'red-lighten-1'">
                      <v-icon color="white">mdi-head-cog</v-icon>
                    </v-avatar>
                  </template>

                  <template v-slot:append>
                    <DynamicButton
                      v-if="task.is_active"
                      class="ms-3"
                      text="Add annotation"
                      color="blue-lighten-1"
                      icon="mdi-text-box-plus"
                      @click.stop="addAnnotation(task.id, 0)"
                    ></DynamicButton>
                    <template v-if="isManager">
                      <DynamicButton
                        v-if="task.is_active"
                        class="ms-3"
                        text="Disable"
                        color="red-lighten-1"
                        icon="mdi-lock"
                        @click.stop="deactivateTask(task.id)"
                      ></DynamicButton>
                      <DynamicButton
                        v-else
                        class="ms-3"
                        text="Enable"
                        color="green-lighten-1"
                        icon="mdi-lock-open-variant"
                        @click.stop="activateTask(task.id)"
                      ></DynamicButton>
                    </template>
                  </template>
                </v-list-item>
              </v-col>
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <TaskAnnotations
              v-if="annotations[task.id].children"
              :annotations="annotations[task.id].children"
              :is-manager="isManager"
              :task="task"
              @close-annotation="closeAnnotation"
              @reopen-annotation="reopenAnnotation"
              @add-annotation="addAnnotation"
              @edit-annotation="editAnnotation"
              :depth="50"
            >
            </TaskAnnotations>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-list>
  </v-container>
</template>

<style scoped>
.item-title {
  padding: 0 20px 0 10px;
}

.task-item {
  width: 100%;
}
</style>
