import { createRouter, createWebHashHistory } from 'vue-router';
import { askAccInfo, askTargetInfo } from '../api/accInfo.js';

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
      path: '/forgotPwd',
      name: 'forgotpwdPage',
      component: () => import('../components/ForgotPwd.vue'),
      meta: {
         requiresAuth: false // 不需要 session 認證
      }
   },
   {
      path: '/changePwd',
      name: 'changepwdPage',
      component: () => import('../components/ChangePwd.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/survey',
      name: 'surveyPage',
      component: () => import('../components/Survey.vue'),
      meta: {
         requiresAuth: true // 需要 session 認證
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
      },
      beforeEnter: async (to, from, next) => {
         // 在進入路由之前呼叫 API 取得資料
         const accInfo = await askAccInfo();
         const accTargetInfo = await askTargetInfo();

         to.meta.accInfo = accInfo;
         to.meta.accTargetInfo = accTargetInfo;

         next();
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
      component:  () => import('../components/HealthNotes/HealthNotesMain.vue'), // 健康手札(主頁)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthDetailForm',
      name: 'healthDetailFormPage', 
      component:  () => import('../components/HealthNotes/HealthDetailForm.vue'), // 健康手札(資料填寫)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthDetailView',
      name: 'healthDetailViewPage', 
      component:  () => import('../components/HealthNotes/HealthDetailView.vue'), // 健康手札(資料展示)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthKnowledge',
      name: 'healthKnowledgePage', 
      component:  () => import('../components/HealthKnow/HealthKnowledge.vue'), // 健康知能(主頁)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/healthKnowledgeView',
      name: 'healthKnowledgeViewPage', 
      component:  () => import('../components/HealthKnow/HealthKnowledgeView.vue'), // 健康知能(文章頁面)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/game',
      name: 'gamePage', 
      component:  () => import('../components/HealthKnow/Game.vue'), // 健康知能(遊戲)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/meetInfo',
      name: 'meetInfoPage',
      component: () => import('../components/Meeting/MeetMain.vue'), // 專家諮詢檢視
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/meetDetail',
      name: 'meetDtPage',
      component: () => import('../components/Meeting/MeetDetail.vue'), // 諮詢資料檢視
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/careGarden',
      name: 'careGdPage',
      component: () => import('../components/CareGarden/CareGardenMain.vue'), // 照護園地
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/careGardenView',
      name: 'careGdViewPage',
      component: () => import('../components/CareGarden/CareGardenView.vue'), // 照護園地(影片頁面)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/videoCollection',
      name: 'videoclnPage',
      component: () => import('../components/CareGarden/VideoCollection.vue'), // 照護園地(影音收藏)
      meta: {
         requiresAuth: true // 需要 session 認證
      }
   },
   {
      path: '/systemNotice',
      name: 'sysNoticePage',
      component: () => import('../components/SystemNotice.vue'), // 系統通知訊息
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
   const accType = sessionStorage.getItem('accType');
   const hasPendingSurvey = sessionStorage.getItem('hasPendingSurvey');
   const expertPaths = [ '/letmein', '/index', '/careGarden', '/careGardenView', 
   '/meetInfo', '/meetDetail', '/accountInfo', '/changePwd', './systemNotice' ];

   if (!expertPaths.includes(to.path) && accType == 1) {
      alert('該帳號無權限使用此頁面');
      next({ path: '/letmein' });
   }

   if (to.path === '/letmein' && session) {
      next({ path: '/index' }); return;
   }
   
   if (to.meta.requiresAuth) {
      if (!session) {
         next({ path: '/letmein' }); return;
      }

      if (hasPendingSurvey === 'true' && to.path === '/survey') {
         alert('親愛的用戶您好，本月已填寫過問卷，頁面將跳轉至系統首頁');
         next({ path: '/index' }); return;
      }
   
      if (hasPendingSurvey !== 'true' && !['/survey', '/careGarden', '/careGardenView'].includes(to.path) && accType == 0) {
         alert('親愛的用戶您好，本月尚未填寫問卷，請先完成問卷');
         next({ path: '/survey' }); return;
      }
   }
   
   next();

});

export default router;
