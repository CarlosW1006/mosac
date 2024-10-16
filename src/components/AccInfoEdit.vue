<template>
   <v-container fluid>
      <v-row :class="{ 'pa-4': winwidth }">
         <v-col cols="12" sm="7" md="6" lg="5">
            <v-card>
               <v-list-item class="list-title">
                  <h3 class="page-title">帳號資料編輯</h3> 
               </v-list-item>
                  
               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><h4>帳號名稱：</h4></v-col>
                     <v-col cols="7" sm="7" md="8"><p>Top001</p></v-col>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><h4>帳號類別：</h4></v-col>
                     <v-col cols="7" sm="7" md="8" style="display: flex;"><p>一般使用者</p>
                        <img :src="userImage" class="userImg">
                     </v-col>
                  </div>
               </v-list-item>

               <v-list-item class="list-item">
                  <div class="flex-container">
                     <v-col cols="5" sm="5" md="4"><h4>用戶姓名：</h4></v-col>
                     <v-col cols="7" sm="7" md="8"><input type="string" id="steps" class="item-input" v-model="accname" placeholder="請輸入用戶名稱" /></v-col>
                  </div>
               </v-list-item>
            </v-card>
         </v-col>

         <!-- <v-col cols="12" md="6" lg="6" v-if="winwidth == true" /> -->

         <v-col cols="12" sm="5" md="5" lg="5">
            <v-btn href="#/accInfoEdit" class="pageBtn" @click="handleSave(accname)" :disabled="buttonStatus"><h3>{{ editStatus }}</h3></v-btn>
         </v-col>
      </v-row>
   </v-container>
</template>

<script>
   import userImage from '../assets/images/user.png';
   import { useWindowWidth } from './winwidth.js';
   import { callback } from './callback.js';
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

         async function handleSave(accname) {
            editStatus.value = '資料處理中...';
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
            userImage,
            winwidth,
            drawer,
            session,
            accname,
            editStatus,
            buttonStatus,
            handleSave,
         };
      },
   };
</script>

<style lang="css" scoped>
   @import "../assets/css/common.css";
   @import "../assets/css/accountInfo.css";
</style>