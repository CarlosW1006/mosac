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
                  <a href="#/accountInfo" class="userName">UserName</a>
                  <v-btn class="logoutBtn">登出</v-btn>
               </v-app-bar>
            </div>
            <v-app-bar style="background: linear-gradient(to right, #FF8585, #FA7474);" elevation="0">
            <template v-slot:prepend>
               <div v-if="winwidth == true" style="margin-left: 30px;">
                  <button :class="{'bar-btn': hashUrl !== '#/index', 
                  'bar-btn-clicked': hashUrl === '#/index'}" @click="navigateToHome">首頁</button>
                  <button class="bar-btn">健康知能</button>
                  <button class="bar-btn">健康手札</button>
                  <button class="bar-btn">照護園地</button>
                  <button class="bar-btn">專家諮詢</button>
                  <button class="bar-btn">影音收藏</button>
               </div>
               <div v-else>
                  <div v-if="drawer == false">
                     <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                  </div>
                  <div v-else>
                     <v-btn icon="mdi-dots-vertical" @click.stop="drawer = !drawer"></v-btn>
                  </div>
               </div>
            </template>

            <div v-if="winwidth == true">
               <button class="bar-btn-info">系統訊息通知</button>
            </div>
            <div v-else>
               <a href="#/accountInfo" class="userName2">UserName</a>
            </div>
            </v-app-bar>

            <div v-if="winwidth == false">
            <v-navigation-drawer v-model="drawer" app class="indigo">
               <v-list-item link title="首頁" style="margin-top: 10px;"></v-list-item>
               <v-list-item link title="健康知能"></v-list-item>
               <v-list-item link title="健康手札"></v-list-item>
               <v-list-item link title="照護園地"></v-list-item>
               <v-list-item link title="專家諮詢"></v-list-item>
               <v-list-item link title="影音收藏"></v-list-item>
            </v-navigation-drawer>
            </div>

            <!-- 主要內容 -->
            <v-main class="router">
               <router-view />
            </v-main>
            
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
   import { useWindowWidth } from './components/winwidth.js';
   import userImage from './assets/images/user.png';
   import { ref, onMounted } from 'vue';

   export default {
      name: 'App',
      setup() {
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);
         let session = sessionStorage.getItem('session');

         const hashUrl = ref(window.location.hash);

         // 當頁面載入後檢查當前的 hash 值
         onMounted(() => {
         hashUrl.value = window.location.hash;
         });

         // 監聽 hash 值的變化
         window.addEventListener('hashchange', () => {
         hashUrl.value = window.location.hash;
         });

         // 定義導航到首頁的方法
         function navigateToHome() {
            window.location.href = '#/index';  // 確保 window.location 存在
         }

         return {
            winwidth,
            drawer,
            session,
            userImage,
            hashUrl,
            navigateToHome
         };
      },
   };
   
</script>

<style lang="css" scoped>
    @import "./assets/css/header.css";
</style>