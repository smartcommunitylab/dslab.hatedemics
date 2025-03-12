import axiosInstance from './../api';
import router from '@/router'
import { useLoginStore } from '@/store/LoginStore'
import axiosHatedemicsInstance from '../hatedemicsApi';


 async function logout() {
    const loginStore = useLoginStore()
    loginStore.removeAll()
    router.push({ name: 'Login' })
  }
  async function login(username:string, password:string) {
    return axiosInstance.post(
      import.meta.env.VITE_APP_URL_TOKEN,
      {
        username: username,
        password: password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }


  async function isAuthenticated(): Promise<boolean> {
    const loginStore = useLoginStore();
    return !!loginStore.token; // Se il token esiste, l'utente è autenticato
  }
export default {
  login,
  logout,
  isAuthenticated
};
