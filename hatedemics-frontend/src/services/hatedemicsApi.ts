import axios from 'axios';
import { useLoginStore } from '@/store/LoginStore';

const axiosHatedemicsInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_HATEDEMICS_API_URL,
});

axiosHatedemicsInstance.interceptors.request.use(
  function (config) {
    const loginStore = useLoginStore();
    const token = loginStore.token;
    if (!String(config.url).includes('www.') && !String(config.url).includes('http'))
      config.headers['Authorization'] = 'Bearer ' + token;
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosHatedemicsInstance.interceptors.response.use(
  function (response) {
    const loginStore = useLoginStore();
    if (response.headers['bearer-refreshed'])
      loginStore.updateBearer(response.headers['bearer-refreshed']);
    return response;
  },
  function (error) {
    const loginStore = useLoginStore();
    if (error.response.status == 401) {
      loginStore.removeBearer();
      return Promise.reject(401);
    }
    return Promise.reject(error);
  }
);

export default axiosHatedemicsInstance;
