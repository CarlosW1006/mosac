<template>
   <v-app>
      <div v-if="!['/letmein', '/forgotpwd', '/changepwd'].includes($route.path.toLowerCase())">
         <div v-if="session != null">
            <!-- 電腦功能列 -->
            <v-navigation-drawer v-if="winwidth==true" class="cp-drawer" mobile-breakpoint="1200">
               <template v-slot:prepend>
                  <div style="margin-bottom: 8.75em;"></div> <!-- 系統 icon -->
                  <button :class="{'bar-btn': hashUrl !== '#/index', 
                  'bar-btn-clicked': hashUrl === '#/index'}" @click="navigateToPath('index')">
                     <div class="flex-container" style="justify-content: center;">
                        <v-icon class="bar-btn-icon" style="margin-left: -1.5em;">mdi-home</v-icon>首頁
                     </div>
                  </button>

                  <div v-for="(item, index) in barButtons" :key="index">
                     <button v-if="accType == 0" :class="{'bar-btn': hashUrl !== '#/' + item.path, 
                     'bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
                        <div class="flex-container" style="justify-content: center;">
                        <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>{{ item.title }}
                     </div>
                     </button>
                  </div>

                  <button v-if="accType == 1" :class="{'bar-btn': hashUrl !== '#/meetInfo', 
                  'bar-btn-clicked': hashUrl === '#/meetInfo'}" @click="navigateToPath('meetInfo')">
                     <div class="flex-container" style="justify-content: center;">
                        <v-icon class="bar-btn-icon">mdi-account-question</v-icon>專家諮詢
                     </div>
                  </button>
               </template>

               <template v-slot:append>
                  <div class="messages">
                     <div class="flex-container">
                        <button class="bar-btn-info">健康紀錄未填寫</button>
                        <div class="info-number"><p>3</p></div>
                     </div>
                  </div>
                  <div class="messages">
                     <div class="flex-container">
                        <button class="bar-btn-info">系統訊息通知數</button>
                        <div class="info-number"><p>3</p></div>
                     </div>
                  </div>
               </template>
            </v-navigation-drawer>

            <!-- 手機功能列 -->
            <div v-else>
               <v-app-bar style="background: linear-gradient(to right, #7bd7b7, #69c9a7);" elevation="0">
                  <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: white;"></v-app-bar-nav-icon>
                  <v-spacer></v-spacer>
                  <a :href="toAccInfo" class="userName2" v-on:click="navigateToAccInfo" style="color: white;">Top001</a>
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

                     <div v-for="(item, index) in barButtons" :key="index">
                        <v-list-item link :class="{'sm-bar-btn': hashUrl !== '#/' + item.path, 
                        'sm-bar-btn-clicked': hashUrl === '#/' + item.path}" @click="navigateToPath(item.path)">
                           <div class="flex-container">
                              <v-icon class="bar-btn-icon">{{ item.icon }}</v-icon>
                              <v-list-item-title>{{ item.title }}</v-list-item-title>
                           </div>
                        </v-list-item>
                     </div>

                     <v-list-item class="sm-bar-btn">
                        <div class="flex-container">
                           <v-list-item-title>健康紀錄未填寫</v-list-item-title>
                           <div class="sm-info-number"><p>3</p></div>
                        </div>
                     </v-list-item>
                     
                     <v-list-item class="sm-bar-btn">
                        <div class="flex-container">
                           <v-list-item-title>系統訊息通知數</v-list-item-title>
                           <div class="sm-info-number"><p>3</p></div>
                        </div>
                     </v-list-item>
                  </v-list>

                  <template v-slot:append>
                     <div class="pa-2">
                        <v-btn block class="logoutBtn2">登出</v-btn>
                     </div>
                  </template>
               </v-navigation-drawer>
            </div>

            <v-app-bar v-if="winwidth==true" elevation="0" class="pageTitle">
               <template v-slot:prepend>
                  <p>互動式自我健康管理雲端平台</p>
               </template>
               <img :src="userImage" style="width: 18px; margin-right: 10px;">
               <a :href="toAccInfo" class="userName" v-on:click="navigateToAccInfo">Top001</a>
               <v-btn class="logoutBtn">登出</v-btn>
            </v-app-bar>

            <!-- 主要內容 -->
            <v-main class="router">
               <router-view />
            </v-main>

            <v-overlay></v-overlay>
         </div>
      </div>
      
      <div v-else>
         <!-- 主要內容 -->
         <v-main class="router">
            <router-view />
         </v-main>
      </div>
      
   </v-app>
</template>

<script>
   import { useWindowWidth } from './components/JS/winwidth.js';
   import userImage from './assets/images/user.png';
   import { ref, onMounted } from 'vue';

   export default {
      name: 'App',
      setup() {
         let session = sessionStorage.getItem('session');
         let accType = sessionStorage.getItem('accType');
         let issurvey = sessionStorage.getItem('isSurvey');

         const { winwidth } = useWindowWidth();
         const drawer = ref(false);
         const toAccInfo = ref('#/accountinfo');
         const hashUrl = ref(window.location.hash);

         const barButtons = ref([
            { path: 'healthKnowledge', icon: 'mdi-book-open', title: '健康知能' },
            { path: 'healthNotes', icon: 'mdi-file-edit', title: '健康手札' },
            { path: 'careGarden', icon: 'mdi-play-circle', title: '照護園地' },
            { path: 'meetInfo', icon: 'mdi-account-question', title: '專家諮詢' },
            { path: 'videoCollection', icon: 'mdi-video-plus', title: '影音收藏' },
         ]);

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
            if(issurvey == 'true') {
               window.location.href = '#/' + path;
            }
            else {
               alert("本月問卷尚未填寫")
               window.location.href = '#/survey';
            }
         }

         function navigateToAccInfo() {
            if(issurvey == 'false') {
               alert("本月問卷尚未填寫")
               this.toAccInfo = '#/survey';
            }
         }

         return {
            winwidth,
            drawer,
            session,
            accType,
            userImage,
            hashUrl,
            toAccInfo,
            barButtons,
            navigateToPath,
            navigateToAccInfo,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "./assets/css/header.css";
</style>