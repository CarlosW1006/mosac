import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
   {
      path: '/:pathMatch(.*)*',
      redirect: '/letmein',  // 通配符路由來處理未定義的路徑
   },
   {
      path: '/',
      redirect: '/letmein',  // 當訪問根路徑時，重定向到 /index
   },
   {
      path: '/letmein',
      name: 'letmeinPage',
      component: () => import('../components/Letmein.vue'),
      meta: {
         requiresAuth: false // 不需要 session 認證
      }
   },
   {
      path: '/changePwd',
      name: 'changepwdPage',
      component: () => import('../components/ChangePwd.vue'),
      meta: {
         requiresAuth: false // 需要 session 認證
      }
   },
   {
      path: '/index',
      name: 'indexPage',
      component: () => import('../components/Index.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/accountInfo',
      name: 'accInfoPage',
      component: () => import('../components/AccountInfo.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/accInfoEdit',
      name: 'accInfoEditPage',
      component: () => import('../components/AccInfoEdit.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/userPoints',
      name: 'userPointsPage',
      component: () => import('../components/UserPoints.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/groupRank',
      name: 'groupRankPage',
      component: () => import('../components/GroupRank.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/health-detail-form',
      name: 'health-detail-form', 
      component:  () => import('../components/HealthDetailForm.vue'),// 詳細頁面路由
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
]

const router = createRouter({
   history: createWebHashHistory(),
   routes,
   scrollBehavior() { // 跳轉頁面組件後，滑到頁面頂端
         return { top: 0 };
   },
})

router.beforeEach((to, from, next) => {
   const session = sessionStorage.getItem('session');

   // letmein 且有 session，則重定向到 /index
   if (to.path === '/letmein' && session) {
      next({ path: '/index' });
   } 
   else if (to.meta.requiresAuth) {
      if (!session) {
         next({ path: '/letmein' });
      } else {
         next(); // 放行
      }
   } else {
      next(); // 不需要 session 認證，直接放行
   }
})

export default router;
