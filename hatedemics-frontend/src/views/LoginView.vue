<script setup lang="ts">
// import API.dialogs from './API.dialogs'
import { onMounted, ref } from 'vue';
import { useLoginStore } from '../store/LoginStore'
import { useRouter, useRoute } from 'vue-router'
import { useGlobal } from '@/store';
import { API } from "@/services";
import { useI18n } from 'vue-i18n';

const globalStore = useGlobal();
const { t } = useI18n();
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
async function submit() {
  // const { status, data } = await API.chats.getChats(1);
  try {

  const { status, data } = await API.login.login(username.value, password.value);
  loading.value = true;

  if (status === 200) {
    loginStore.updateBearer(data.access_token)
          loginStore.updateUser(username.value, data.user_id, data.is_admin, data.project_manager)
          loading.value = false
          showSnackbar(t('login.success'))
          router.push({ name: 'Channels' })
  }
} catch (error) {

  }

    }
 onMounted(() => {
   if (localStorage.getItem('token')) {
     //Tries to load projects with stored token. If '401' goes back to 'login'
   }
 })

</script>

<template>
  <v-container class="fill-height d-flex justify-center align-center">
    <v-row>
      <v-col>
        <v-sheet class="mx-auto pa-8" width="400px" elevation="3">
          <div class="text-h4 py-4 text-center">Login</div>
          <v-form @submit.prevent="submit" v-model="goodLogin" color="primary">
            <v-text-field label="Username" v-model="username" :rules="regole"></v-text-field>
            <v-text-field label="Password" v-model="password" type="password" :rules="regole"></v-text-field>
            <v-btn 
              type="submit" 
              class="ma-2" 
              :loading="loading" 
              :disabled="isButtonDisabled"
              color="primary" 
              block
            >
              {{ t('login.button') }}
            </v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>
