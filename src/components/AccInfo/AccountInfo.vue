<template>
   <div class="page-tab flex-container">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞帳號資料</p>
   </div>

   <v-row style="margin: 1% 1% 20px;">
      <!-- Main Profile Content -->
      <v-col cols="12" sm="12" xl="12" md="7" lg="7">
         <!-- Profile Section -->
         <v-row>
            <v-col cols="12">
               <v-card>
                  <v-list-item class="list-title">
                     <div class="flex-container" style="justify-content: space-between;">
                        <h3 class="page-title">帳號資料檢視</h3>
                        <v-btn class="save-btn" @click="handleSave(accname)" :ripple="false">儲存</v-btn>
                     </div>
                  </v-list-item>
                     
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號名稱：</h4>
                        <p class="list-info50">{{ accInfoArr.accName }}</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號類別：</h4>
                        <p class="list-info50">{{ accInfoArr.acc_type }}</p>
                        <img :src="userImage" class="userImg">
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號姓名：</h4>
                        <p class="list-info50">{{ accInfoArr.accFullName }}</p>
                     </div>
                  </v-list-item>
                  
                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">帳號暱稱：</h4>
                        <input type="string" id="steps" class="item-input" v-model="accname" :placeholder="accInfoArr.accNickName || '請輸入暱稱'" />
                     </div>
                  </v-list-item>
               </v-card>
            </v-col>

            <!-- Personal Information -->
            <v-col cols="12" class="mt-1">
               <v-card>
                  <v-list-item class="list-title">
                     <h3 class="page-title">減重階段/目標</h3>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">目前階段：</h4>
                        <p class="list-info50">{{ accInfoArr.recent_range }}</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">目標體重：</h4>
                        <p class="list-info50">{{ accInfoArr.target_weight }}公斤</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">每日步數：</h4>
                        <p class="list-info50">{{ accInfoArr.target_walk }}步</p>
                     </div>
                  </v-list-item>

                  <v-list-item class="list-item">
                     <div class="flex-container">
                        <h4 class="list-name">慢跑時間：</h4>
                        <p class="list-info50">{{ accInfoArr.target_jog }}分鐘</p>
                     </div>
                  </v-list-item>
               </v-card>
            </v-col>
         </v-row>
      </v-col>

      <!-- Sidebar Navigation in Card -->
      <v-col cols="12" sm="12" xl="12" md="5" lg="5">
         <v-card style="padding: 10px;">
            <div style="display: flex; background-color: #7edcbb">
               <img :src="editImage" class="page-btn-icon">
               <a class="page-btn" style="color: #FFFFFF">帳號資料編輯</a>
            </div>
            <div style="display: flex;">
               <img :src="pointsImage" class="page-btn-icon">
               <a href="#/userPoints" class="page-btn">個人累積點數</a>
            </div>
            <div style="display: flex;">
               <img :src="rankImage" class="page-btn-icon">
               <a href="#/groupRank" class="page-btn">群組排名紀錄</a>
            </div>
            <div style="display: flex;">
               <img :src="lockImage" class="page-btn-icon">
               <a href="#/changePwd" class="page-btn">變更帳號密碼</a>
            </div>
         </v-card>
      </v-col>
   </v-row>

   <!-- 等待執行結果動畫 -->
   <isLoading :active="isLoading" color="#76caad"/>
</template>

<script>
   import { getAccInfo, sendAccNickname } from '../JS/accinfoservice.js';
   import { useWindowWidth } from '../JS/winwidth.js';
   import { callback } from '../JS/callback.js';
   import { ref } from 'vue';

   import editImage from '../../assets/images/editing.png';
   import pointsImage from '../../assets/images/points.png';
   import rankImage from '../../assets/images/ranking.png';
   import lockImage from '../../assets/images/lock.png';
   import userImage from '../../assets/images/user.png';

   export default {
      name: 'accInfoPage',
      
      setup() {
         const { winwidth } = useWindowWidth();
         const accname = ref('');
         const accInfoArr = ref('');
         let isLoading = ref(false);

         // 呼叫 getVerifyCode 取得驗證碼資料
         getAccInfo(accInfoArr);

         async function handleSave(accname) { 
            sendAccNickname(accname);
            
            this.isLoading = true;

            try {
               const result = await callback(accname);
               this.isLoading = false;
               setTimeout(()=>{
                  alert(result);
               }, 500)
            } catch (error) {
               console.error(error);
            } finally {
               window.location.href = '#/accountInfo';
            }
         }
         
         return {
            winwidth,
            isLoading,
            editImage,
            pointsImage,
            rankImage,
            lockImage,
            userImage,
            accname,
            accInfoArr,
            handleSave,
         }
      }
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
