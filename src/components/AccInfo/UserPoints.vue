<template>
   <div class="page-tab flex-container">
      <a href="#/accountinfo" class="tab-L">回到帳號資料</a> <p class="tab-R">帳號資料＞個人累積點數</p>
   </div>

   <v-row style="margin: 1% 1% 10px;">
      <v-col cols="12" sm="12" md="7" lg="7">
         <v-card>
            <v-list-item class="list-title">
               <div class="flex-container">
                  <h3 class="page-title">個人累積點數</h3>
               </div>
            </v-list-item>
               
            <v-list-item class="list-item">
               <div class="flex-container">
                  <p class="item-name">個人點數：</p>
                  <p class="list-info50">45</p>
               </div>
            </v-list-item>

            <v-list-item class="list-item">
               <div class="flex-container">
                  <p class="item-name">團體徽章：</p>
                  <p class="list-info50">2</p>
               </div>
            </v-list-item>
         </v-card>

         <v-btn class="exchange-btn" :ripple="false">我要兌換點數</v-btn>
      </v-col>
   </v-row>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import { ref } from 'vue';

   export default {
      name: 'accInfoPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);

         let session = sessionStorage.getItem('session');

         return {
            winwidth,
            drawer,
            session,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>