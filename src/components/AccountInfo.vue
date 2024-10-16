<template>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <v-col cols="12" sm="7" md="6" lg="5">
            <v-card>
               <v-list-item class="list-title">
                  <h3 class="page-title">帳號資料檢視</h3>
               </v-list-item>
                  
               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">帳號名稱：</h4>
                     <p style="margin-left: 40px;">Top001</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">帳號類別：</h4>
                     <p style="margin-left: 40px;">一般使用者</p>
                     <img :src="require('../assets/images/user.png')" class="userImg">
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">用戶姓名：</h4>
                     <p style="margin-left: 40px;">李ＯＯ</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">目前階段：</h4>
                     <p style="margin-left: 40px;">準備期</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">目標體重：</h4>
                     <p style="margin-left: 40px;">65公斤</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">每日步數：</h4>
                     <p style="margin-left: 40px;">4500步</p>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 style="margin: 10px;">慢跑時間：</h4>
                     <p style="margin-left: 40px;">30分鐘</p>
                  </div>
               </v-list-item>
            </v-card>
         </v-col>

         <!-- <v-col cols="12" md="6" lg="6" v-if="winwidth == true" /> -->

         <v-col cols="12" sm="5" md="5" lg="5">
            <v-btn href="#/userPoints" class="pageBtn"><h3>個人累積點數</h3></v-btn>
            <v-btn href="#/groupRank" class="pageBtn"><h3>群組排名紀錄</h3></v-btn>
            <v-btn href="#/changepwd" class="pageBtn"><h3>變更帳號密碼</h3></v-btn>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import userImage from '../assets/images/user.png';
   import { useWindowWidth } from './winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'accInfoPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);

         let session = sessionStorage.getItem('session');

         return {
            userImage,
            winwidth,
            drawer,
            session,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/accountInfo.css";
</style>