<template>
   <!-- 手機功能列 -->
   <v-app-bar style="background: linear-gradient(to right, #7bd7b7, #69c9a7);" elevation="0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: white;"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <div>
         <v-menu activator="parent">
            <template v-slot:activator="{ attrs }">
               <div class="userName-container">
               <a v-bind="attrs" class="userName2" style="cursor: pointer;">{{ accName }}</a>
               <v-icon class="drop-down-btn2" size="30" style="cursor: pointer;">mdi-chevron-down</v-icon>
               </div>
            </template>
            
            <v-card class="sm-account-page-container">
               <v-list>
                  <div class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-account-edit-outline</v-icon><a href="#/accountInfo"><p>帳號資料編輯</p></a>
                  </div>
                  <div v-if="accType == 0" class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-star-circle-outline</v-icon><a href="#/userPoints"><p>個人累積點數</p></a>
                  </div>
                  <div v-if="accType == 0" class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-account-group-outline</v-icon><a href="#/groupRank"><p>群組排名紀錄</p></a>
                  </div>
                  <div class="flex-container" style="align-items: center; justify-content: center;">
                     <v-icon>mdi-lock-reset</v-icon><a href="#/changePwd"><p>變更帳號密碼</p></a>
                  </div>
               </v-list>
            </v-card>
         </v-menu>
      </div>
   </v-app-bar>

   <v-navigation-drawer v-model="drawer">
      <v-list>
         <v-list-item link :class="{'sm-bar-btn': hashUrl !== '#/index', 
         'sm-bar-btn-clicked': hashUrl === '#/index'}" @click="navigateToPath('index')" style="margin-top: -0.35em;">
            <div class="flex-container">
               <v-icon class="bar-btn-icon">mdi-home</v-icon>
               <v-list-item-title>首頁</v-list-item-title>
            </div>
         </v-list-item>

         <div v-if="accType == 0">
            <v-list-item v-for="(item, index) in barButtons" :key="index" link :class="{'sm-bar-btn': hashUrl !== '#/' + item.path, 
            'sm-bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
               <div class="flex-container">
                  <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
               </div>
            </v-list-item>
         </div>

         <div v-if="accType == 1">
            <v-list-item v-for="(item, index) in expBarButtons" :key="index" link :class="{'sm-bar-btn': hashUrl !== '#/' + item.path, 
            'sm-bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
               <div class="flex-container">
                  <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
               </div>
            </v-list-item>
         </div>

         <v-list-item v-if="accType == 0" class="sm-bar-btn">
            <div class="flex-container">
               <v-list-item-title><a href="#/healthNotes" class="sm-bar-btn-info">健康紀錄未填寫</a></v-list-item-title>
               <div class="sm-info-number"><p>{{ uncompleteNumber }}</p></div>
            </div>
         </v-list-item>
         
         <v-list-item class="sm-bar-btn">
            <div class="flex-container">
               <v-list-item-title><a href="#/systemNotice" class="sm-bar-btn-info">系統訊息通知數</a></v-list-item-title>
               <div class="sm-info-number"><p>3</p></div>
            </div>
         </v-list-item>
      </v-list>

      <template v-slot:append>
         <div class="pa-2">
            <v-btn block class="logoutBtn2" @click="logout()">登出</v-btn>
         </div>
      </template>
   </v-navigation-drawer>
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