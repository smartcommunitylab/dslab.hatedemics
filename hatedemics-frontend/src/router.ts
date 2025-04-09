import { useGlobal } from '@/store';
import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw
} from 'vue-router';

// Components
import Login from '@/views/LoginView.vue';
import loginApi from './services/login/loginApi';


// Pinia Store

// Unimplemented in Vuetify 3.5.6
// import { goTo } from 'vuetify/services';

/** Router Rules */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      hideNavbar: true,
      hideSideMenu:true
     }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },{
    path: '/dashboard/channels',
    name: 'Channels',
    component: () => import('@/views/Channels.vue'),

  },
  {
    path: '/dashboard/inspector',
    name: 'Inspector',
    component: () => import('@/views/InspectorView.vue'),

  },  
  {
    path: '/dashboard/discussion',
    name: 'Discussion',
    component: () => import('@/views/DiscussionView.vue'),
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/components/ProjectsList.vue'),
  },
  {
    path: '/projects/writing',
    name: 'Counterspeech',
    component: () => import('@/views/CounterspeechWriting.vue'),
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate',
    name: 'annotation',
    component: () => import('@/components/AnnotationInterface.vue'),

  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/parent/:annotationParent',
    name: 'annotation_parent',
    component: () => import('@/components/AnnotationInterface.vue'),

  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/:annotationID',
    name: 'annotation_edit',
    component: () => import('@/components/AnnotationInterface.vue'),

  },
  {
    path: '/projects/writing/:projectID/tasks/',
    name: 'tasks',
    component: () => import('@/components/AnnotationInterface.vue'),

  },
  {
    path: '/about',
    name: 'Credits',
    component: () => import('@/views/AboutView.vue'),

  }
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes
});

// // Global before guards
router.beforeEach(async (to, from, next) => {
  const isAuth = await loginApi.isAuthenticated();

  if (!isAuth && to.name !== 'Login') {
    // Se l'utente non è autenticato e prova ad accedere a una pagina protetta, lo rimandiamo al login
    next({ name: 'Login' });

  } else {
    // Se tutto è ok, continuiamo normalmente
    next();
  }
});
// Global After Hooks
// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks}
router.afterEach(() => {
  const globalStore = useGlobal();
  // Hide Loading
  globalStore.setLoading(false);
});


export default router;
