<template>
   <div class="page-tab flex-container">
      <a href="#/grouprank" class="tab-L">回到群組排名</a> <p class="tab-R">群組排名＞心得回饋</p>
   </div>

   <v-row style="margin: 1% 1% 20px;">
      <v-col>
         <v-row>
            <!-- 帳號資料檢視 -->
            <v-col cols="12" sm="12" md="6" lg="6">
               <v-card>
                  <v-list-item class="list-title">
                     <div class="flex-container" style="justify-content: space-between;">
                        <h3 class="page-title">心得回饋</h3>
                     </div>
                  </v-list-item>
                     
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號暱稱：</h4>
                        <p class="list-info50">{{ userData.nickname }}</p>
                     </div>
                  </v-list-item>
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">減重進度：</h4>
                        <p class="list-info50">{{ userData.completionRate }}</p>
                     </div>
                  </v-list-item>
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">階段群組：</h4>
                        <p class="list-info50">{{ userData.month + '月' }} {{ userData.phase }}</p>
                     </div>
                  </v-list-item>
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">心得回饋：</h4>
                        <p class="list-info50"></p>
                     </div>
                     <v-card class="feedback-container">
                        <p class="feedback-font">{{ feedBackData }}</p>
                     </v-card>
                  </v-list-item>
               </v-card>
            </v-col>
         </v-row>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { ref, onMounted } from 'vue';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { getFeedback, getUserNickName } from '../../api/groupRank.js';

   export default {
      name: 'groupFeedbackPage',
      
      setup() {
         let isLoading = ref(false);
         let userData = ref('');
         let feedBackData = ref('');
         const { winwidth } = useWindowWidth();
         const hashUrl = ref(window.location.hash);
         const queryString = hashUrl.value.split('?')[1];
         const params = new URLSearchParams(queryString);
         const uid = params.get('uid');
         const phase = params.get('phase');
         const month = params.get('month');

         // 當頁面載入後檢查當前的 hash 值
         onMounted(() => {
         hashUrl.value = window.location.hash;
         });

         // 監聽 hash 值的變化
         window.addEventListener('hashchange', () => {
         hashUrl.value = window.location.hash;
         });

         getFeedback(uid, month).then((result) => { 
            if (Array.isArray(result) && result.length > 0) {
               feedBackData.value = result[0].content;
            } else {
               feedBackData.value = '尚未輸入心得';
            }
         });

         getUserNickName(uid, phase, month).then((result) => {
            userData.value = result;
         });
         
         return { 
            winwidth,
            userData,
            isLoading,
            feedBackData,
         }
      }
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
