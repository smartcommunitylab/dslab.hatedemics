import axios from 'axios';
import { useLoginStore } from '@/store/LoginStore';
import loginApi from './login/loginApi';

const axiosHateGeneratorInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_HATEDEMICS_API_GEN_URL,
  timeout: 30000,
});

axiosHateGeneratorInstance.interceptors.request.use(
  function (config) {
    const loginStore = useLoginStore();
    const token = loginStore.token;
      config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosHateGeneratorInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const loginStore = useLoginStore();
    if (error.response.status == 401) {
      loginStore.removeBearer();
      return Promise.reject(401);
    }
    if (error.response.status === 403) {
          console.warn("Accesso negato! Redirect alla pagina di login...");
          loginStore.removeBearer();

          loginApi.logout()
        }
    return Promise.reject(error);
  }
);

export default axiosHateGeneratorInstance;
