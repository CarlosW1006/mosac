import { createRouter, createWebHashHistory } from 'vue-router'

sessionStorage.setItem('isSurvey', true); // 判斷本月問卷有沒有填寫

console.log(sessionStorage.getItem('isSurvey'))

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
      path: '/survey',
      name: 'surveyPage',
      component: () => import('../components/Survey.vue'),
      meta: {
         requiresAuth: false // 不需要 session 認證
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
      component: () => import('../components/AccInfo/AccountInfo.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/accInfoEdit',
      name: 'accInfoEditPage',
      component: () => import('../components/AccInfo/AccInfoEdit.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/userPoints',
      name: 'userPointsPage',
      component: () => import('../components/AccInfo/UserPoints.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/groupRank',
      name: 'groupRankPage',
      component: () => import('../components/AccInfo/GroupRank.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthNotes',
      name: 'healthNotesPage', 
      component:  () => import('../components/HealthNotes/HealthNotesMain.vue'),//健康手札(主頁)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthDetailForm',
      name: 'healthDetailFormPage', 
      component:  () => import('../components/HealthNotes/HealthDetailForm.vue'),//健康手札(資料填寫)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthDetailView',
      name: 'healthDetailViewPage', 
      component:  () => import('../components/HealthNotes/HealthDetailView.vue'),//健康手札(資料展示)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthKnowledge',
      name: 'healthKnowledgePage', 
      component:  () => import('../components/HealthKnow/HealthKnowledge.vue'),//健康知能(主頁)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthKnowledgeView',
      name: 'healthKnowledgeViewPage', 
      component:  () => import('../components/HealthKnow/HealthKnowledgeView.vue'),//健康知能(文章頁面)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/game',
      name: 'gamePage', 
      component:  () => import('../components/HealthKnow/Game.vue'),//健康知能(遊戲)
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
   const isSurvey = sessionStorage.getItem('isSurvey');
   
   if (to.path === '/letmein' && session) { 
      next({ path: '/index' });
   } 
   else if (to.meta.requiresAuth) {
      if (!session) {
         next({ path: '/letmein' });
      } else if (!session || isSurvey !== 'true') { 
         alert('本月問卷上未填寫');
         next({ path: '/survey' });
      } else {
         next();
      }
   } else {
      next();
   }
});

export default router;
