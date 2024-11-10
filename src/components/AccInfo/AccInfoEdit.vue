<template>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <v-col cols="12" sm="12" md="5" lg="5">
            <v-card>
               <v-list-item class="list-title">
                  <h3 class="page-title">帳號資料檢視</h3>
                  <v-btn>儲存</v-btn>
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
                     <h4 class="list-name">使用者姓名：</h4>
                     <p class="list-info30">李ＯＯ</p>
                  </div>
               </v-list-item>
               
               <v-list-item class="list-item">
                  <div class="flex-container">
                     <h4 class="list-name">使用者暱稱：</h4>
                     <input type="string" id="steps" class="item-input" style="margin-left: 30px;" v-model="accname" placeholder="請輸入用戶名稱" />
                  </div>
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

         <!-- <v-col cols="12" md="6" lg="6" v-if="winwidth == true" /> -->

         <v-col cols="12" sm="12" md="5" lg="5">
            <v-btn href="#/accInfoEdit" class="pageBtn" @click="handleSave(accname)" :disabled="buttonStatus"><h3>{{ editStatus }}</h3></v-btn>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import { useWindowWidth } from '../../components/JS/winwidth';
   import userImage from '../../assets/images/user.png';
   import { ref } from 'vue';

   export default {
      name: 'accInfoEditPage',
      setup() {
         const { winwidth } = useWindowWidth();
         const drawer = ref(false);
         const accname = ref('');
         const editStatus = ref('儲存帳號資料');
         const buttonStatus = ref(false);

         let session = sessionStorage.getItem('session');

         function handleSave(accname) {
            editStatus.value = '資料處理中...';
            buttonStatus.value = true;

            try { 
               alert(result);
            } catch (error) {
               console.error( error);
            } finally {
               window.location.href = '#/accountInfo';
            }
         }

         return {
            winwidth,
            drawer,
            session,
            accname,
            userImage,
            editStatus,
            buttonStatus,
            handleSave,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../../assets/css/common.css";
   @import "../../assets/css/accountInfo.css";
</style>