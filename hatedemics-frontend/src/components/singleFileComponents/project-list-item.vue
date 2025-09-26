<script>
import DynamicButton from "./dynamic-button.vue";
import DialogConfirm from "../dialogs/dialog-confirm.vue";
import DialogGeneric from "@/components/dialogs/dialog-generic.vue";
import { useNewTaskStore, useVariablesStore } from "@/store/DialogStore";
import { useLoginStore } from "@/store/LoginStore";
import { API } from "@/services";
import { useI18n } from "vue-i18n";

export default {
  components: {
    DialogGeneric,
    ConfirmDialog: DialogConfirm,
    DynamicButton,
  },
  data() {
    return {
      variablesStore: useVariablesStore(),
      newTaskStore: useNewTaskStore(),
      loginStore: useLoginStore(),
      dialogDocs: false,
      dialogUsers: false,
      loadingEditUsers: false,
      dialogNewTask: false,
      t: useI18n().t,
    };
  },
  emits: ["refresh"],
  props: {
    title: String,
    id: Number,
    isActive: Boolean,
  },
  methods: {
    async deleteProject() {
      if (
        await this.$refs.confirm.open(
          "Confirm",
          "Are you sure you want to delete this record?"
        )
      ) {
        API.dialogs.deleteProject(this.id).then(() => {
          this.$emit("refresh");
        });
      }
    },
    manageDocs: function () {
      this.dialogDocs = true;
    },

    manageUsers: function () {
      this.dialogUsers = true;
    },

    // manageTasks: function () {
    //   this.dialogNewTask = true
    // },

    openTaskList: function (id) {
      this.$router.push({
        name: "tasks",
        params: { projectID: id },
      });
    },
  },
};
</script>

<template>
  <v-container fluid>
    <ConfirmDialog ref="confirm"></ConfirmDialog>
    <DialogGeneric
      v-model="dialogDocs"
      component-file="./dialog-manage-docs.vue"
      :data="{ id: id }"
    ></DialogGeneric>
    <DialogGeneric
      v-model="dialogUsers"
      component-file="./dialog-manage-users.vue"
      :data="{ id: id }"
    ></DialogGeneric>

    <v-row class="ma-0 pa-0">
      <v-col cols="12" class="pa-0">
        <v-card @click.prevent="openTaskList(id)" elevation="0" class="hoverable pa-0">
          <v-row align="center" class="ma-0 pa-0">
            <v-col class="ma-0 pa-0">
              <v-row class="d-flex justify-left pa-0 ma-0">
                <v-col cols="12" class="pa-0 ma-0">
                  <v-card-title>{{ title }}</v-card-title>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2" >
              <v-card-actions>
                <DynamicButton
                  icon="mdi-text-box-plus"
                  :text="t('buttons.startDialogue')"
                  @click.prevent="openTaskList(id)"
                />

                <DynamicButton
                  v-if="loginStore.is_admin"
                  class="ms-3"
                  icon="mdi-trash-can-outline"
                  :text="t('buttons.delete')"
                  color="error"
                  @click.stop="deleteProject()"
                />
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!--    <v-dialog v-model="dialogTasks" :max-width="variablesStore.dialogMaxWidth">
      <v-card prepend-icon="mdi-format-list-checks" title="Manage Tasks">
        <v-list lines="two">
          <v-list-subheader>Select the task you wish to edit</v-list-subheader>
          <v-list-item
            v-for="task of this.tasks"
            :key="task.id"
            :title="task.title"
            :subtitle="task.id"
          >
          </v-list-item>
        </v-list>
        <v-card-actions>
          <v-btn color="primary" variant="elevated" text="Add New" />
        </v-card-actions>
      </v-card>
    </v-dialog>-->
  </v-container>
</template>
