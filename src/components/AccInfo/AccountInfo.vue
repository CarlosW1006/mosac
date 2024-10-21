<template>
   <div class="page-tab flex-container">
      <a href="#/index" class="tab-L">回到首頁</a> <p class="tab-R">首頁＞帳號資料</p>
   </div>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <!-- Main Profile Content -->
         <v-col cols="12" sm="12" xl="12" md="7" lg="7">
            <!-- Profile Section -->
            <!-- <v-card> -->
               <v-row>
                  <v-col cols="12">
                     <v-card>
                        <v-list-item class="list-title">
                           <div class="flex-container" style="justify-content: space-between;">
                              <h3 class="page-title">帳號資料檢視</h3>
                              <v-btn class="save-btn" @click="handleSave(accname)" :disabled="buttonStatus">儲存</v-btn>
                           </div>
                        </v-list-item>
                           
                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">帳號名稱：</h4>
                              <p class="list-info50">Top001</p>
                           </div>
                        </v-list-item>

                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">帳號類別：</h4>
                              <p class="list-info50">一般使用者</p>
                              <img :src="userImage" class="userImg">
                           </div>
                        </v-list-item>

                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">帳號姓名：</h4>
                              <p class="list-info50">李ＯＯ</p>
                           </div>
                        </v-list-item>
                        
                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">帳號暱稱：</h4>
                              <input type="string" id="steps" class="item-input" v-model="accname" placeholder="請輸入暱稱" />
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
                              <p class="list-info50">準備期</p>
                           </div>
                        </v-list-item>

                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">目標體重：</h4>
                              <p class="list-info50">65公斤</p>
                           </div>
                        </v-list-item>

                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">每日步數：</h4>
                              <p class="list-info50">4500步</p>
                           </div>
                        </v-list-item>

                        <v-list-item class="list-item">
                           <div class="flex-container">
                              <h4 class="list-name">慢跑時間：</h4>
                              <p class="list-info50">30分鐘</p>
                           </div>
                        </v-list-item>
                     </v-card>
                  </v-col>
               </v-row>
            <!-- </v-card> -->
         </v-col>

         <!-- Sidebar Navigation in Card -->
         <v-col cols="12" sm="12" xl="12" md="5" lg="5">
            <v-card style="padding-top: 6px;">
               <v-list>
                  <v-list-item-group>
                     <v-list-item>
                        <v-list-item-content style="display: flex; background-color: #7edcbb">
                           <img :src="editImage" class="page-btn-icon">
                           <v-list-item-title class="page-btn-container"><a class="page-btn" style="color: #FFFFFF;">帳號資料編輯</a></v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                     <v-list-item>
                        <v-list-item-content style="display: flex;">
                           <img :src="pointsImage" class="page-btn-icon">
                           <v-list-item-title class="page-btn-container"><a href="#/userPoints" class="page-btn">個人累積點數</a></v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                     <v-list-item>
                        <v-list-item-content style="display: flex;">
                           <img :src="rankImage" class="page-btn-icon">
                           <v-list-item-title class="page-btn-container"><a href="#/groupRank" class="page-btn">群組排名紀錄</a></v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                     <v-list-item>
                        <v-list-item-content style="display: flex;">
                           <img :src="lockImage" class="page-btn-icon">
                           <v-list-item-title class="page-btn-container"><a href="#/changePwd" class="page-btn">變更帳號密碼</a></v-list-item-title>
                        </v-list-item-content>
                     </v-list-item>
                  </v-list-item-group>
               </v-list>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import { useWindowWidth } from '../JS/winwidth.js';
   import editImage from '../../assets/images/editing.png';
   import pointsImage from '../../assets/images/points.png';
   import rankImage from '../../assets/images/ranking.png';
   import lockImage from '../../assets/images/lock.png';
   import userImage from '../../assets/images/user.png';
   import { callback } from '../JS/callback.js';
   import { ref } from 'vue';

   export default {
      name: 'accInfoPage',
      
      setup() {
         const { winwidth } = useWindowWidth();
         const buttonStatus = ref(false);
         const accname = ref('');

         async function handleSave(accname) { 
            buttonStatus.value = true;

            try {
               const result = await callback(accname);
               alert(result);
            } catch (error) {
               console.error( error);
            } finally {
               window.location.href = '#/accountInfo';
            }
         }
         
         return {
            winwidth,
            editImage,
            pointsImage,
            rankImage,
            lockImage,
            userImage,
            accname,
            handleSave,
         };
      }
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>
