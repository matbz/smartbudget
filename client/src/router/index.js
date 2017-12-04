import Vue from 'vue';
import Router from 'vue-router';
import moment from 'moment';

const Login = () => import('@/components/User/Login');
const Budget = () => import('@/components/Budget/Budget');
const Report = () => import('@/components/Report/Report');
const Turnover = () => import('@/components/Turnover/Turnover');

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: { name: 'budget' },
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        requiresNotAuth: true,
      },
    },
    {
      path: '/budget',
      name: 'budget',
      meta: {
        requiresAuth: true,
      },
      redirect: { name: 'budget_date', params: { date: moment(new Date()).format('YYYYMM') } }
    },
    {
      path: '/budget/:date',
      name: 'budget_date',
      component: Budget,
      props: true,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/reports',
      name: 'reports',
      component: Report,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/accounts',
      name: 'accounts',
      component: Turnover,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/accounts/:accountid',
      name: 'accounts_id',
      props: true,
      component: Turnover,
      meta: {
        requiresAuth: true,
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  }
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

  if (token) {
    router.app.$options.store.dispatch('setUserAndToken', { token });
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      return next({ path: '/login' });
    }
  }

  if (to.matched.some(record => record.meta.requiresNotAuth)) {
    if (token) {
      return next({ path: '/' });
    }
  }
  next();
});

export default router;
