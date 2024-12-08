<template>
   <div class="page-tab flex-container" v-if="winwidth != true">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞帳號資料</p>
   </div>

   <v-row style="margin: 1% 1% 20px;">
      <v-col>
         <v-row>
            <!-- 帳號資料檢視 -->
            <v-col cols="12" sm="12" md="6" lg="6">
               <v-card>
                  <v-list-item class="list-title">
                     <div class="flex-container" style="justify-content: space-between;">
                        <h3 class="page-title">帳號資料檢視</h3>
                     </div>
                  </v-list-item>
                     
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號名稱：</h4>
                        <p class="list-info50">{{ accInfoArr.credential }}</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號類別：</h4>
                        <p class="list-info50">{{ accInfoArr.userType }}</p>
                        <!-- <img :src="userImage" class="userImg"> -->
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號姓名：</h4>
                        <p class="list-info50">{{ accInfoArr.name }}</p>
                     </div>
                  </v-list-item>
                  
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號暱稱：</h4>
                        <input type="string" id="steps" class="item-input" v-model="accname" :placeholder="accInfoArr.nickName || '請輸入暱稱'" />
                     </div>
                  </v-list-item>
               </v-card>

               <v-btn class="exchange-btn" @click="handleSave(accname)" :ripple="false">儲存個人資料</v-btn>
            </v-col>

            <!-- 減重階段/目標 -->
            <v-col cols="12" sm="12" md="6" lg="6" v-if="accType == 0">
               <v-card>
                  <v-list-item class="list-title">
                     <h3 class="page-title">減重階段/目標</h3>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">目前階段：</h4>
                        <p class="list-info50">{{ accTargetInfoArr.currentPhase }}</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">目標體重：</h4>
                        <p class="list-info50">{{ accTargetInfoArr.currentWeight }}公斤</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">每日步數：</h4>
                        <p class="list-info50">{{ accTargetInfoArr.currentSteps }}步</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">慢跑時間：</h4>
                        <p class="list-info50">{{ accTargetInfoArr.currentJogTime }}分鐘</p>
                     </div>
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
   import { ref } from 'vue';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { changeAccInfo } from '../../api/accInfo.js';
   import userImage from '../../assets/images/user.png';
   import { askAccInfo, askTargetInfo } from '../../api/accInfo.js';

   export default {
      name: 'accInfoPage',
      
      setup() {
         let isLoading = ref(false);
         let accType = sessionStorage.getItem('accType');
         let accInfoArr = ref('');
         let accTargetInfoArr = ref('');

         const { winwidth } = useWindowWidth();
         const accname = ref('');

         askAccInfo().then((result) => { 
            accInfoArr.value = result;
         });

         askTargetInfo().then((result) => {
            accTargetInfoArr.value = result;
         })

         async function handleSave(accname) { 
            isLoading.value = true;
            try {
               await changeAccInfo(accname);
            } finally {
               isLoading.value = false;
               
               setTimeout(() => {
                  window.location.reload();
               }, 1000);
            }
         }
         
         return {
            winwidth,
            isLoading,
            accType,
            userImage,
            accname,
            accInfoArr,
            accTargetInfoArr,
            handleSave,
         }
      }
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
