import { useGlobal } from '@/store';
import {
  createRouter,
  createWebHistory,
  type Router,
  type RouteRecordRaw
} from 'vue-router';

// Components
import CounterspeechWriting from '@/views/CounterspeechWriting.vue';
import Login from '@/views/LoginView.vue';
import annotationInterface from '@/components/AnnotationInterface.vue'
import tasks from '@/components/TaskList.vue'
import loginApi from './services/login/loginApi';
import AboutView from './views/AboutView.vue';


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
    path: '/educational',
    name: 'Educational',
    component: () => import('@/views/Educational/EducationalView.vue'),
  },
  {
    path: '/educational/human-rights',
    name: 'humanRightsIntro',
    component: () => import('@/views/Educational/HumanRightsIntro.vue')
  },
  {
    path: '/educational/human-rights/task',
    name: 'humanRightsTask',
    component: () => import('@/views/Educational/HumanRightsTask.vue')
  },
  {
    path: '/educational/bias',
    name: 'biasIntro',
    component: () => import('@/views/Educational/BiasIntro.vue')
  },
  {
    path: '/educational/bias/task',
    name: 'biasTask',
    component: () => import('@/views/Educational/BiasTask.vue')
  },
  {
    path: '/educational/debunking',
    name: 'debunkingIntro',
    component: () => import('@/views/Educational/DebunkingIntro.vue')
  },
  {
    path: '/educational/debunking/task',
    name: 'debunkingTask',
    component: () => import('@/views/Educational/DebunkingTask.vue')
  },
  {
    path: '/educational/lateral-reading',
    name: 'lateralReadingIntro',
    component: () => import('@/views/Educational/LateralReadingIntro.vue')
  },
  {
    path: '/educational/lateral-reading/task',
    name: 'lateralReadingTask',
    component: () => import('@/views/Educational/LateralReadingTask.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
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
    component: CounterspeechWriting
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate',
    name: 'annotation',
    component: annotationInterface
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/parent/:annotationParent',
    name: 'annotation_parent',
    component: annotationInterface
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/:annotationID',
    name: 'annotation_edit',
    component: annotationInterface
  },
  {
    path: '/projects/writing/:projectID/tasks/',
    name: 'tasks',
    component: tasks
  },
  {
    path: '/about',
    name: 'Credits',

    component: AboutView
  },
  
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
