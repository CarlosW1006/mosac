<template>
   <v-app>
      <div v-if="!['/letmein', '/forgotpwd', '/changepwd'].includes($route.path.toLowerCase())">
         <div v-if="session != null">
            <div v-if="winwidth==true">
               <DesktopDrawer />
            </div>

            <!-- 手機功能列 -->
            <div v-else>
               <MobileDrawer />
            </div>

            <!-- 主要內容顯示 -->
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
   import DesktopDrawer from './components/SideBar/DesktopDrawer.vue';
   import MobileDrawer from './components/SideBar/MobileDrawer.vue';
   import { useWindowWidth } from './components/JS/winwidth.js';

   export default {
      name: 'App',
      components: {
         DesktopDrawer,
         MobileDrawer,
      },
      setup() {
         let session = sessionStorage.getItem('session');
         const { winwidth } = useWindowWidth();

         return {
            winwidth,
            session,
         };
      },
   };
   
</script>

<style lang="css" scoped>
   @import "./assets/css/common.css";
   @import "./assets/css/header.css";
</style>