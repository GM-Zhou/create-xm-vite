import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/home',
      meta: {
        title: '喜马拉雅',
      },
      component: () => import('./pages/Home/index.vue'),
    },
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('./pages/Error/NotFound/index.vue'),
    },
  ],
});

router.beforeEach((to, _, next) => {
  const title = to.query.title || to.meta.title || '喜马拉雅';
  document.title = title as string; // 设置页面 title
  next();
});

export default router;
