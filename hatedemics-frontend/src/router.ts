import { useGlobal } from '@/store';
import {
  createRouter,
  createWebHistory,
  type Router,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router';

// Components
import HomeView from '@/views/HomeView.vue';
import DashboardView from '@/views/DashboardView.vue';
import InspectorView from '@/views/InspectorView.vue';
import DiscussionView from '@/views/DiscussionView.vue';
import CounterspeechWriting from '@/views/CounterspeechWriting.vue';
import Channels from '@/views/Channels.vue';
import Login from '@/views/LoginView.vue';
import annotationInterface from '@/components/AnnotationInterface.vue'
import ProjectsView from '@/components/ProjectsList.vue'
import tasks from '@/components/TaskList.vue'
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
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },{
    path: '/dashboard/channels',
    name: 'Channels',
    component: Channels
  },
  {
    path: '/dashboard/channels',
    name: 'Inspector',
    component: InspectorView
  },  
  {
    path: '/dashboard/discussion',
    name: 'Discussion',
    component: DiscussionView
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectsView
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
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: async () => await import('@/views/AboutView.vue')
  }
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes
});

// // Global before guards
// router.beforeEach(async (to, from, next) => {
//   const isAuth = await loginApi.isAuthenticated();

//   if (!isAuth && to.name !== 'Login') {
//     // Se l'utente non è autenticato e prova ad accedere a una pagina protetta, lo rimandiamo al login
//     next({ name: 'Login' });

//   } else {
//     // Se tutto è ok, continuiamo normalmente
//     next();
//   }
// });
// Global After Hooks
// https://router.vuejs.org/guide/advanced/navigation-guards.html#global-after-hooks}
router.afterEach(() => {
  const globalStore = useGlobal();
  // Hide Loading
  globalStore.setLoading(false);
});


export default router;
