import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => ({
    token: '',
    username: '',
    is_admin: false,
    user_id: '',
    project_manager: []
  }),
  actions: {
    updateBearer(newToken: string) {
      this.token = newToken
    },
    removeBearer() {
      this.token = ''
    },
    updateUser(newUsername: string, newUserID: string, is_admin: boolean, project_manager: never[]) {
      this.username = newUsername
      this.user_id = newUserID
      this.is_admin = is_admin
      this.project_manager = project_manager
    },
    removeUser() {
      this.username = ''
      this.user_id = ''
      this.is_admin = false
      this.project_manager = []
    },
    removeAll() {
      this.removeBearer()
      this.removeUser()
    },
    isToken() {
      return !!this.token;
    }
  },
  persist: true
})


