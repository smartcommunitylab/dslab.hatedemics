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
import helpLines from '@/views/HelplinesView.vue';
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
      hideNavbar: false,
      hideSideMenu:false,
      requiresAuth: false
     },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/educational',
    name: 'Educational',
    component: () => import('@/views/Educational/EducationalView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/human-rights',
    name: 'humanRightsIntro',
    component: () => import('@/views/Educational/HumanRightsIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/human-rights/task',
    name: 'humanRightsTask',
    component: () => import('@/views/Educational/HumanRightsTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/bias',
    name: 'biasIntro',
    component: () => import('@/views/Educational/BiasIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/bias/task',
    name: 'biasTask',
    component: () => import('@/views/Educational/BiasTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/debunking',
    name: 'debunkingIntro',
    component: () => import('@/views/Educational/DebunkingIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/debunking/task',
    name: 'debunkingTask',
    component: () => import('@/views/Educational/DebunkingTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/lateral-reading',
    name: 'lateralReadingIntro',
    component: () => import('@/views/Educational/LateralReadingIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/lateral-reading/task',
    name: 'lateralReadingTask',
    component: () => import('@/views/Educational/LateralReadingTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/spot-hate',
    name: 'spotHateIntro',
    component: () => import('@/views/Educational/SpotHateIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/spot-hate/task',
    name: 'spotHateTask',
    component: () => import('@/views/Educational/SpotHateTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/counterspeech',
    name: 'counterSpeechIntro',
    component: () => import('@/views/Educational/CounterSpeechIntro.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/educational/counterspeech/task',
    name: 'counterSpeechTask',
    component: () => import('@/views/Educational/CounterSpeechTask.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
  },
  {
    path: '/dashboard/channels',
    name: 'Channels',
    component: () => import('@/views/Channels.vue'),
      meta: { requiresAuth: true }

  },
  {
    path: '/dashboard/inspector',
    name: 'Inspector',
    component: () => import('@/views/InspectorView.vue'),
      meta: { requiresAuth: true }

  },  
  {
    path: '/dashboard/discussion',
    name: 'Discussion',
    component: () => import('@/views/DiscussionView.vue'),
      meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/components/ProjectsList.vue'),
      meta: { requiresAuth: true }
  },
  {
    path: '/projects/writing',
    name: 'Counterspeech',
    component: CounterspeechWriting,
      meta: { requiresAuth: true }
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate',
    name: 'annotation',
    component: annotationInterface,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/parent/:annotationParent',
    name: 'annotation_parent',
    component: annotationInterface,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/writing/:projectID/tasks/:taskID/annotate/:annotationID',
    name: 'annotation_edit',
    component: annotationInterface,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/writing/:projectID/tasks/',
    name: 'tasks',
    component: tasks,
    meta: { requiresAuth: true }
  },
  {
    path: '/helplines',
    name: 'helplines',
    component: helpLines,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'Credits',

    component: AboutView,
    meta: { requiresAuth: false }
  },
  
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes
});

// // Global before guards
router.beforeEach(async (to, from, next) => {
  const isAuth = await loginApi.isAuthenticated();

  // if (!isAuth && to.name !== 'Login') {
  //   // Se l'utente non è autenticato e prova ad accedere a una pagina protetta, lo rimandiamo al login
  //   next({ name: 'Login' });

  // } else {
  //   // Se tutto è ok, continuiamo normalmente
  //   next();
  // }
  if (to.meta.requiresAuth !== false && !isAuth) {
    next('/');
  } 
  // Se è già loggato e prova ad andare in /login
  else if (to.path === '/' && isAuth) {
    next('/home'); // O la tua home post-login
  } else {
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
