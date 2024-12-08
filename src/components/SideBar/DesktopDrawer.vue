<template>
   <!-- 電腦功能列 -->
   <v-navigation-drawer class="cp-drawer" mobile-breakpoint="1200">
      <template v-slot:prepend>
         <div style="margin-bottom: 8.75em;"></div> <!-- 系統 icon -->

         <div class="bar-btn-info-container">
            <div v-if="accType != 1" class="messages">
               <div class="flex-container">
                  <a href="#/healthNotes" class="bar-btn-info">健康紀錄未填寫</a>
                  <div class="info-number"><p>{{ uncompleteNumber }}</p></div>
               </div>
            </div>
            <div class="messages">
               <div class="flex-container">
                  <a href="#/systemNotice" class="bar-btn-info">系統訊息通知數</a>
                  <div class="info-number"><p>3</p></div>
               </div>
            </div>
         </div>
         
         <button :class="{'bar-btn': hashUrl !== '#/index', 
         'bar-btn-clicked': hashUrl === '#/index'}" @click="navigateToPath('index')">
            <div class="flex-container" style="justify-content: center;">
               <v-icon class="bar-btn-icon" style="margin-left: -1.5em;">mdi-home</v-icon>首頁
            </div>
         </button>

         <div v-for="(item, index) in barButtons" :key="index">
            <button v-if="accType != 1" :class="{'bar-btn': hashUrl !== '#/' + item.path, 
            'bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
               <div class="flex-container" style="justify-content: center;">
                  <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>{{ item.title }}
               </div>
            </button>
         </div>

         <div v-if="accType == 1">
            <button v-for="(item, index) in expBarButtons" :key="index" :class="{'bar-btn': hashUrl !== '#/' + item.path, 
            'bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
               <div class="flex-container" style="justify-content: center;">
                  <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>{{ item.title }}
               </div>
            </button>
         </div>
      </template>

      <!-- <template v-slot:append>
         <div class="bar-btn-info-container">
            <div v-if="accType != 1" class="messages">
               <div class="flex-container">
                  <a href="#/healthNotes" class="bar-btn-info">健康紀錄未填寫</a>
                  <div class="info-number"><p>{{ uncompleteNumber }}</p></div>
               </div>
            </div>
            <div class="messages">
               <div class="flex-container">
                  <a href="#/systemNotice" class="bar-btn-info">系統訊息通知數</a>
                  <div class="info-number"><p>3</p></div>
               </div>
            </div>
         </div>
      </template> -->
   </v-navigation-drawer>

   <!-- 電腦上方標題 -->
   <v-app-bar elevation="0" class="pageTitle">
      <template v-slot:prepend>
         <p>互動式自我健康管理雲端平台</p>
      </template>
      
      <div>
         <!-- 使用 v-menu 來顯示 v-card -->
         <v-menu activator="parent">
            <template v-slot:activator="{ attrs }">
               <div class="userName-container">
                  <!-- <img :src="userImage" style="width: 18px; margin-right: 10px;"> -->
                  <a v-bind="attrs" class="userName" style="cursor: pointer;">{{ accName }}</a>
                  <v-icon class="drop-down-btn" size="30" style="cursor: pointer;">mdi-chevron-down</v-icon>
               </div>
            </template>

            <v-card class="account-page-container">
               <v-list>
                  <div class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-account-edit-outline</v-icon><a href="#/accountInfo"><p>帳號資料編輯</p></a>
                  </div>
                  <div v-if="accType != 1" class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-star-circle-outline</v-icon><a href="#/userPoints"><p>個人累積點數</p></a>
                  </div>
                  <div v-if="accType != 1" class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-account-group-outline</v-icon><a href="#/groupRank"><p>群組排名紀錄</p></a>
                  </div>
                  <div class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-lock-reset</v-icon><a href="#/changePwd"><p>變更帳號密碼</p></a>
                  </div>
               </v-list>
            </v-card>
         </v-menu>
      </div>

      <v-btn class="logoutBtn" @click="logout()" plain="false">
         <v-icon>mdi-logout</v-icon>登出
      </v-btn>
   </v-app-bar>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { changeDate, askHealthNoteRecord } from '../../api/healthNote.js';
   // import userImage from './assets/images/user.png';
   import { ref, onMounted } from 'vue';

   export default {
      name: 'App',
      setup() {
         const uncompleteNumber = ref('');
         let session = sessionStorage.getItem('session');
         let accName = sessionStorage.getItem('accName');
         let accType = sessionStorage.getItem('accType');
         let hasPendingSurvey = sessionStorage.getItem('hasPendingSurvey');

         const { winwidth } = useWindowWidth();
         const drawer = ref(false);
         const hashUrl = ref(window.location.hash);

         const barButtons = ref([
            { path: 'healthKnowledge', icon: 'mdi-book-open', title: '健康知能' },
            { path: 'healthNotes', icon: 'mdi-file-edit', title: '健康手札' },
            { path: 'careGarden', icon: 'mdi-play-circle', title: '照護園地' },
            { path: 'meetInfo', icon: 'mdi-account-question', title: '專家諮詢' },
            { path: 'videoCollection', icon: 'mdi-video-plus', title: '影音收藏' },
         ]);

         const expBarButtons = ref([
            { path: 'careGarden', icon: 'mdi-play-circle', title: '照護園地' },
            { path: 'meetInfo', icon: 'mdi-account-question', title: '專家諮詢' },
         ])

         // 當頁面載入後檢查當前的 hash 值
         onMounted(() => {
         hashUrl.value = window.location.hash;
         });

         // 監聽 hash 值的變化
         window.addEventListener('hashchange', () => {
         hashUrl.value = window.location.hash;
         });

         // 功能列頁面轉址
         function navigateToPath(path) {
            if(hasPendingSurvey === 'true' || path.value != 'careGarden') {
               window.location.href = '#/' + path;
            }
            else {
               alert("本月問卷尚未填寫")
               window.location.href = '#/survey';
            }
         }

         // 計算未完成天數
         askHealthNoteRecord(changeDate(new Date()-(2*24*60*60*1000)), changeDate(new Date()))
         .then((result) => {
            uncompleteNumber.value = result.uncompleteNumber;
         });

         // 登出功能
         function logout() {
            if(confirm('確定要登出系統?')) {
               sessionStorage.removeItem('session');
               if(sessionStorage.getItem('session') == null) {
                  alert('登出成功');
               }
               window.location.href = '#/letmein';
               window.location.reload();
            }
            else {
               window.location.reload();
            }
         }

         return {
            winwidth,
            drawer,
            session,
            accName,
            accType,
            // userImage,
            hashUrl,
            barButtons,
            expBarButtons,
            uncompleteNumber,

            logout,
            navigateToPath,
         };
      },
   };
   
</script>
