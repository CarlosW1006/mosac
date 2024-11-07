<template>
   <v-app>
      <div v-if="!['/letmein', '/changepwd'].includes($route.path.toLowerCase())">
         <div v-if="session != null">
            <div v-if="winwidth == true">
               <v-app-bar color="#ffffff" elevation="0">
                  <template v-slot:prepend>
                     <p class="pageTitle">互動式自我健康管理雲端平台</p>
                  </template>
                  <img :src="userImage" style="width: 18px; margin-right: 10px;">
                  <a :href="toAccInfo" class="userName" v-on:click="navigateToAccInfo">Top001</a>
                  <v-btn class="logoutBtn">登出</v-btn>
               </v-app-bar>
            </div>
            <v-app-bar style="background: linear-gradient(to right, #7bd7b7, #69c9a7);" elevation="0">
               <template v-slot:prepend>
                  <div v-if="winwidth == true" style="margin-left: 30px;">
                     <button :class="{'bar-btn': hashUrl !== '#/index', 
                     'bar-btn-clicked': hashUrl === '#/index'}" @click="navigateToPath('index')">首頁</button>
                     <button :class="{'bar-btn': hashUrl !== '#/healthKnowledge', 
                     'bar-btn-clicked': hashUrl === '#/healthKnowledge'}" @click="navigateToPath('healthKnowledge')">健康知能</button>
                     <button :class="{'bar-btn': hashUrl !== '#/healthNotes', 
                     'bar-btn-clicked': hashUrl === '#/healthNotes'}" @click="navigateToPath('healthNotes')">健康手札</button>
                     <button :class="{'bar-btn': hashUrl !== '#/careGarden', 
                     'bar-btn-clicked': hashUrl === '#/careGarden'}" @click="navigateToPath('careGarden')">照護園地</button>
                     <button :class="{'bar-btn': hashUrl !== '#/meetInfo', 
                     'bar-btn-clicked': hashUrl === '#/meetInfo'}" @click="navigateToPath('meetInfo')">專家諮詢</button>
                     <button :class="{'bar-btn': hashUrl !== '#/videoCollection', 
                     'bar-btn-clicked': hashUrl === '#/videoCollection'}" @click="navigateToPath('videoCollection')">影音收藏</button>
                     
                  </div>
                  <div v-else>
                     <div v-if="drawer == false">
                        <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: white;"></v-app-bar-nav-icon>
                     </div>
                     <div v-else>
                        <v-btn icon="mdi-dots-vertical" @click.stop="drawer = !drawer" style="color: white;"></v-btn>
                     </div>
                  </div>
               </template>

               <div v-if="winwidth == true">
                  <button class="bar-btn-info">系統訊息通知</button>
               </div>
               <div v-else>
                  <a href="#/accountInfo" class="userName2">Top001</a>
               </div>
            </v-app-bar>

            <div v-if="winwidth == false">
               <v-navigation-drawer v-model="drawer" app class="indigo">
                  <v-list-item link class="sm-bar-btn" :to="{ path: '/index' }">
                     <v-list-item-title class="custom-title">首頁</v-list-item-title>
                  </v-list-item>

                  <v-list-item link class="sm-bar-btn" :to="{ path: '/healthKnowledge' }">
                     <v-list-item-title class="custom-title">健康知能</v-list-item-title>
                  </v-list-item>

                  <v-list-item link class="sm-bar-btn" :to="{ path: '/healthNotes' }">
                     <v-list-item-title class="custom-title">健康手札</v-list-item-title>
                  </v-list-item>

                  <v-list-item link class="sm-bar-btn" :to="{ path: '/careGarden' }">
                     <v-list-item-title class="custom-title">照護園地</v-list-item-title>
                  </v-list-item>

                  <v-list-item link class="sm-bar-btn" :to="{ path: '/meetInfo' }">
                     <v-list-item-title class="custom-title">專家諮詢</v-list-item-title>
                  </v-list-item>

                  <v-list-item link class="sm-bar-btn" :to="{ path: '/videoCollection' }">
                     <v-list-item-title class="custom-title">影音收藏</v-list-item-title>
                  </v-list-item>

                  <template v-slot:append>
                     <div class="pa-2">
                        <v-btn block class="logoutBtn2">登出</v-btn>
                     </div>
                  </template>
               </v-navigation-drawer>
            </div>

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
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);
         const toAccInfo = ref('#/accountinfo');
         const hashUrl = ref(window.location.hash);
         let issurvey = sessionStorage.getItem('isSurvey');

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
            userImage,
            hashUrl,
            toAccInfo,
            navigateToPath,
            navigateToAccInfo,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "./assets/css/header.css";
</style>