<script setup lang="ts">
// import dataService from './dataService'
import { onMounted, ref } from 'vue';
import { useLoginStore } from '../store/LoginStore'
import { useRouter, useRoute } from 'vue-router'
import { useGlobal } from '@/store';
const globalStore = useGlobal();

const router = useRouter();
const route = useRoute()
const loginStore = useLoginStore();
const loading = ref(false);
const isButtonDisabled = ref(false);
const username = ref('');
const password = ref('');
const goodLogin = ref(false);
const showSnackbar = (message: string) => globalStore.setMessage(message);

const regole = ref([
  
])
function submit() {
  globalStore.setMessage("Benvenuti");
  router.push({
    name: 'Home',
    // query: {
    //   ...route.query,
    //   ...query,
    // },
  })
  // const self = this
  //     this.loading = true
  //     dataService
  //       .getToken(this.username, this.password)
  //       .then(function (data) {
  //         self.loginStore.updateBearer(data.data.access_token)
  //         self.loginStore.updateUser(self.username, data.data.user_id, data.data.is_admin, data.data.project_manager)
  //         self.loading = false
  //         self.$router.push({ name: 'projects' })
  //       })
  //       .catch(function (error) {
  //         self.snackbar = true
  //         self.loading = false
  //       })
  //   }
}
 onMounted(() => {
   if (localStorage.getItem('token')) {
     //Tries to load projects with stored token. If '401' goes back to 'login'
   }
 })

</script>

<template>
<v-container class="fill-height" align="center">
    <v-row>
      <v-col>
        <!-- Login handling: if successful, button becomes a spinner and waits for auth. If successful, redirects to 'projects'-->
        <v-sheet class="mx-6" width="300px">
          <div class="text-h4 py-4">Login</div>
          <v-form @submit.prevent="submit" v-model="goodLogin">
            <v-text-field label="Username" v-model="username" :rules="regole"></v-text-field>
            <!-- 'type' is 'password' in order to show **** instead of abcd-->
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              :rules="regole"
            ></v-text-field>
            <v-btn type="submit" class="ma-2" :loading="loading" :disabled="isButtonDisabled"
              >Login</v-btn
            >
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>

</template>
